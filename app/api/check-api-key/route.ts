import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    return NextResponse.json({
      hasApiKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
    })
  } catch (error) {
    console.error("Error checking API key:", error)
    return NextResponse.json({ error: "Failed to check API key" }, { status: 500 })
  }
}
