"use client"

import { useState, useEffect } from "react"
import { Check, Globe, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useLanguage, type Language } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"

const LANGUAGE_NAMES: Record<Language, string> = {
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

const LANGUAGE_FLAGS: Record<Language, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  zh: "🇨🇳",
  ja: "🇯🇵",
  ar: "🇸🇦",
  hi: "🇮🇳",
  ur: "🇵🇰",
  te: "🇮🇳",
  ta: "🇮🇳",
}

export function LanguageSwitcher({ variant = "default" }: { variant?: "default" | "minimal" | "full" }) {
  const { language, setLanguage, t } = useLanguage()
  const [detectedLanguage, setDetectedLanguage] = useState<Language | null>(null)
  const [showDetectedBadge, setShowDetectedBadge] = useState(false)

  // Detect browser language on component mount
  useEffect(() => {
    try {
      const browserLang = navigator.language.split("-")[0] as Language
      if (Object.keys(LANGUAGE_NAMES).includes(browserLang) && browserLang !== language) {
        setDetectedLanguage(browserLang)
        setShowDetectedBadge(true)

        // Hide the badge after 10 seconds
        const timer = setTimeout(() => {
          setShowDetectedBadge(false)
        }, 10000)

        return () => clearTimeout(timer)
      }
    } catch (error) {
      console.error("Error detecting browser language:", error)
    }
  }, [language])

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as Language)
    setShowDetectedBadge(false)
  }

  const handleUseDetectedLanguage = () => {
    if (detectedLanguage) {
      setLanguage(detectedLanguage)
      setShowDetectedBadge(false)
    }
  }

  if (variant === "minimal") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Globe className="h-4 w-4" />
            <span className="sr-only">Switch language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
            {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
              <DropdownMenuRadioItem key={code} value={code}>
                <span className="mr-2">{LANGUAGE_FLAGS[code as Language]}</span>
                {name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === "full") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("selectLanguage", "Select Language")}</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
            <Button
              key={code}
              variant={language === code ? "default" : "outline"}
              className="justify-start"
              onClick={() => handleLanguageChange(code)}
            >
              <span className="mr-2">{LANGUAGE_FLAGS[code as Language]}</span>
              {name}
              {language === code && <Check className="ml-auto h-4 w-4" />}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <span>{LANGUAGE_FLAGS[language]}</span>
            <span>{LANGUAGE_NAMES[language]}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
            {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
              <DropdownMenuRadioItem key={code} value={code} className="cursor-pointer">
                <span className="mr-2">{LANGUAGE_FLAGS[code as Language]}</span>
                {name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {showDetectedBadge && detectedLanguage && (
        <Badge
          variant="secondary"
          className="absolute -top-6 right-0 cursor-pointer animate-pulse"
          onClick={handleUseDetectedLanguage}
        >
          {t("switchTo", "Switch to")} {LANGUAGE_NAMES[detectedLanguage]}?
        </Badge>
      )}
    </div>
  )
}
