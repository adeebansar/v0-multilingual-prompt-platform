"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, AlertTriangle, Play, RotateCcw, Zap } from "lucide-react"

interface TestResult {
  category: string
  test: string
  status: "pass" | "fail" | "warning"
  message: string
  details?: string
}

export function ComprehensiveTester() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [progress, setProgress] = useState(0)
  const { language, setLanguage, translations } = useLanguage()
  const { toast } = useToast()

  const runAllTests = async () => {
    setIsRunning(true)
    setResults([])
    setProgress(0)

    const allTests = [
      ...(await runNavigationTests()),
      ...(await runLanguageTests()),
      ...(await runThemeTests()),
      ...(await runAPITests()),
      ...(await runPlaygroundTests()),
      ...(await runLessonTests()),
      ...(await runQuizTests()),
      ...(await runSettingsTests()),
      ...(await runResponsiveTests()),
      ...(await runAccessibilityTests()),
      ...(await runPerformanceTests()),
      ...(await runStorageTests()),
    ]

    setResults(allTests)
    setProgress(100)
    setIsRunning(false)

    const passCount = allTests.filter((t) => t.status === "pass").length
    const failCount = allTests.filter((t) => t.status === "fail").length
    const warningCount = allTests.filter((t) => t.status === "warning").length

    toast({
      title: "Testing Complete",
      description: `${passCount} passed, ${failCount} failed, ${warningCount} warnings`,
    })
  }

  // Navigation Tests
  const runNavigationTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Test header presence
    const header = document.querySelector("header")
    tests.push({
      category: "Navigation",
      test: "Header Component",
      status: header ? "pass" : "fail",
      message: header ? "Header renders correctly" : "Header not found",
    })

    // Test navigation links
    const navLinks = ["/", "/lessons", "/playground", "/quizzes", "/settings"]
    for (const link of navLinks) {
      const linkElement = document.querySelector(`a[href="${link}"]`)
      tests.push({
        category: "Navigation",
        test: `Navigation Link: ${link}`,
        status: linkElement ? "pass" : "fail",
        message: linkElement ? `Link to ${link} exists` : `Link to ${link} missing`,
      })
    }

    // Test logo
    const logo = document.querySelector('[aria-label="ScriptShift Home"]')
    tests.push({
      category: "Navigation",
      test: "Logo Link",
      status: logo ? "pass" : "fail",
      message: logo ? "Logo link present" : "Logo link missing",
    })

    return tests
  }

  // Language Tests
  const runLanguageTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []
    const supportedLanguages = ["en", "es", "fr", "de", "zh", "ja", "ar", "hi", "ur", "te", "ta"]

    // Test language selector presence
    const languageSelector = document.querySelector('[role="combobox"]')
    tests.push({
      category: "Language",
      test: "Language Selector",
      status: languageSelector ? "pass" : "fail",
      message: languageSelector ? "Language selector present" : "Language selector missing",
    })

    // Test current language
    tests.push({
      category: "Language",
      test: "Current Language",
      status: supportedLanguages.includes(language) ? "pass" : "fail",
      message: `Current language: ${language}`,
    })

    // Test translations object
    tests.push({
      category: "Language",
      test: "Translations Loaded",
      status: Object.keys(translations).length > 0 ? "pass" : "fail",
      message: `${Object.keys(translations).length} translations loaded`,
    })

    // Test RTL support
    const htmlDir = document.documentElement.dir
    const isRTL = ["ar", "ur"].includes(language)
    tests.push({
      category: "Language",
      test: "RTL Support",
      status: (isRTL && htmlDir === "rtl") || (!isRTL && htmlDir === "ltr") ? "pass" : "warning",
      message: `HTML dir: ${htmlDir}, Expected: ${isRTL ? "rtl" : "ltr"}`,
    })

    return tests
  }

  // Theme Tests
  const runThemeTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Test theme toggle presence
    const themeToggle = document.querySelector('[aria-label="Toggle theme"]')
    tests.push({
      category: "Theme",
      test: "Theme Toggle",
      status: themeToggle ? "pass" : "fail",
      message: themeToggle ? "Theme toggle present" : "Theme toggle missing",
    })

    // Test CSS variables
    const rootStyles = getComputedStyle(document.documentElement)
    const primaryColor = rootStyles.getPropertyValue("--primary")
    tests.push({
      category: "Theme",
      test: "CSS Variables",
      status: primaryColor ? "pass" : "fail",
      message: primaryColor ? "CSS variables loaded" : "CSS variables missing",
    })

    // Test dark mode class
    const hasDarkClass = document.documentElement.classList.contains("dark")
    tests.push({
      category: "Theme",
      test: "Dark Mode Class",
      status: "pass",
      message: `Dark mode: ${hasDarkClass ? "enabled" : "disabled"}`,
    })

    return tests
  }

  // API Tests
  const runAPITests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Test API key check
    try {
      const response = await fetch("/api/check-api-key")
      const data = await response.json()
      tests.push({
        category: "API",
        test: "API Key Check",
        status: response.ok ? "pass" : "fail",
        message: data.hasApiKey ? "API key configured" : "API key missing",
      })
    } catch (error) {
      tests.push({
        category: "API",
        test: "API Key Check",
        status: "fail",
        message: "API endpoint unreachable",
      })
    }

    // Test environment endpoint
    try {
      const response = await fetch("/api/test-env")
      tests.push({
        category: "API",
        test: "Environment Test",
        status: response.ok ? "pass" : "fail",
        message: response.ok ? "Environment endpoint working" : "Environment endpoint failed",
      })
    } catch (error) {
      tests.push({
        category: "API",
        test: "Environment Test",
        status: "fail",
        message: "Environment endpoint unreachable",
      })
    }

    // Test language detection endpoint
    try {
      const response = await fetch("/api/detect-language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Hello world" }),
      })
      tests.push({
        category: "API",
        test: "Language Detection",
        status: response.ok ? "pass" : "fail",
        message: response.ok ? "Language detection working" : "Language detection failed",
      })
    } catch (error) {
      tests.push({
        category: "API",
        test: "Language Detection",
        status: "fail",
        message: "Language detection endpoint unreachable",
      })
    }

    return tests
  }

  // Playground Tests
  const runPlaygroundTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Test playground page accessibility
    try {
      const playgroundExists = document.querySelector('[href="/playground"]')
      tests.push({
        category: "Playground",
        test: "Playground Link",
        status: playgroundExists ? "pass" : "fail",
        message: playgroundExists ? "Playground accessible" : "Playground link missing",
      })
    } catch (error) {
      tests.push({
        category: "Playground",
        test: "Playground Link",
        status: "fail",
        message: "Error checking playground",
      })
    }

    return tests
  }

  // Lesson Tests
  const runLessonTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Test lessons page link
    const lessonsLink = document.querySelector('[href="/lessons"]')
    tests.push({
      category: "Lessons",
      test: "Lessons Page Link",
      status: lessonsLink ? "pass" : "fail",
      message: lessonsLink ? "Lessons page accessible" : "Lessons link missing",
    })

    // Test individual lesson links
    const lessonLinks = document.querySelectorAll('[href^="/lessons/"]')
    tests.push({
      category: "Lessons",
      test: "Individual Lesson Links",
      status: lessonLinks.length > 0 ? "pass" : "warning",
      message: `${lessonLinks.length} lesson links found`,
    })

    return tests
  }

  // Quiz Tests
  const runQuizTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Test quizzes page link
    const quizzesLink = document.querySelector('[href="/quizzes"]')
    tests.push({
      category: "Quizzes",
      test: "Quizzes Page Link",
      status: quizzesLink ? "pass" : "fail",
      message: quizzesLink ? "Quizzes page accessible" : "Quizzes link missing",
    })

    return tests
  }

  // Settings Tests
  const runSettingsTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Test settings page link
    const settingsLink = document.querySelector('[href="/settings"]')
    tests.push({
      category: "Settings",
      test: "Settings Page Link",
      status: settingsLink ? "pass" : "fail",
      message: settingsLink ? "Settings page accessible" : "Settings link missing",
    })

    return tests
  }

  // Responsive Tests
  const runResponsiveTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Test viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]')
    tests.push({
      category: "Responsive",
      test: "Viewport Meta Tag",
      status: viewport ? "pass" : "fail",
      message: viewport ? "Viewport meta tag present" : "Viewport meta tag missing",
    })

    // Test container classes
    const containers = document.querySelectorAll(".container")
    tests.push({
      category: "Responsive",
      test: "Container Classes",
      status: containers.length > 0 ? "pass" : "warning",
      message: `${containers.length} containers found`,
    })

    return tests
  }

  // Accessibility Tests
  const runAccessibilityTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Test page title
    const title = document.title
    tests.push({
      category: "Accessibility",
      test: "Page Title",
      status: title && title.length > 0 ? "pass" : "fail",
      message: title ? `Title: "${title}"` : "Page title missing",
    })

    // Test main landmark
    const main = document.querySelector("main")
    tests.push({
      category: "Accessibility",
      test: "Main Landmark",
      status: main ? "pass" : "warning",
      message: main ? "Main landmark present" : "Main landmark missing",
    })

    // Test heading structure
    const h1s = document.querySelectorAll("h1")
    tests.push({
      category: "Accessibility",
      test: "H1 Headings",
      status: h1s.length === 1 ? "pass" : h1s.length > 1 ? "warning" : "fail",
      message: `${h1s.length} H1 heading(s) found`,
    })

    // Test alt text on images
    const images = document.querySelectorAll("img")
    const imagesWithAlt = document.querySelectorAll("img[alt]")
    tests.push({
      category: "Accessibility",
      test: "Image Alt Text",
      status: images.length === imagesWithAlt.length ? "pass" : "warning",
      message: `${imagesWithAlt.length}/${images.length} images have alt text`,
    })

    return tests
  }

  // Performance Tests
  const runPerformanceTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Test page load time (approximate)
    const loadTime = performance.now()
    tests.push({
      category: "Performance",
      test: "Page Load Time",
      status: loadTime < 3000 ? "pass" : loadTime < 5000 ? "warning" : "fail",
      message: `Load time: ${Math.round(loadTime)}ms`,
    })

    // Test resource count
    const resources = performance.getEntriesByType("resource")
    tests.push({
      category: "Performance",
      test: "Resource Count",
      status: resources.length < 50 ? "pass" : resources.length < 100 ? "warning" : "fail",
      message: `${resources.length} resources loaded`,
    })

    return tests
  }

  // Storage Tests
  const runStorageTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Test localStorage availability
    try {
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      tests.push({
        category: "Storage",
        test: "LocalStorage",
        status: "pass",
        message: "LocalStorage available",
      })
    } catch (error) {
      tests.push({
        category: "Storage",
        test: "LocalStorage",
        status: "fail",
        message: "LocalStorage not available",
      })
    }

    // Test sessionStorage availability
    try {
      sessionStorage.setItem("test", "test")
      sessionStorage.removeItem("test")
      tests.push({
        category: "Storage",
        test: "SessionStorage",
        status: "pass",
        message: "SessionStorage available",
      })
    } catch (error) {
      tests.push({
        category: "Storage",
        test: "SessionStorage",
        status: "fail",
        message: "SessionStorage not available",
      })
    }

    return tests
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
      case "fail":
        return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
      default:
        return ""
    }
  }

  const categories = [...new Set(results.map((r) => r.category))]
  const passCount = results.filter((r) => r.status === "pass").length
  const failCount = results.filter((r) => r.status === "fail").length
  const warningCount = results.filter((r) => r.status === "warning").length

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Comprehensive Platform Tester
        </CardTitle>
        <CardDescription>Test all features, pages, and functionality of ScriptShift Prompt Master</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Test Controls */}
          <div className="flex gap-4">
            <Button onClick={runAllTests} disabled={isRunning} className="flex items-center gap-2">
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run All Tests
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setResults([])
                setProgress(0)
              }}
              disabled={isRunning}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear Results
            </Button>
          </div>

          {/* Progress */}
          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Running tests...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Results Summary */}
          {results.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">{passCount}</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Passed</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-red-700 dark:text-red-300">{failCount}</p>
                      <p className="text-sm text-red-600 dark:text-red-400">Failed</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{warningCount}</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Warnings</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Detailed Results */}
          {results.length > 0 && (
            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                {categories.slice(0, 6).map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <div className="space-y-2">
                    {results
                      .filter((result) => result.category === category)
                      .map((result, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {getStatusIcon(result.status)}
                                <span className="font-medium text-sm">{result.test}</span>
                                <Badge variant="outline" className="text-xs">
                                  {result.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{result.message}</p>
                              {result.details && <p className="text-xs text-muted-foreground mt-1">{result.details}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
