import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if the OpenAI API key is set in environment variables
    const hasApiKey = !!process.env.OPENAI_API_KEY

    // Don't return the actual key, just whether it exists
    return NextResponse.json({
      hasApiKey,
      message: hasApiKey ? "OpenAI API key is configured" : "OpenAI API key is not configured",
    })
  } catch (error) {
    console.error("Error checking API key:", error)
    return NextResponse.json({ error: "Failed to check API key" }, { status: 500 })
  }
}
