"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import {
  AlertCircle,
  BarChart,
  Clock,
  History,
  Key,
  Lightbulb,
  Loader2,
  Save,
  Send,
  Share,
  Tag,
  Trash,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { analyzePrompt } from "@/lib/prompt-analyzer"
import { usePromptStore } from "@/lib/prompt-store"
import { useUsageStore } from "@/lib/usage-store"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { getLocalizedTemplates } from "@/lib/templates"

export default function PlaygroundPage() {
  const { toast } = useToast()
  const { language, translations } = useLanguage()
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState("gpt-4o")
  const [temperature, setTemperature] = useState([0.7])
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [promptAnalysis, setPromptAnalysis] = useState<ReturnType<typeof analyzePrompt> | null>(null)
  const [activeTab, setActiveTab] = useState("prompt")
  const [enableStreaming, setEnableStreaming] = useState(true)
  const [usageData, setUsageData] = useState<{
    promptTokens: number
    completionTokens: number
    totalTokens: number
    cost: number
  } | null>(null)
  const [debugMode, setDebugMode] = useState(false)

  // Access the prompt history store
  const { history, addPrompt, removePrompt } = usePromptStore()

  // Access the usage store
  const { addUsage } = useUsageStore()

  // Ref for the response container for auto-scrolling during streaming
  const responseRef = useRef<HTMLDivElement>(null)

  // Check if API key is configured
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/check-api-key")
        const data = await response.json()
        setShowApiKeyInput(!data.hasApiKey)

        if (debugMode) {
          console.log("API key check result:", data)
        }
      } catch (error) {
        console.error("Error checking API key:", error)
        setShowApiKeyInput(true)
      }
    }

    checkApiKey()
  }, [debugMode])

  // Analyze prompt as user types
  useEffect(() => {
    if (prompt.trim().length > 0) {
      const analysis = analyzePrompt(prompt)
      setPromptAnalysis(analysis)
    } else {
      setPromptAnalysis(null)
    }
  }, [prompt])

  // Helper function to safely parse JSON with error handling
  const safeJsonParse = (text: string) => {
    try {
      return JSON.parse(text)
    } catch (e) {
      if (debugMode) {
        console.error("JSON parse error:", e, "Text:", text)
      }

      // Try to extract any valid JSON from the text
      // This is a fallback for malformed responses
      try {
        // Look for patterns that might be JSON objects
        const jsonMatch = text.match(/\{.*\}/s)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (extractError) {
        // If extraction fails, just return null
        if (debugMode) {
          console.error("JSON extraction failed:", extractError)
        }
      }

      return null
    }
  }

  const handleSubmit = async () => {
    if (debugMode) {
      console.log("Submitting prompt:", {
        promptLength: prompt.length,
        model,
        temperature: temperature[0],
        apiKeyProvided: !!apiKey,
        streaming: enableStreaming,
      })
    }

    if (!prompt.trim()) {
      toast({
        title: translations.emptyPrompt || "Empty prompt",
        description: translations.pleaseEnterPrompt || "Please enter a prompt to continue.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResponse("")
    setError(null)
    setErrorCode(null)
    setUsageData(null)

    try {
      if (enableStreaming) {
        // Streaming implementation
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            model,
            temperature: temperature[0],
            apiKey: apiKey || undefined,
            stream: true,
          }),
        })

        if (debugMode) {
          console.log("Stream response status:", response.status)
        }

        if (!response.ok) {
          const data = await response.json()
          setErrorCode(data.errorCode || null)
          throw new Error(data.error || translations.failedToGenerateResponse || "Failed to generate response")
        }

        // Use the ReadableStream API to process the stream
        const reader = response.body?.getReader()
        if (!reader) throw new Error(translations.failedToReadResponse || "Failed to read response")

        let fullText = ""
        const decoder = new TextDecoder()

        // Process the stream
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            // Decode the chunk
            const text = decoder.decode(value, { stream: true })

            if (debugMode) {
              console.log("Raw chunk:", text)
            }

            // Process the data
            try {
              // Split by newlines to handle multiple JSON objects
              const lines = text.split("\n").filter((line) => line.trim())

              for (const line of lines) {
                try {
                  const data = safeJsonParse(line)
                  if (!data) continue

                  if (data.chunk) {
                    fullText += data.chunk
                    setResponse(fullText)

                    // Auto-scroll to bottom
                    if (responseRef.current) {
                      responseRef.current.scrollTop = responseRef.current.scrollHeight
                    }
                  }

                  if (data.done && data.usage) {
                    setUsageData(data.usage)

                    // Save usage data
                    const today = new Date().toISOString().split("T")[0]
                    addUsage({
                      date: today,
                      model,
                      promptTokens: data.usage.promptTokens,
                      completionTokens: data.usage.completionTokens,
                      totalTokens: data.usage.totalTokens,
                      estimatedCost: data.usage.cost,
                    })

                    // Save to history
                    addPrompt({
                      prompt,
                      response: fullText,
                      model,
                      temperature: temperature[0],
                    })
                  }
                } catch (e) {
                  if (debugMode) {
                    console.error("Error processing line:", e, "Line:", line)
                  }
                }
              }
            } catch (e) {
              if (debugMode) {
                console.error("Error processing chunk:", e)
              }
            }
          }
        } catch (streamError) {
          console.error("Stream processing error:", streamError)
          throw new Error(
            translations.errorProcessingResponseStream || "Error processing response stream: " + streamError.message,
          )
        }
      } else {
        // Non-streaming implementation (unchanged)
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            model,
            temperature: temperature[0],
            apiKey: apiKey || undefined,
            stream: false,
          }),
        })

        const data = await response.json()

        if (debugMode) {
          console.log("Response data:", data)
        }

        if (!response.ok) {
          setErrorCode(data.errorCode || null)
          throw new Error(data.error || translations.failedToGenerateResponse || "Failed to generate response")
        }

        setResponse(data.text)
        setUsageData(data.usage)

        // Save usage data
        const today = new Date().toISOString().split("T")[0]
        addUsage({
          date: today,
          model,
          promptTokens: data.usage.promptTokens,
          completionTokens: data.usage.completionTokens,
          totalTokens: data.usage.totalTokens,
          estimatedCost: data.usage.cost,
        })

        // Save to history
        addPrompt({
          prompt,
          response: data.text,
          model,
          temperature: temperature[0],
        })
      }
    } catch (error) {
      console.error("Error details:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")

      // Add more detailed error information
      const errorDetails = {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        type: error.constructor.name,
      }

      console.error("Detailed error information:", errorDetails)

      toast({
        title: translations.error || "Error",
        description: `Failed to generate response: ${errorDetails.message}. Check console for details.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!prompt.trim()) {
      toast({
        title: translations.emptyPrompt || "Empty prompt",
        description: translations.pleaseEnterPromptToSave || "Please enter a prompt to save.",
        variant: "destructive",
      })
      return
    }

    // Save the current prompt to history
    addPrompt({
      prompt,
      response: response || "",
      model,
      temperature: temperature[0],
    })

    toast({
      title: translations.promptSaved || "Prompt saved",
      description: translations.promptSavedToLibrary || "Your prompt has been saved to your library.",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(prompt)
    toast({
      title: translations.copiedToClipboard || "Copied to clipboard",
      description: translations.promptCopiedToClipboard || "Your prompt has been copied to the clipboard.",
    })
  }

  const handleLoadFromHistory = (item: any) => {
    setPrompt(item.prompt)
    setResponse(item.response)
    setModel(item.model)
    setTemperature([item.temperature])
    setActiveTab("prompt")

    toast({
      title: translations.promptLoaded || "Prompt loaded",
      description: translations.promptLoadedFromHistory || "Prompt loaded from history.",
    })
  }

  const handleDeleteFromHistory = (id: string) => {
    removePrompt(id)

    toast({
      title: translations.promptDeleted || "Prompt deleted",
      description: translations.promptRemovedFromHistory || "Prompt removed from history.",
    })
  }

  const promptPlaceholder = {
    en: "Enter your prompt here...",
    es: "Ingresa tu prompt aquí...",
    fr: "Entrez votre prompt ici...",
    de: "Geben Sie Ihren Prompt hier ein...",
    zh: "在此输入您的提示...",
    ja: "プロンプトをここに入力してください...",
    ar: "أدخل الموجه الخاص بك هنا...",
    hi: "अपना प्रॉम्प्ट यहां दर्ज करें...",
    ur: "اپنا پرامپٹ یہاں درج کریں...",
    te: "మీ ప్రాంప్ట్‌ను ఇక్కడ నమోదు చేయండి...",
    ta: "உங்கள் ப்ராம்ப்டை இங்கே உள்ளிடவும்...",
  }

  // Get templates based on language
  const templates = getLocalizedTemplates(language)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{translations.playground || "Prompt Playground"}</h1>

      {showApiKeyInput && (
        <Alert className="mb-6" variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{translations.openaiApiKeyRequired || "OpenAI API Key Required"}</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              {translations.toUsePlaygroundApiKey ||
                "To use the playground, you need to provide an OpenAI API key. You can either:"}
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>
                {translations.enterApiKeyTemporarily ||
                  "Enter your API key temporarily below (it will only be used for this session)"}
              </li>
              <li>
                <Link href="/settings" className="text-primary hover:underline">
                  {translations.configureInSettings || "Configure it in the settings"}
                </Link>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-grow"
              />
              <Button variant="outline" onClick={() => setShowApiKeyInput(false)} disabled={!apiKey.startsWith("sk-")}>
                <Key className="mr-2 h-4 w-4" />
                {translations.useApiKey || "Use API Key"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="prompt">{translations.prompt || "Prompt"}</TabsTrigger>
          <TabsTrigger value="history">
            {translations.history || "History"}
            <Badge variant="secondary" className="ml-2">
              {history.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="analysis">{translations.analysis || "Analysis"}</TabsTrigger>
          <TabsTrigger value="usage">{translations.usage || "Usage"}</TabsTrigger>
        </TabsList>

        <TabsContent value="prompt">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{translations.prompt || "Prompt"}</CardTitle>
                  <CardDescription>
                    {translations.enterPromptAndConfigureModel || "Enter your prompt and configure model settings"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={promptPlaceholder[language as keyof typeof promptPlaceholder] || promptPlaceholder.en}
                    className="min-h-[200px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />

                  {promptAnalysis && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                          {translations.promptQuality || "Prompt Quality"}
                        </h4>
                        <div className="flex items-center">
                          <span className="text-xs mr-2">{translations.score || "Score"}:</span>
                          <Badge
                            variant={
                              promptAnalysis.score > 70
                                ? "default"
                                : promptAnalysis.score > 40
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {promptAnalysis.score}/100
                          </Badge>
                        </div>
                      </div>

                      {promptAnalysis.suggestions.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">{translations.tip || "Tip"}:</span>{" "}
                          {promptAnalysis.suggestions[0]}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      {translations.save || "Save"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share className="mr-2 h-4 w-4" />
                      {translations.share || "Share"}
                    </Button>
                  </div>
                  <Button onClick={handleSubmit} disabled={isLoading || (showApiKeyInput && !apiKey.startsWith("sk-"))}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {translations.generating || "Generating..."}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {translations.generate || "Generate"}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{translations.modelSettings || "Model Settings"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{translations.model || "Model"}</label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger>
                        <SelectValue placeholder={translations.selectModel || "Select model"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">{translations.temperature || "Temperature"}</label>
                      <span className="text-sm text-muted-foreground">{temperature[0]}</span>
                    </div>
                    <Slider value={temperature} min={0} max={1} step={0.1} onValueChange={setTemperature} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{translations.precise || "Precise"}</span>
                      <span>{translations.creative || "Creative"}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="streaming-mode" checked={enableStreaming} onCheckedChange={setEnableStreaming} />
                    <Label htmlFor="streaming-mode">
                      {translations.enableStreamingResponses || "Enable streaming responses"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="debug-mode" checked={debugMode} onCheckedChange={setDebugMode} />
                    <Label htmlFor="debug-mode">
                      {translations.debugMode || "Debug mode (shows detailed logs in console)"}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{translations.response || "Response"}</span>
                  {usageData && (
                    <Badge variant="outline" className="flex items-center">
                      <BarChart className="h-3 w-3 mr-1" />
                      {usageData.totalTokens} {translations.tokens || "tokens"}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : errorCode === "NO_API_KEY" ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                    <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {translations.openaiApiKeyRequired || "OpenAI API Key Required"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {translations.pleaseProvideApiKey || "Please provide an OpenAI API key to generate responses."}
                    </p>
                    {!showApiKeyInput && (
                      <Button onClick={() => setShowApiKeyInput(true)}>
                        <Key className="mr-2 h-4 w-4" />
                        {translations.addApiKey || "Add API Key"}
                      </Button>
                    )}
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                    <h3 className="text-lg font-medium mb-2">{translations.error || "Error"}</h3>
                    <p className="text-muted-foreground">{error}</p>
                  </div>
                ) : response ? (
                  <div
                    ref={responseRef}
                    className="whitespace-pre-wrap bg-muted p-4 rounded-md min-h-[300px] overflow-auto max-h-[500px]"
                  >
                    {response}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    {translations.responseWillAppearHere || "Response will appear here"}
                  </div>
                )}
              </CardContent>
              {usageData && (
                <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span>
                        {translations.prompt || "Prompt"}: {usageData.promptTokens} {translations.tokens || "tokens"}
                      </span>
                      <span>
                        {translations.completion || "Completion"}: {usageData.completionTokens}{" "}
                        {translations.tokens || "tokens"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        {translations.total || "Total"}: {usageData.totalTokens} {translations.tokens || "tokens"}
                      </span>
                      <span>
                        {translations.estimatedCost || "Estimated cost"}: ${usageData.cost.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{translations.promptHistory || "Prompt History"}</CardTitle>
              <CardDescription>
                {translations.viewAndManageSavedPrompts || "View and manage your saved prompts"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{translations.noPromptHistoryYet || "No prompt history yet"}</p>
                  <p className="text-sm mt-1">
                    {translations.savedPromptsWillAppearHere || "Your saved prompts will appear here"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 mr-4">
                          <h3 className="font-medium truncate">
                            {item.prompt.substring(0, 60)}
                            {item.prompt.length > 60 ? "..." : ""}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(item.createdAt).toLocaleString()}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {item.model}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleLoadFromHistory(item)}>
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteFromHistory(item.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>{translations.promptAnalysis || "Prompt Analysis"}</CardTitle>
              <CardDescription>
                {translations.getInsightsAndSuggestions || "Get insights and suggestions to improve your prompts"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!promptAnalysis ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{translations.enterPromptToSeeAnalysis || "Enter a prompt to see analysis"}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{translations.overallScore || "Overall Score"}</h3>
                    <div className="flex items-center">
                      <div className="w-32 h-3 bg-muted rounded-full overflow-hidden mr-3">
                        <div
                          className={`h-full ${
                            promptAnalysis.score > 70
                              ? "bg-green-500"
                              : promptAnalysis.score > 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${promptAnalysis.score}%` }}
                        />
                      </div>
                      <span className="font-bold">{promptAnalysis.score}/100</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-green-600 dark:text-green-400 flex items-center">
                        <span className="inline-block w-4 h-4 rounded-full bg-green-600 dark:bg-green-400 mr-2"></span>
                        {translations.strengths || "Strengths"}
                      </h3>
                      {promptAnalysis.strengths.length > 0 ? (
                        <ul className="space-y-1 pl-6 list-disc">
                          {promptAnalysis.strengths.map((strength, i) => (
                            <li key={i} className="text-sm">
                              {strength}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground pl-6">
                          {translations.noStrengthsDetected || "No strengths detected"}
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2 text-red-600 dark:text-red-400 flex items-center">
                        <span className="inline-block w-4 h-4 rounded-full bg-red-600 dark:bg-red-400 mr-2"></span>
                        {translations.areasForImprovement || "Areas for Improvement"}
                      </h3>
                      {promptAnalysis.weaknesses.length > 0 ? (
                        <ul className="space-y-1 pl-6 list-disc">
                          {promptAnalysis.weaknesses.map((weakness, i) => (
                            <li key={i} className="text-sm">
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground pl-6">
                          {translations.noWeaknessesDetected || "No weaknesses detected"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                      {translations.suggestions || "Suggestions"}
                    </h3>
                    {promptAnalysis.suggestions.length > 0 ? (
                      <ul className="space-y-1 pl-6 list-disc">
                        {promptAnalysis.suggestions.map((suggestion, i) => (
                          <li key={i} className="text-sm">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground pl-6">
                        {translations.noSuggestionsAvailable || "No suggestions available"}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <UsageTab />
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{translations.promptTemplates || "Prompt Templates"}</CardTitle>
          <CardDescription>
            {translations.useTemplatesQuickly || "Use these templates to get started quickly"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="mb-4">
              <TabsTrigger value="general">{translations.general || "General"}</TabsTrigger>
              <TabsTrigger value="creative">{translations.creative || "Creative"}</TabsTrigger>
              <TabsTrigger value="technical">{translations.technical || "Technical"}</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.general.map((template, index) => (
                  <PromptTemplate
                    key={index}
                    title={template.title}
                    prompt={template.prompt}
                    onUse={(template) => setPrompt(template)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="creative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.creative.map((template, index) => (
                  <PromptTemplate
                    key={index}
                    title={template.title}
                    prompt={template.prompt}
                    onUse={(template) => setPrompt(template)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="technical">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.technical.map((template, index) => (
                  <PromptTemplate
                    key={index}
                    title={template.title}
                    prompt={template.prompt}
                    onUse={(template) => setPrompt(template)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function PromptTemplate({
  title,
  prompt,
  onUse,
}: {
  title: string
  prompt: string
  onUse: (prompt: string) => void
}) {
  const { translations } = useLanguage()

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{prompt}</p>
      <Button variant="outline" size="sm" onClick={() => onUse(prompt)}>
        {translations.useTemplate || "Use Template"}
      </Button>
    </div>
  )
}

function UsageTab() {
  const { records, getTotalUsage } = useUsageStore()
  const { translations } = useLanguage()
  const [dateRange, setDateRange] = useState("all")
  const [filteredRecords, setFilteredRecords] = useState(records)

  useEffect(() => {
    // Filter records based on date range
    if (dateRange === "today") {
      const today = new Date().toISOString().split("T")[0]
      setFilteredRecords(records.filter((record) => record.date === today))
    } else if (dateRange === "week") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const weekAgoStr = oneWeekAgo.toISOString().split("T")[0]
      setFilteredRecords(records.filter((record) => record.date >= weekAgoStr))
    } else if (dateRange === "month") {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      const monthAgoStr = oneMonthAgo.toISOString().split("T")[0]
      setFilteredRecords(records.filter((record) => record.date >= monthAgoStr))
    } else {
      setFilteredRecords(records)
    }
  }, [records, dateRange])

  // Calculate totals for filtered records
  const totals = filteredRecords.reduce(
    (acc, record) => {
      return {
        promptTokens: acc.promptTokens + record.promptTokens,
        completionTokens: acc.completionTokens + record.completionTokens,
        totalTokens: acc.totalTokens + record.totalTokens,
        estimatedCost: acc.estimatedCost + record.estimatedCost,
      }
    },
    { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCost: 0 },
  )

  // Group by model
  const modelUsage = filteredRecords.reduce((acc: Record<string, any>, record) => {
    if (!acc[record.model]) {
      acc[record.model] = {
        totalTokens: 0,
        estimatedCost: 0,
        count: 0,
      }
    }

    acc[record.model].totalTokens += record.totalTokens
    acc[record.model].estimatedCost += record.estimatedCost
    acc[record.model].count += 1

    return acc
  }, {})

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{translations.usageStatistics || "Usage Statistics"}</CardTitle>
            <CardDescription>{translations.trackApiUsageAndCosts || "Track your API usage and costs"}</CardDescription>
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={translations.selectTimePeriod || "Select time period"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{translations.allTime || "All Time"}</SelectItem>
              <SelectItem value="today">{translations.today || "Today"}</SelectItem>
              <SelectItem value="week">{translations.last7Days || "Last 7 Days"}</SelectItem>
              <SelectItem value="month">{translations.last30Days || "Last 30 Days"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{translations.noUsageDataYet || "No usage data yet"}</p>
            <p className="text-sm mt-1">
              {translations.generateResponsesToTrackUsage || "Generate responses to track usage"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {translations.totalRequests || "Total Requests"}
                </h3>
                <p className="text-2xl font-bold">{filteredRecords.length}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {translations.totalTokens || "Total Tokens"}
                </h3>
                <p className="text-2xl font-bold">{totals.totalTokens.toLocaleString()}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {translations.promptTokens || "Prompt Tokens"}
                </h3>
                <p className="text-2xl font-bold">{totals.promptTokens.toLocaleString()}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {translations.estimatedCost || "Estimated Cost"}
                </h3>
                <p className="text-2xl font-bold">${totals.estimatedCost.toFixed(4)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">{translations.usageByModel || "Usage by Model"}</h3>
              <div className="space-y-3">
                {Object.entries(modelUsage).map(([model, data]: [string, any]) => (
                  <div key={model} className="flex items-center">
                    <div className="w-32 flex-shrink-0">
                      <span className="font-medium">{model}</span>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${Math.min(100, (data.totalTokens / Math.max(1, totals.totalTokens)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-32 text-right text-sm">
                      <div>{data.totalTokens.toLocaleString()} tokens</div>
                      <div className="text-muted-foreground">${data.estimatedCost.toFixed(4)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
