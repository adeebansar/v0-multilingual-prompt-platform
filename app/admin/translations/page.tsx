"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TranslationManager } from "@/components/translation-manager"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Define types based on MOCK_LESSON_CONTENT and TranslationManager expectations
type Language = "es" | "fr" | string; // Add other languages as needed, or use a more generic string

interface TranslationDetail {
  text: string;
  isVerified: boolean;
  lastUpdated: string;
}

interface TranslationItem {
  id: string;
  key: string;
  sourceText: string;
  translations: Record<Language, TranslationDetail>;
}

// Mock data for demonstration
const MOCK_LESSON_CONTENT: TranslationItem[] = [
  {
    id: "lesson1-intro",
    key: "lesson1.introduction",
    sourceText:
      "Prompt engineering is the process of designing and refining inputs to AI models to get desired outputs. It's a crucial skill for working with large language models like GPT-4.",
    translations: {
      es: {
        text: "La ingeniería de prompts es el proceso de diseñar y refinar entradas para modelos de IA para obtener los resultados deseados. Es una habilidad crucial para trabajar con modelos de lenguaje grandes como GPT-4.",
        isVerified: true,
        lastUpdated: "2023-10-15T14:30:00Z",
      },
      fr: {
        text: "L'ingénierie de prompts est le processus de conception et d'affinage des entrées des modèles d'IA pour obtenir les résultats souhaités. C'est une compétence cruciale pour travailler avec de grands modèles de langage comme GPT-4.",
        isVerified: false,
        lastUpdated: "2023-10-16T09:15:00Z",
      },
    },
  },
  {
    id: "lesson1-why",
    key: "lesson1.whyItMatters",
    sourceText:
      "Effective prompts can dramatically improve the quality, relevance, and accuracy of AI-generated content. Poor prompts often lead to irrelevant or low-quality outputs.",
    translations: {
      es: {
        text: "Los prompts efectivos pueden mejorar dramáticamente la calidad, relevancia y precisión del contenido generado por IA. Los prompts deficientes a menudo conducen a resultados irrelevantes o de baja calidad.",
        isVerified: true,
        lastUpdated: "2023-10-15T14:35:00Z",
      },
    },
  },
]

export default function TranslationsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [translationItems, setTranslationItems] = useState(MOCK_LESSON_CONTENT)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSaveTranslations = (items: TranslationItem[]) => {
    // In a real app, this would save to a database
    setTranslationItems(items)

    toast({
      title: t("translationsSaved", "Translations Saved"),
      description: t("translationsUpdatedSuccessfully", "Your translations have been updated successfully."),
    })
  }

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("loadingTranslations", "Loading translations...")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("translationManagement", "Translation Management")}</h1>
        <Button variant="outline">{t("importExport", "Import/Export")}</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("translationDashboard", "Translation Dashboard")}</CardTitle>
          <CardDescription>
            {t("translationDashboardDesc", "Manage translations for lessons, UI elements, and templates.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">11</div>
                <p className="text-sm text-muted-foreground">{t("languages", "Languages")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">42%</div>
                <p className="text-sm text-muted-foreground">{t("translationCoverage", "Translation Coverage")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">28%</div>
                <p className="text-sm text-muted-foreground">{t("humanVerified", "Human Verified")}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <TranslationManager initialItems={translationItems} onSave={handleSaveTranslations} />
    </div>
  )
}
