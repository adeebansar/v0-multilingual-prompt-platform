// app/api/generate/route.ts
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = "gpt-3.5-turbo", temperature = 0.7, language = "en" } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 })
    }

    // Add language instruction to the system message
    const systemMessage =
      language === "en"
        ? "You are a helpful assistant specializing in prompt engineering."
        : `You are a helpful assistant specializing in prompt engineering. Please respond in ${language}.`

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        temperature: Number.parseFloat(temperature),
      }),
    })

    const data = await completion.json()

    if (!completion.ok) {
      console.error("OpenAI error:", data)
      return NextResponse.json({ error: data.error?.message || "OpenAI Error" }, { status: 500 })
    }

    return NextResponse.json({ result: data.choices[0].message.content.trim() })
  } catch (error) {
    console.error("Unhandled error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
