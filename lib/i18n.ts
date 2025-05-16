export type Language = "en" | "es" | "fr" | "de" | "zh" | "ja" | "ar" | "hi" | "ur" | "te" | "ta"

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
  ja: "日本語",
  ar: "العربية",
  hi: "हिन्दी",
  ur: "اردو",
  te: "తెలుగు",
  ta: "தமிழ்",
}

export const RTL_LANGUAGES: Language[] = ["ar", "ur"]

export function isRTL(language: Language): boolean {
  return RTL_LANGUAGES.includes(language)
}

export function getDirection(language: Language): "ltr" | "rtl" {
  return isRTL(language) ? "rtl" : "ltr"
}

export function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return "en"

  const browserLang = navigator.language.split("-")[0]

  // Check if the browser language is one of our supported languages
  if (Object.keys(LANGUAGE_NAMES).includes(browserLang as Language)) {
    return browserLang as Language
  }

  return "en" // Default to English
}
