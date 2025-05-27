"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/hooks/use-toast"
import { analyzePrompt, type PromptAnalysis } from "@/lib/prompt-analyzer"
import { usePromptStore } from "@/lib/prompt-store"
import { useUsageStore } from "@/lib/usage-store"
import { countTokens, estimateCost } from "@/lib/token-counter"
import { getLocalizedTemplates } from "@/lib/templates"
import { type Language, LANGUAGE_NAMES } from "@/lib/i18n"
import {
  Loader2,
  AlertCircle,
  Save,
  Share,
  Copy,
  Sparkles,
  BarChart2,
  Lightbulb,
  Zap,
  Award,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react"

export default function PlaygroundComponent() {
  const { translations, language, setLanguage } = useLanguage()
  const { toast } = useToast()

  // Core state
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [model, setModel] = useState("gpt-3.5-turbo")
  const [activeTab, setActiveTab] = useState("playground")

  // Analysis state
  const [promptAnalysis, setPromptAnalysis] = useState<PromptAnalysis | null>(null)
  const [promptTokens, setPromptTokens] = useState(0)
  const [completionTokens, setCompletionTokens] = useState(0)

  // Template state
  const [activeTemplateCategory, setActiveTemplateCategory] = useState("general")

  // Language detection state
  const [detectedInputLanguage, setDetectedInputLanguage] = useState<Language | null>(null)
  const [isDetectingLanguage, setIsDetectingLanguage] = useState(false)

  // Store hooks
  const addPrompt = usePromptStore((state) => state.addPrompt)
  const addUsage = useUsageStore((state) => state.addUsage)

  // Memoized templates
  const templates = useMemo(() => getLocalizedTemplates(language), [language])

  // Analyze prompt effect
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

  // Language detection effect
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

  // Handle form submission
  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to continue.",
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
          language,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Unknown error")
      }

      const data = await res.json()
      setResult(data.result)

      const estimatedCompletionTokens = countTokens(data.result)
      setCompletionTokens(estimatedCompletionTokens)

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
        title: "Error",
        description: err.message || "Failed to generate response",
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
        title: "Prompt saved",
        description: "Your prompt has been saved to your library.",
      })
    }
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    toast({
      title: "Copied to clipboard",
      description: "Your prompt has been copied to the clipboard.",
    })
  }

  const handleUseTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt)
    setActiveTab("playground")
  }

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

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
        {translations.playground || "Playground"}
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="playground">Playground</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="playground" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column - Input */}
            <div className="space-y-6">
              {/* Prompt Input Card */}
              <Card className="border-purple-200 dark:border-purple-900 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                  <CardTitle className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Prompt
                    </span>
                  </CardTitle>
                  {promptAnalysis && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white/90">Quality Score</span>
                        <Badge variant="secondary" className="text-white font-bold">
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
                    placeholder="Enter your prompt here..."
                    className="min-h-[200px] border-purple-200 dark:border-purple-900 focus-visible:ring-purple-500"
                  />

                  {detectedInputLanguage && (
                    <div className="mt-2 text-sm">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-purple-600 dark:text-purple-400"
                        onClick={() => handleLanguageSwitch(detectedInputLanguage)}
                      >
                        Switch to detected language: {LANGUAGE_NAMES[detectedInputLanguage]}
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-900">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center">
                        <HelpCircle className="h-3.5 w-3.5 mr-1 text-purple-500" />
                        Model
                      </label>
                      <Select value={model} onValueChange={setModel}>
                        <SelectTrigger className="border-purple-200 dark:border-purple-900">
                          <SelectValue placeholder="Select model" />
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
                        Temperature: {temperature}
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
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Analysis Card */}
              {promptAnalysis && (
                <Card className="border-indigo-200 dark:border-indigo-900 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                    <CardTitle className="flex items-center">
                      <BarChart2 className="mr-2 h-5 w-5" />
                      Prompt Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-lg">Score Breakdown</h3>
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          {promptAnalysis.score}/100
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">Clarity</span>
                            <span className="font-bold">{promptAnalysis.categoryScores.clarity}%</span>
                          </div>
                          <Progress value={promptAnalysis.categoryScores.clarity} className="h-3" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">Specificity</span>
                            <span className="font-bold">{promptAnalysis.categoryScores.specificity}%</span>
                          </div>
                          <Progress value={promptAnalysis.categoryScores.specificity} className="h-3" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">Context</span>
                            <span className="font-bold">{promptAnalysis.categoryScores.context}%</span>
                          </div>
                          <Progress value={promptAnalysis.categoryScores.context} className="h-3" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">Length</span>
                            <span className="font-bold">{promptAnalysis.categoryScores.length}%</span>
                          </div>
                          <Progress value={promptAnalysis.categoryScores.length} className="h-3" />
                        </div>
                      </div>
                    </div>

                    {promptAnalysis.promptType !== "none" && (
                      <div className="mb-4">
                        <h4 className="font-medium text-purple-600 dark:text-purple-400 flex items-center mb-3">
                          <Award className="h-4 w-4 mr-2" />
                          Prompt Type
                        </h4>
                        <Badge
                          variant="outline"
                          className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                        >
                          {promptAnalysis.promptType.charAt(0).toUpperCase() + promptAnalysis.promptType.slice(1)}
                        </Badge>
                      </div>
                    )}

                    {promptAnalysis.strengths.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-green-600 dark:text-green-400 flex items-center mb-3">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Strengths
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
                          Weaknesses
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
                          Suggestions
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
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Output */}
            <div className="space-y-6">
              {/* Response Card */}
              <Card className="border-blue-200 dark:border-blue-900 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                  <CardTitle>Response</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Error:</p>
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
                        <p className="text-sm text-muted-foreground mt-4">Generating...</p>
                      </div>
                    ) : result ? (
                      <div className="whitespace-pre-wrap">{result}</div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                          <Sparkles className="h-8 w-8 text-blue-500" />
                        </div>
                        <p className="text-muted-foreground mb-2">Your response will appear here</p>
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
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCopyPrompt}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </CardFooter>
                )}
              </Card>

              {/* Usage Stats Card */}
              {(promptTokens > 0 || completionTokens > 0) && (
                <Card className="border-cyan-200 dark:border-cyan-900 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white">
                    <CardTitle>Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
                        <p className="text-sm text-cyan-700 dark:text-cyan-300 mb-1 font-medium">Prompt tokens</p>
                        <p className="font-bold text-2xl text-cyan-800 dark:text-cyan-200">{promptTokens}</p>
                      </div>
                      <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                        <p className="text-sm text-teal-700 dark:text-teal-300 mb-1 font-medium">Completion tokens</p>
                        <p className="font-bold text-2xl text-teal-800 dark:text-teal-200">{completionTokens}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-1 font-medium">Total</p>
                        <p className="font-bold text-2xl text-blue-800 dark:text-blue-200">
                          {promptTokens + completionTokens} <span className="text-sm font-normal">tokens</span>
                        </p>
                      </div>
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-1 font-medium">Estimated cost</p>
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
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="creative">Creative</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-6">
            {activeTemplateCategory === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle>General Templates</CardTitle>
                  <CardDescription>Basic templates for common tasks</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {templates.general.map((template, i) => (
                    <Card key={i} className="p-4">
                      <h3 className="font-medium mb-2">{template.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{template.prompt}</p>
                      <Button variant="outline" size="sm" onClick={() => handleUseTemplate(template.prompt)}>
                        Use Template
                      </Button>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <PromptHistory />
        </TabsContent>
      </Tabs>
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
      title: "Prompt loaded",
      description: "Prompt loaded from history.",
    })
  }

  const handleDeletePrompt = (id: string) => {
    removePrompt(id)
    toast({
      title: "Prompt deleted",
      description: "Prompt removed from history.",
    })
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-2">No prompt history yet</p>
          <p className="text-sm text-muted-foreground">Your saved prompts will appear here</p>
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
              Load
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDeletePrompt(item.id)}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
