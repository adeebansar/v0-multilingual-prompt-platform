import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({ status: "ok", message: "API is working" })
  } catch (error) {
    console.error("Error in test route:", error)
    return NextResponse.json({ status: "error", message: "API error" }, { status: 500 })
  }
}
