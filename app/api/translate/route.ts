import { NextResponse, type NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang = "en", targetLang } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    if (!targetLang) {
      return NextResponse.json({ error: "Target language is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 })
    }

    // Create a system prompt that instructs the model to translate
    const systemPrompt = `You are a professional translator. Translate the following text from ${sourceLang} to ${targetLang}. 
    Maintain the original meaning, tone, and formatting as closely as possible. 
    If there are any culturally specific references that might not translate well, 
    provide an appropriate equivalent in the target language.`

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        temperature: 0.3, // Lower temperature for more accurate translations
      }),
    })

    const data = await completion.json()

    if (!completion.ok) {
      console.error("OpenAI error:", data)
      return NextResponse.json({ error: data.error?.message || "Translation Error" }, { status: 500 })
    }

    return NextResponse.json({
      translation: data.choices[0].message.content.trim(),
      sourceLang,
      targetLang,
    })
  } catch (error) {
    console.error("Unhandled error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
