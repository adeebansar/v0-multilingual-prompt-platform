"use client"

import { CardFooter } from "@/components/ui/card"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import {
  Loader2,
  AlertCircle,
  Save,
  Share,
  Copy,
  Sparkles,
  BarChart2,
  Wand2,
  Lightbulb,
  Zap,
  Award,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { analyzePrompt, type PromptAnalysis } from "@/lib/prompt-analyzer"
import { usePromptStore } from "@/lib/prompt-store"
import { useUsageStore } from "@/lib/usage-store"
import { countTokens, estimateCost } from "@/lib/token-counter"
import { getLocalizedTemplates, getAllTemplates } from "@/lib/templates"
import { Progress } from "@/components/ui/progress"
import { type Language, LANGUAGE_NAMES } from "@/lib/i18n"
import { ImprovedPrompts } from "./improved-prompts"
import { ImprovedPromptsModal } from "./improved-prompts-modal"

export default function PlaygroundComponent() {
  const { translations, language, setLanguage, t } = useLanguage()
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [model, setModel] = useState("gpt-3.5-turbo")
  const [promptAnalysis, setPromptAnalysis] = useState<PromptAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState("playground")
  const [promptTokens, setPromptTokens] = useState(0)
  const [completionTokens, setCompletionTokens] = useState(0)
  const [activeTemplateCategory, setActiveTemplateCategory] = useState("general")
  const [showImprovedPromptsModal, setShowImprovedPromptsModal] = useState(false)

  const addPrompt = usePromptStore((state) => state.addPrompt)
  const addUsage = useUsageStore((state) => state.addUsage)

  // Memoize templates to prevent unnecessary re-renders
  const templates = useMemo(() => getLocalizedTemplates(language), [language])
  const allTemplates = useMemo(() => getAllTemplates(language), [language])

  // Add this state
  const [detectedInputLanguage, setDetectedInputLanguage] = useState<Language | null>(null)
  const [isDetectingLanguage, setIsDetectingLanguage] = useState(false)

  // Analyze prompt as user types - separated into its own effect
  useEffect(() => {
    if (!prompt.trim()) {
      setPromptAnalysis(null)
      setPromptTokens(0)
      return
    }

    const analysis = analyzePrompt(prompt, templates)
    setPromptAnalysis(analysis)
    setPromptTokens(countTokens(prompt))
  }, [prompt, templates])

  // Add this effect to detect language as user types
  useEffect(() => {
    if (!prompt.trim() || prompt.trim().length <= 20 || isDetectingLanguage) {
      return
    }

    const detectInputLanguage = async () => {
      setIsDetectingLanguage(true)

      try {
        const res = await fetch("/api/detect-language", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: prompt }),
        })

        if (res.ok) {
          const data = await res.json()
          if (data.language !== language) {
            setDetectedInputLanguage(data.language as Language)
          } else {
            setDetectedInputLanguage(null)
          }
        }
      } catch (error) {
        console.error("Language detection error:", error)
      } finally {
        setIsDetectingLanguage(false)
      }
    }

    const debounceTimer = setTimeout(detectInputLanguage, 1000)
    return () => clearTimeout(debounceTimer)
  }, [prompt, language, isDetectingLanguage])

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: translations.emptyPrompt || "Empty Prompt",
        description: translations.pleaseEnterPrompt || "Please enter a prompt to continue.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)
    setCompletionTokens(0)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model,
          temperature,
          language, // Pass the user's language preference
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Unknown error")
      }

      const data = await res.json()
      setResult(data.result)

      // Estimate completion tokens
      const estimatedCompletionTokens = countTokens(data.result)
      setCompletionTokens(estimatedCompletionTokens)

      // Record usage
      const today = new Date().toISOString().split("T")[0]
      addUsage({
        date: today,
        model,
        promptTokens,
        completionTokens: estimatedCompletionTokens,
        totalTokens: promptTokens + estimatedCompletionTokens,
        estimatedCost: estimateCost(model, promptTokens, completionTokens),
      })
    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message || "Something went wrong")

      toast({
        title: translations.error || "Error",
        description: err.message || translations.failedToGenerateResponse || "Failed to generate response",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePrompt = () => {
    if (prompt && result) {
      addPrompt({
        prompt,
        response: result,
        model,
        temperature,
        tags: [],
      })

      toast({
        title: translations.promptSaved || "Prompt saved",
        description: translations.promptSavedToLibrary || "Your prompt has been saved to your library.",
      })
    }
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    toast({
      title: translations.copiedToClipboard || "Copied to clipboard",
      description: translations.promptCopiedToClipboard || "Your prompt has been copied to the clipboard.",
    })
  }

  const handleUseTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt)
    setActiveTab("playground")
  }

  const handleUseImprovedPrompt = (improvedPrompt: string) => {
    setPrompt(improvedPrompt)
  }

  // Simplified language switch function
  const handleLanguageSwitch = (newLanguage: Language) => {
    if (setLanguage) {
      setLanguage(newLanguage)
      setDetectedInputLanguage(null)

      toast({
        title: `Language changed to ${LANGUAGE_NAMES[newLanguage]}`,
        description: "The interface language has been updated.",
      })
    }
  }

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500"
    if (score >= 60) return "from-yellow-400 to-amber-500"
    if (score >= 40) return "from-orange-400 to-orange-500"
    return "from-red-500 to-rose-500"
  }

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "outline" | "destructive" => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    if (score >= 40) return "outline"
    return "destructive"
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
        {translations.playground || "Playground"}
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="playground">{translations.playground || "Playground"}</TabsTrigger>
          <TabsTrigger value="templates">{translations.templates || "Templates"}</TabsTrigger>
          <TabsTrigger value="history">{translations.history || "History"}</TabsTrigger>
        </TabsList>

        <TabsContent value="playground" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Card className="border-purple-200 dark:border-purple-900 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                  <CardTitle className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      {translations.prompt || "Prompt"}
                    </span>
                    {promptAnalysis?.improvedPrompts.length > 0 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 text-white"
                        onClick={() => setShowImprovedPromptsModal(true)}
                      >
                        <Wand2 className="h-3.5 w-3.5" />
                        {translations.suggestPrompts || "Suggest Prompts"}
                      </Button>
                    )}
                  </CardTitle>
                  {promptAnalysis && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white/90">Prompt Quality Score</span>
                        <Badge variant={getScoreBadgeVariant(promptAnalysis.score)} className="text-white font-bold">
                          {promptAnalysis.score}/100
                        </Badge>
                      </div>
                      <Progress value={promptAnalysis.score} className="h-2 bg-white/20" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-6">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={translations.enterPromptHere || "Enter your prompt here..."}
                    className="min-h-[200px] border-purple-200 dark:border-purple-900 focus-visible:ring-purple-500"
                  />

                  {detectedInputLanguage && (
                    <div className="mt-2 text-sm">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-purple-600 dark:text-purple-400"
                        onClick={() => handleLanguageSwitch(detectedInputLanguage)}
                      >
                        {translations.switchToDetectedLanguage || "Switch to detected language"}:{" "}
                        {LANGUAGE_NAMES[detectedInputLanguage]}
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-900">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center">
                        <HelpCircle className="h-3.5 w-3.5 mr-1 text-purple-500" />
                        {translations.model || "Model"}
                      </label>
                      <Select value={model} onValueChange={setModel}>
                        <SelectTrigger className="border-purple-200 dark:border-purple-900">
                          <SelectValue placeholder={translations.selectModel || "Select model"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center">
                        <HelpCircle className="h-3.5 w-3.5 mr-1 text-purple-500" />
                        {translations.temperature || "Temperature"}: {temperature}
                      </label>
                      <Slider
                        value={[temperature]}
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={(value) => setTemperature(value[0])}
                        className="py-1"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {translations.generating || "Generating..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {translations.generate || "Generate"}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {promptAnalysis && (
                <Card className="border-indigo-200 dark:border-indigo-900 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                    <CardTitle className="flex items-center">
                      <BarChart2 className="mr-2 h-5 w-5" />
                      {translations.promptAnalysis || "Prompt Analysis"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-lg">{translations.scoreBreakdown || "Score Breakdown"}</h3>
                        <Badge variant={getScoreBadgeVariant(promptAnalysis.score)} className="text-lg px-3 py-1">
                          {promptAnalysis.score}/100
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{translations.clarity || "Clarity"}</span>
                            <span className="font-bold">{promptAnalysis.categoryScores.clarity}%</span>
                          </div>
                          <Progress value={promptAnalysis.categoryScores.clarity} className="h-3" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{translations.specificity || "Specificity"}</span>
                            <span className="font-bold">{promptAnalysis.categoryScores.specificity}%</span>
                          </div>
                          <Progress value={promptAnalysis.categoryScores.specificity} className="h-3" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{translations.context || "Context"}</span>
                            <span className="font-bold">{promptAnalysis.categoryScores.context}%</span>
                          </div>
                          <Progress value={promptAnalysis.categoryScores.context} className="h-3" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{translations.length || "Length"}</span>
                            <span className="font-bold">{promptAnalysis.categoryScores.length}%</span>
                          </div>
                          <Progress value={promptAnalysis.categoryScores.length} className="h-3" />
                        </div>
                      </div>
                    </div>

                    {/* Prompt Type */}
                    {promptAnalysis.promptType !== "none" && (
                      <div className="mb-4">
                        <h4 className="font-medium text-purple-600 dark:text-purple-400 flex items-center mb-3">
                          <Award className="h-4 w-4 mr-2" />
                          {translations.promptType || "Prompt Type"}
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge
                            variant="outline"
                            className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                          >
                            {promptAnalysis.promptType.charAt(0).toUpperCase() + promptAnalysis.promptType.slice(1)}
                          </Badge>
                        </div>

                        {/* Suggested Template Categories */}
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                            {translations.suggestedCategories || "Suggested Categories"}:
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {promptAnalysis.suggestedTemplates.map((category, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                onClick={() => {
                                  setActiveTab("templates")
                                  setActiveTemplateCategory(category)
                                }}
                              >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {promptAnalysis.strengths.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-green-600 dark:text-green-400 flex items-center mb-3">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {translations.strengths || "Strengths"}
                        </h4>
                        <ul className="space-y-2">
                          {promptAnalysis.strengths.map((strength, i) => (
                            <li
                              key={i}
                              className="flex items-start text-sm bg-green-50 dark:bg-green-900/10 p-2 rounded-md"
                            >
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {promptAnalysis.weaknesses.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-red-600 dark:text-red-400 flex items-center mb-3">
                          <XCircle className="h-4 w-4 mr-2" />
                          {translations.weaknesses || "Weaknesses"}
                        </h4>
                        <ul className="space-y-2">
                          {promptAnalysis.weaknesses.map((weakness, i) => (
                            <li
                              key={i}
                              className="flex items-start text-sm bg-red-50 dark:bg-red-900/10 p-2 rounded-md"
                            >
                              <XCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {promptAnalysis.suggestions.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-blue-600 dark:text-blue-400 flex items-center mb-3">
                          <Lightbulb className="h-4 w-4 mr-2" />
                          {translations.suggestions || "Suggestions"}
                        </h4>
                        <ul className="space-y-2">
                          {promptAnalysis.suggestions.map((suggestion, i) => (
                            <li
                              key={i}
                              className="flex items-start text-sm bg-blue-50 dark:bg-blue-900/10 p-2 rounded-md"
                            >
                              <Lightbulb className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improved Prompts Section */}
                    {promptAnalysis.improvedPrompts.length > 0 && (
                      <ImprovedPrompts
                        improvedPrompts={promptAnalysis.improvedPrompts}
                        onUsePrompt={handleUseImprovedPrompt}
                        onViewMore={() => setShowImprovedPromptsModal(true)}
                      />
                    )}

                    {/* Relevant Templates Section */}
                    {promptAnalysis.relevantTemplates && promptAnalysis.relevantTemplates.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-yellow-600 dark:text-yellow-400 flex items-center mb-3">
                          <Lightbulb className="h-4 w-4 mr-2" />
                          {translations.relevantTemplates || "Relevant Templates"}
                        </h4>
                        <div className="space-y-3">
                          {promptAnalysis.relevantTemplates.slice(0, 2).map((template, i) => (
                            <div
                              key={i}
                              className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-md border border-yellow-100 dark:border-yellow-800"
                            >
                              <h5 className="font-medium text-sm mb-1">{template.title}</h5>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{template.prompt}</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-7 bg-white dark:bg-gray-800"
                                onClick={() => handleUseTemplate(template.prompt)}
                              >
                                {translations.useTemplate || "Use Template"}
                              </Button>
                            </div>
                          ))}

                          {promptAnalysis.relevantTemplates.length > 2 && (
                            <Button
                              variant="link"
                              size="sm"
                              className="text-xs p-0 h-auto"
                              onClick={() => {
                                setActiveTab("templates")
                                if (promptAnalysis.relevantTemplates[0]?.category) {
                                  setActiveTemplateCategory(promptAnalysis.relevantTemplates[0].category)
                                }
                              }}
                            >
                              {translations.viewMoreTemplates || "View more templates"} →
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="border-blue-200 dark:border-blue-900 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                  <CardTitle>{translations.response || "Response"}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{translations.error || "Error"}:</p>
                        <p>{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="min-h-[300px] p-4 border rounded-md bg-white dark:bg-gray-800 shadow-inner overflow-auto">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-purple-500" />
                          </div>
                          <Loader2 className="h-16 w-16 animate-spin text-purple-300" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                          {translations.generating || "Generating..."}
                        </p>
                      </div>
                    ) : result ? (
                      <div className="whitespace-pre-wrap">{result}</div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                          <Sparkles className="h-8 w-8 text-blue-500" />
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {translations.responseWillAppearHere || "Your response will appear here"}
                        </p>
                        <p className="text-xs text-muted-foreground max-w-xs">
                          Enter a prompt and click Generate to see AI-generated content
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                {result && (
                  <CardFooter className="flex justify-between bg-gray-50 dark:bg-gray-900">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleSavePrompt}>
                        <Save className="h-4 w-4 mr-2" />
                        {translations.save || "Save"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCopyPrompt}>
                        <Copy className="h-4 w-4 mr-2" />
                        {translations.copy || "Copy"}
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      {translations.share || "Share"}
                    </Button>
                  </CardFooter>
                )}
              </Card>

              {(promptTokens > 0 || completionTokens > 0) && (
                <Card className="border-cyan-200 dark:border-cyan-900 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white">
                    <CardTitle>{translations.usage || "Usage"}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
                        <p className="text-sm text-cyan-700 dark:text-cyan-300 mb-1 font-medium">
                          {translations.promptTokens || "Prompt tokens"}
                        </p>
                        <p className="font-bold text-2xl text-cyan-800 dark:text-cyan-200">{promptTokens}</p>
                      </div>
                      <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                        <p className="text-sm text-teal-700 dark:text-teal-300 mb-1 font-medium">
                          {translations.completionTokens || "Completion tokens"}
                        </p>
                        <p className="font-bold text-2xl text-teal-800 dark:text-teal-200">{completionTokens}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-1 font-medium">
                          {translations.total || "Total"}
                        </p>
                        <p className="font-bold text-2xl text-blue-800 dark:text-blue-200">
                          {promptTokens + completionTokens}{" "}
                          <span className="text-sm font-normal">{translations.tokens || "tokens"}</span>
                        </p>
                      </div>
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-1 font-medium">
                          {translations.estimatedCost || "Estimated cost"}
                        </p>
                        <p className="font-bold text-2xl text-indigo-800 dark:text-indigo-200">
                          ${estimateCost(model, promptTokens, completionTokens).toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="mb-6">
            <Tabs value={activeTemplateCategory} onValueChange={setActiveTemplateCategory}>
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="general">{translations.general || "General"}</TabsTrigger>
                <TabsTrigger value="creative">{translations.creative || "Creative"}</TabsTrigger>
                <TabsTrigger value="technical">{translations.technical || "Technical"}</TabsTrigger>
                <TabsTrigger value="business">{translations.business || "Business"}</TabsTrigger>
                <TabsTrigger value="academic">{translations.academic || "Academic"}</TabsTrigger>
                <TabsTrigger value="marketing">{translations.marketing || "Marketing"}</TabsTrigger>
                <TabsTrigger value="healthcare">{translations.healthcare || "Healthcare"}</TabsTrigger>
                <TabsTrigger value="legal">{translations.legal || "Legal"}</TabsTrigger>
                <TabsTrigger value="education">{translations.education || "Education"}</TabsTrigger>
                <TabsTrigger value="career">{translations.career || "Career"}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-6">
            {activeTemplateCategory === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle>{translations.general || "General"}</CardTitle>
                  <CardDescription>
                    {translations.generalTemplatesDesc || "Basic templates for common tasks"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {templates.general.map((template, i) => (
                    <Card key={i} className="p-4">
                      <h3 className="font-medium mb-2">{template.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{template.prompt}</p>
                      <Button variant="outline" size="sm" onClick={() => handleUseTemplate(template.prompt)}>
                        {translations.useTemplate || "Use Template"}
                      </Button>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Add other template categories as needed */}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <PromptHistory />
        </TabsContent>
      </Tabs>

      {/* Improved Prompts Modal */}
      {showImprovedPromptsModal && promptAnalysis?.improvedPrompts.length > 0 && (
        <ImprovedPromptsModal
          improvedPrompts={promptAnalysis.improvedPrompts}
          onUsePrompt={handleUseImprovedPrompt}
          onClose={() => setShowImprovedPromptsModal(false)}
        />
      )}
    </div>
  )
}

function PromptHistory() {
  const { translations } = useLanguage()
  const history = usePromptStore((state) => state.history)
  const removePrompt = usePromptStore((state) => state.removePrompt)
  const { toast } = useToast()

  const handleLoadPrompt = (prompt: string) => {
    toast({
      title: translations.promptLoaded || "Prompt loaded",
      description: translations.promptLoadedFromHistory || "Prompt loaded from history.",
    })
  }

  const handleDeletePrompt = (id: string) => {
    removePrompt(id)
    toast({
      title: translations.promptDeleted || "Prompt deleted",
      description: translations.promptRemovedFromHistory || "Prompt removed from history.",
    })
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-2">{translations.noPromptHistory || "No prompt history yet"}</p>
          <p className="text-sm text-muted-foreground">
            {translations.promptHistoryDesc || "Your saved prompts will appear here"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-base">{item.prompt.substring(0, 50)}...</CardTitle>
            <CardDescription>
              {new Date(item.createdAt).toLocaleString()} • {item.model} • Temp: {item.temperature}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleLoadPrompt(item.prompt)}>
              {translations.load || "Load"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDeletePrompt(item.id)}>
              {translations.delete || "Delete"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
