import { streamText, generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"
import { countTokens, estimateCost } from "@/lib/token-counter"

export async function POST(request: Request) {
  console.log("API route called with:", {
    promptProvided: !!request.body,
    apiKeyFromEnv: !!process.env.OPENAI_API_KEY,
  })

  try {
    const { prompt, model, temperature, apiKey, stream } = await request.json()

    console.log("Request parsed:", {
      promptLength: prompt?.length,
      model,
      temperature,
      apiKeyProvided: !!apiKey,
      stream,
    })

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Use the provided API key or fall back to environment variable
    const openAiApiKey = apiKey || process.env.OPENAI_API_KEY

    if (!openAiApiKey) {
      return NextResponse.json(
        {
          error: "OpenAI API key is not configured",
          errorCode: "NO_API_KEY",
        },
        { status: 401 },
      )
    }

    // Count tokens for usage tracking
    const promptTokens = countTokens(prompt)

    if (stream) {
      try {
        // Create a streaming response using the AI SDK
        const streamResult = streamText({
          model: openai(model || "gpt-4o", { apiKey: openAiApiKey }),
          prompt: prompt,
          temperature: temperature || 0.7,
        })

        // The AI SDK's streamText returns a StreamableValue, which we can convert to a Response
        // using the built-in toDataStreamResponse method
        const response = streamResult.toDataStreamResponse({
          onChunk: (chunk) => {
            // This function is called for each chunk of the stream
            // We can transform the chunks here if needed
            return {
              chunk: chunk.text || "",
            }
          },
          onFinal: async (completion) => {
            // This function is called when the stream is complete
            // We can add final metadata here
            const completionTokens = countTokens(completion.text)
            const totalTokens = promptTokens + completionTokens
            const cost = estimateCost(model || "gpt-4o", promptTokens, completionTokens)

            return {
              done: true,
              usage: {
                promptTokens,
                completionTokens,
                totalTokens,
                cost,
              },
            }
          },
        })

        return response
      } catch (streamError) {
        console.error("Streaming error:", streamError)
        throw streamError
      }
    } else {
      // Non-streaming response
      const result = await generateText({
        model: openai(model || "gpt-4o", { apiKey: openAiApiKey }),
        prompt: prompt,
        temperature: temperature || 0.7,
      })

      // Calculate token usage and cost
      const completionTokens = countTokens(result.text)
      const totalTokens = promptTokens + completionTokens
      const cost = estimateCost(model || "gpt-4o", promptTokens, completionTokens)

      return NextResponse.json({
        text: result.text,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens,
          cost,
        },
      })
    }
  } catch (error: any) {
    console.error("Error generating text:", error)

    // Check for specific OpenAI API errors
    if (error.message?.includes("API key")) {
      return NextResponse.json(
        {
          error: "Invalid OpenAI API key",
          errorCode: "INVALID_API_KEY",
        },
        { status: 401 },
      )
    }

    return NextResponse.json(
      {
        error: error.message || "Failed to generate response",
        errorCode: "GENERATION_ERROR",
      },
      { status: 500 },
    )
  }
}
