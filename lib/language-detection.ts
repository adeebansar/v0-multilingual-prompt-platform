import type { Language } from "@/components/language-provider"

// Simple language detection based on common words and patterns
export async function detectLanguage(text: string): Promise<Language> {
  // Default to English if text is too short
  if (!text || text.length < 10) {
    return "en"
  }

  // Use the OpenAI API for more accurate language detection
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return fallbackDetectLanguage(text)
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a language detection tool. Respond with only the ISO 639-1 language code (en, es, fr, de, zh, ja, ar, hi, ur, te, ta) that best matches the language of the provided text. If unsure, respond with 'en'.",
          },
          { role: "user", content: text },
        ],
        temperature: 0.1,
        max_tokens: 5,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      const detectedLang = data.choices[0].message.content.trim().toLowerCase()

      // Validate that the response is a supported language code
      if (["en", "es", "fr", "de", "zh", "ja", "ar", "hi", "ur", "te", "ta"].includes(detectedLang)) {
        return detectedLang as Language
      }
    }

    // Fall back to simple detection if API fails
    return fallbackDetectLanguage(text)
  } catch (error) {
    console.error("Language detection error:", error)
    return fallbackDetectLanguage(text)
  }
}

// Simple fallback language detection based on character sets and common words
function fallbackDetectLanguage(text: string): Language {
  const normalizedText = text.toLowerCase()

  // Check for languages with distinct character sets
  if (/[\u0600-\u06FF]/.test(text)) return "ar" // Arabic
  if (/[\u0900-\u097F]/.test(text)) return "hi" // Hindi
  if (/[\u0621-\u064A\u0660-\u0669]/.test(text)) return "ur" // Urdu
  if (/[\u0C00-\u0C7F]/.test(text)) return "te" // Telugu
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta" // Tamil
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh" // Chinese
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return "ja" // Japanese

  // Check for European languages based on common words and patterns
  const spanishWords = ["el", "la", "los", "las", "es", "son", "y", "o", "pero", "porque", "como"]
  const frenchWords = ["le", "la", "les", "est", "sont", "et", "ou", "mais", "parce", "comme"]
  const germanWords = ["der", "die", "das", "ist", "sind", "und", "oder", "aber", "weil", "wie"]

  // Count occurrences of language-specific words
  let spanishCount = 0
  let frenchCount = 0
  let germanCount = 0

  const words = normalizedText.split(/\s+/)

  for (const word of words) {
    if (spanishWords.includes(word)) spanishCount++
    if (frenchWords.includes(word)) frenchCount++
    if (germanWords.includes(word)) germanCount++
  }

  // Determine language based on word counts
  const maxCount = Math.max(spanishCount, frenchCount, germanCount)

  if (maxCount > 2) {
    if (maxCount === spanishCount) return "es"
    if (maxCount === frenchCount) return "fr"
    if (maxCount === germanCount) return "de"
  }

  // Default to English if no clear match
  return "en"
}
