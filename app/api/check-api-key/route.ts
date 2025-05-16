import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if the OpenAI API key is set in environment variables
    const hasApiKey = !!process.env.OPENAI_API_KEY

    return NextResponse.json({ hasApiKey })
  } catch (error) {
    console.error("Error checking API key:", error)
    return NextResponse.json({ hasApiKey: false, error: "Failed to check API key" }, { status: 500 })
  }
}
