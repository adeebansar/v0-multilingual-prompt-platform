"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, Globe, Edit } from "lucide-react"
import { useLanguage, type Language } from "@/components/language-provider"
import { useToast } from "@/hooks/use-toast"

interface TranslationItem {
  id: string
  key: string
  sourceText: string
  translations: Record<
    Language,
    {
      text: string
      isVerified: boolean
      lastUpdated: string
    }
  >
}

interface TranslationManagerProps {
  initialItems?: TranslationItem[]
  onSave?: (items: TranslationItem[]) => void
  readOnly?: boolean
}

export function TranslationManager({ initialItems = [], onSave, readOnly = false }: TranslationManagerProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [items, setItems] = useState<TranslationItem[]>(initialItems)
  const [activeTab, setActiveTab] = useState<string>("lessons")
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({})
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const handleGenerateTranslation = async (item: TranslationItem, targetLang: Language) => {
    const itemKey = `${item.id}-${targetLang}`
    setIsGenerating((prev) => ({ ...prev, [itemKey]: true }))

    try {
      // Call the API to generate a translation
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: item.sourceText,
          sourceLang: "en", // Assuming English is the source language
          targetLang,
        }),
      })

      if (!response.ok) {
        throw new Error("Translation failed")
      }

      const data = await response.json()

      // Update the item with the new translation
      const updatedItems = items.map((i) => {
        if (i.id === item.id) {
          return {
            ...i,
            translations: {
              ...i.translations,
              [targetLang]: {
                text: data.translation,
                isVerified: false,
                lastUpdated: new Date().toISOString(),
              },
            },
          }
        }
        return i
      })

      setItems(updatedItems)
      if (onSave) onSave(updatedItems)

      toast({
        title: t("translationGenerated", "Translation Generated"),
        description: t(
          "aiTranslationGenerated",
          "AI-generated translation has been added. Please review for accuracy.",
        ),
      })
    } catch (error) {
      console.error("Translation error:", error)
      toast({
        title: t("translationFailed", "Translation Failed"),
        description: t("translationError", "There was an error generating the translation. Please try again."),
        variant: "destructive",
      })
    } finally {
      setIsGenerating((prev) => ({ ...prev, [itemKey]: false }))
    }
  }

  const handleVerifyTranslation = (item: TranslationItem, targetLang: Language) => {
    const updatedItems = items.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          translations: {
            ...i.translations,
            [targetLang]: {
              ...i.translations[targetLang],
              isVerified: true,
              lastUpdated: new Date().toISOString(),
            },
          },
        }
      }
      return i
    })

    setItems(updatedItems)
    if (onSave) onSave(updatedItems)

    toast({
      title: t("translationVerified", "Translation Verified"),
      description: t("translationMarkedAsVerified", "The translation has been marked as human-verified."),
    })
  }

  const handleEditTranslation = (item: TranslationItem, targetLang: Language) => {
    setEditingItem(`${item.id}-${targetLang}`)
    setEditText(item.translations[targetLang]?.text || "")
  }

  const handleSaveEdit = (item: TranslationItem, targetLang: Language) => {
    const updatedItems = items.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          translations: {
            ...i.translations,
            [targetLang]: {
              text: editText,
              isVerified: true,
              lastUpdated: new Date().toISOString(),
            },
          },
        }
      }
      return i
    })

    setItems(updatedItems)
    if (onSave) onSave(updatedItems)
    setEditingItem(null)

    toast({
      title: t("translationUpdated", "Translation Updated"),
      description: t("translationSaved", "Your changes to the translation have been saved."),
    })
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditText("")
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="lessons">{t("lessons", "Lessons")}</TabsTrigger>
          <TabsTrigger value="ui">{t("userInterface", "User Interface")}</TabsTrigger>
          <TabsTrigger value="templates">{t("templates", "Templates")}</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-4">
          {items.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">{t("noTranslationItems", "No translation items available")}</p>
              </CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-base">{item.key}</CardTitle>
                  <CardDescription>{t("originalText", "Original Text (English)")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-md mb-6">
                    <p>{item.sourceText}</p>
                  </div>

                  <h4 className="font-medium mb-3">{t("translations", "Translations")}</h4>

                  <div className="space-y-4">
                    {Object.entries(item.translations).map(([lang, translation]) => {
                      const itemKey = `${item.id}-${lang}`
                      const isEditing = editingItem === itemKey

                      return (
                        <div key={lang} className="border rounded-md p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <span>{lang}</span>
                              {translation.isVerified ? (
                                <Badge variant="success" className="flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  {t("verified", "Verified")}
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {t("aiGenerated", "AI Generated")}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("lastUpdated", "Last updated")}:{" "}
                              {new Date(translation.lastUpdated).toLocaleDateString()}
                            </div>
                          </div>

                          {isEditing ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="min-h-[100px]"
                              />
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                  {t("cancel", "Cancel")}
                                </Button>
                                <Button size="sm" onClick={() => handleSaveEdit(item, lang as Language)}>
                                  {t("save", "Save")}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{translation.text}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
                {!readOnly && (
                  <CardFooter className="flex flex-wrap gap-2">
                    {Object.keys(item.translations).length < 10 && (
                      <div className="flex flex-wrap gap-2">
                        {(["es", "fr", "de", "zh", "ja", "ar", "hi", "ur", "te", "ta"] as Language[])
                          .filter((lang) => !item.translations[lang])
                          .map((lang) => (
                            <Button
                              key={lang}
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateTranslation(item, lang)}
                              disabled={isGenerating[`${item.id}-${lang}`]}
                            >
                              {isGenerating[`${item.id}-${lang}`] ? (
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              ) : (
                                <Globe className="mr-2 h-3 w-3" />
                              )}
                              {t("generateIn", "Generate in")} {lang}
                            </Button>
                          ))}
                      </div>
                    )}

                    {Object.entries(item.translations)
                      .filter(([_langInFilter, translation]) => !translation.isVerified)
                      .map(([lang]) => (
                        <Button
                          key={`verify-${lang}`}
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerifyTranslation(item, lang as Language)}
                        >
                          <Check className="mr-2 h-3 w-3" />
                          {t("verifyTranslation", "Verify")} {lang}
                        </Button>
                      ))}

                    {Object.keys(item.translations).map((lang) => (
                      <Button
                        key={`edit-${lang}`}
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTranslation(item, lang as Language)}
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        {t("edit", "Edit")} {lang}
                      </Button>
                    ))}
                  </CardFooter>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="ui">
          <Card>
            <CardContent className="pt-6">
              <p>{t("uiTranslationsComingSoon", "UI translations management coming soon.")}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardContent className="pt-6">
              <p>{t("templateTranslationsComingSoon", "Template translations management coming soon.")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
