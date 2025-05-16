import { NextResponse } from "next/server"

export async function GET() {
  // Check if the OpenAI API key is set in environment variables
  const hasApiKey = !!process.env.OPENAI_API_KEY

  return NextResponse.json({ hasApiKey })
}
