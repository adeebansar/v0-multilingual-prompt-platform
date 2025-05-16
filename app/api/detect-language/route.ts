import { type NextRequest, NextResponse } from "next/server"
import type { Language } from "@/lib/i18n"

// Simple language detection based on character sets and common words
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Simple language detection logic
    const detectedLanguage = detectLanguage(text)

    return NextResponse.json({ language: detectedLanguage })
  } catch (error) {
    console.error("Language detection error:", error)
    return NextResponse.json({ error: "Failed to detect language" }, { status: 500 })
  }
}

// Simple language detection function
function detectLanguage(text: string): Language {
  // Default to English
  const detectedLanguage: Language = "en"

  // Normalize text for comparison
  const normalizedText = text.toLowerCase()

  // Check for specific character sets
  if (/[\u0600-\u06FF]/.test(text)) {
    // Arabic script
    if (/[\u0627\u0644]/.test(text)) {
      return "ar" // Arabic
    } else {
      return "ur" // Urdu
    }
  } else if (/[\u0900-\u097F]/.test(text)) {
    return "hi" // Hindi
  } else if (/[\u0C00-\u0C7F]/.test(text)) {
    return "te" // Telugu
  } else if (/[\u0B80-\u0BFF]/.test(text)) {
    return "ta" // Tamil
  } else if (/[\u4E00-\u9FFF]/.test(text)) {
    return "zh" // Chinese
  } else if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
    return "ja" // Japanese
  }

  // Check for common words and patterns in European languages
  const words = normalizedText.split(/\s+/)

  // Spanish indicators
  const spanishWords = ["el", "la", "los", "las", "y", "en", "es", "por", "que", "como", "para"]
  if (
    spanishWords.some((word) => words.includes(word)) ||
    normalizedText.includes("ñ") ||
    /¿|á|é|í|ó|ú/.test(normalizedText)
  ) {
    return "es"
  }

  // French indicators
  const frenchWords = ["le", "la", "les", "et", "en", "est", "pour", "que", "comme", "dans"]
  if (frenchWords.some((word) => words.includes(word)) || /ç|à|â|ê|è|é|ë|î|ï|ô|œ|ù|û|ü|ÿ/.test(normalizedText)) {
    return "fr"
  }

  // German indicators
  const germanWords = ["der", "die", "das", "und", "ist", "für", "wie", "mit", "auf", "dem"]
  if (germanWords.some((word) => words.includes(word)) || /ä|ö|ü|ß/.test(normalizedText)) {
    return "de"
  }

  // Default to English
  return detectedLanguage
}
