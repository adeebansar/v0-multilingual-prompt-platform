"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Languages, Save, Download, Upload, Plus, Trash2, Edit } from "lucide-react"
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n"

interface TranslationEntry {
  key: string
  translations: Record<Language, string>
  category: string
  description?: string
}

export default function TranslationManagementPage() {
  const { toast } = useToast()
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en")
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [newKey, setNewKey] = useState("")
  const [newTranslation, setNewTranslation] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [editingKey, setEditingKey] = useState<string | null>(null)

  // Mock translation data - in real app, this would come from a database
  const [translations, setTranslations] = useState<TranslationEntry[]>([
    {
      key: "welcome",
      translations: {
        en: "Welcome to ScriptShift",
        es: "Bienvenido a ScriptShift",
        fr: "Bienvenue à ScriptShift",
        de: "Willkommen bei ScriptShift",
        zh: "欢迎来到ScriptShift",
        ja: "ScriptShiftへようこそ",
        ar: "مرحباً بك في ScriptShift",
        hi: "ScriptShift में आपका स्वागत है",
        ur: "ScriptShift میں خوش آمدید",
        te: "ScriptShift కి స్వాగతం",
        ta: "ScriptShift க்கு வரவேற்கிறோம்",
      },
      category: "general",
      description: "Main welcome message",
    },
    {
      key: "playground",
      translations: {
        en: "Playground",
        es: "Área de Juegos",
        fr: "Terrain de Jeu",
        de: "Spielplatz",
        zh: "游乐场",
        ja: "プレイグラウンド",
        ar: "ملعب",
        hi: "खेल का मैदान",
        ur: "کھیل کا میدان",
        te: "ఆట స్థలం",
        ta: "விளையாட்டு மைதானம்",
      },
      category: "navigation",
      description: "Playground page title",
    },
  ])

  const categories = ["general", "navigation", "lessons", "playground", "settings", "errors"]

  const handleAddTranslation = () => {
    if (!newKey || !newTranslation) {
      toast({
        title: "Missing Information",
        description: "Please provide both key and translation",
        variant: "destructive",
      })
      return
    }

    const newEntry: TranslationEntry = {
      key: newKey,
      translations: {
        en: "",
        es: "",
        fr: "",
        de: "",
        zh: "",
        ja: "",
        ar: "",
        hi: "",
        ur: "",
        te: "",
        ta: "",
        [selectedLanguage]: newTranslation,
      },
      category: newCategory || selectedCategory,
    }

    setTranslations([...translations, newEntry])
    setNewKey("")
    setNewTranslation("")
    setNewCategory("")

    toast({
      title: "Translation Added",
      description: `Added new translation key: ${newKey}`,
    })
  }

  const handleUpdateTranslation = (key: string, language: Language, value: string) => {
    setTranslations(
      translations.map((entry) =>
        entry.key === key
          ? {
              ...entry,
              translations: {
                ...entry.translations,
                [language]: value,
              },
            }
          : entry,
      ),
    )
  }

  const handleDeleteTranslation = (key: string) => {
    setTranslations(translations.filter((entry) => entry.key !== key))
    toast({
      title: "Translation Deleted",
      description: `Deleted translation key: ${key}`,
    })
  }

  const handleExportTranslations = () => {
    const exportData = translations.reduce(
      (acc, entry) => {
        acc[entry.key] = entry.translations
        return acc
      },
      {} as Record<string, Record<Language, string>>,
    )

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "translations.json"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Translations Exported",
      description: "Translation file downloaded successfully",
    })
  }

  const handleAutoTranslate = async (key: string, sourceText: string, targetLanguage: Language) => {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          targetLanguage,
          sourceLanguage: "en",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        handleUpdateTranslation(key, targetLanguage, data.translatedText)
        toast({
          title: "Auto-translation Complete",
          description: `Translated to ${targetLanguage}`,
        })
      }
    } catch (error) {
      toast({
        title: "Translation Failed",
        description: "Auto-translation service unavailable",
        variant: "destructive",
      })
    }
  }

  const filteredTranslations = translations.filter((entry) => entry.category === selectedCategory)

  const getCompletionPercentage = (entry: TranslationEntry) => {
    const completed = Object.values(entry.translations).filter((t) => t.trim() !== "").length
    return Math.round((completed / SUPPORTED_LANGUAGES.length) * 100)
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Languages className="h-8 w-8" />
            Translation Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage translations for all supported languages</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportTranslations} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <Tabs defaultValue="manage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="manage">Manage Translations</TabsTrigger>
          <TabsTrigger value="add">Add New</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as Language)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredTranslations.map((entry) => (
              <Card key={entry.key}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{entry.key}</CardTitle>
                      {entry.description && <CardDescription>{entry.description}</CardDescription>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getCompletionPercentage(entry)}% complete</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingKey(editingKey === entry.key ? null : entry.key)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTranslation(entry.key)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingKey === entry.key ? (
                    <div className="grid gap-4">
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <div key={lang} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`${entry.key}-${lang}`}>{lang.toUpperCase()}</Label>
                            {lang !== "en" && entry.translations.en && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAutoTranslate(entry.key, entry.translations.en, lang)}
                              >
                                Auto-translate
                              </Button>
                            )}
                          </div>
                          <Textarea
                            id={`${entry.key}-${lang}`}
                            value={entry.translations[lang] || ""}
                            onChange={(e) => handleUpdateTranslation(entry.key, lang, e.target.value)}
                            placeholder={`Translation in ${lang}`}
                            className="min-h-[60px]"
                          />
                        </div>
                      ))}
                      <Button onClick={() => setEditingKey(null)} className="w-fit">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="font-medium">Current Translation ({selectedLanguage.toUpperCase()}):</div>
                      <div className="p-3 bg-muted rounded-md">
                        {entry.translations[selectedLanguage] || "No translation available"}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Translation</CardTitle>
              <CardDescription>Create a new translation key with initial value</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-key">Translation Key</Label>
                  <Input
                    id="new-key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="e.g., welcomeMessage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-category">Category</Label>
                  <Select value={newCategory || selectedCategory} onValueChange={setNewCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-translation">Initial Translation ({selectedLanguage.toUpperCase()})</Label>
                <Textarea
                  id="new-translation"
                  value={newTranslation}
                  onChange={(e) => setNewTranslation(e.target.value)}
                  placeholder="Enter the translation text"
                  className="min-h-[100px]"
                />
              </div>
              <Button onClick={handleAddTranslation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Translation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operations</CardTitle>
              <CardDescription>Perform operations on multiple translations at once</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">
                  <Languages className="h-4 w-4 mr-2" />
                  Auto-translate Missing
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Category
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Translations
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Backup All
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
