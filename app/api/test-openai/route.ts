import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OpenAI API key not found in environment variables",
          hasApiKey: false,
        },
        { status: 500 },
      )
    }

    // Test the API key with a simple request
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          error: "API key is invalid or expired",
          details: errorData,
          hasApiKey: true,
          isValid: false,
        },
        { status: 400 },
      )
    }

    const data = await response.json()

    return NextResponse.json({
      message: "OpenAI API key is working correctly",
      hasApiKey: true,
      isValid: true,
      availableModels: data.data?.slice(0, 5).map((model: any) => model.id) || [],
    })
  } catch (error) {
    console.error("Error testing OpenAI API:", error)
    return NextResponse.json(
      {
        error: "Failed to test OpenAI API",
        hasApiKey: !!process.env.OPENAI_API_KEY,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
