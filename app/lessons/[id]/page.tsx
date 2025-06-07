"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Brain,
  Code,
  Target,
  Lightbulb,
  Trophy,
  AlertCircle,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Exercise {
  id: number
  title: string
  description: string
  prompt: string
  expectedOutput: string
  hints: string[]
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { translations, language } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [exerciseAnswer, setExerciseAnswer] = useState("")
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [showExerciseHints, setShowExerciseHints] = useState(false)

  const lessonId = params.id as string
  const lessonData = getLessonData(lessonId, language)

  const totalSteps = lessonData.steps.length
  const progress = Math.round(((activeStep + 1) / totalSteps) * 100)

  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep(activeStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleComplete = () => {
    router.push("/lessons")
  }

  const handleQuizSubmit = () => {
    setShowQuizResults(true)
  }

  const getQuizScore = () => {
    const correctAnswers =
      lessonData.quiz?.questions.filter((q, index) => quizAnswers[index] === q.correctAnswer).length || 0
    return Math.round((correctAnswers / (lessonData.quiz?.questions.length || 1)) * 100)
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => router.push("/lessons")} className="mb-4">
        <ArrowLeft className={`${language === "ar" || language === "ur" ? "transform-flip" : ""} mr-2 h-4 w-4`} />
        {translations.back} {translations.lessons}
      </Button>

      {/* Lesson Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge className={getLevelColor(lessonData.level)}>{lessonData.level}</Badge>
          <Badge variant="outline">{lessonData.duration}</Badge>
          <Badge variant="outline">{lessonData.category}</Badge>
        </div>
        <h1 className="text-3xl font-bold mb-2">{lessonData.title}</h1>
        <p className="text-muted-foreground text-lg">{lessonData.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-6">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {activeStep + 1} {translations.of || "of"} {totalSteps}
        </span>
      </div>

      {/* Learning Objectives */}
      {activeStep === 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lessonData.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="content" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="exercise" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Exercise
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        {/* Lesson Content */}
        <TabsContent value="content">
          <Card>
            <CardContent className="pt-6">
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: lessonData.steps[activeStep].content,
                }}
              />

              {/* Interactive Examples */}
              {lessonData.steps[activeStep].examples && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Interactive Examples</h3>
                  <div className="space-y-4">
                    {lessonData.steps[activeStep].examples.map((example, index) => (
                      <Card key={index} className="bg-muted/50">
                        <CardContent className="pt-4">
                          <h4 className="font-medium mb-2">{example.title}</h4>
                          <div className="bg-background p-4 rounded-md border mb-3">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Prompt:</p>
                            <p className="font-mono text-sm">{example.prompt}</p>
                          </div>
                          <div className="bg-background p-4 rounded-md border">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Expected Output:</p>
                            <p className="text-sm">{example.output}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Knowledge Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lessonData.quiz ? (
                <div className="space-y-6">
                  {lessonData.quiz.questions.map((question, index) => (
                    <div key={question.id} className="space-y-3">
                      <h3 className="font-medium">
                        {index + 1}. {question.question}
                      </h3>
                      <RadioGroup
                        value={quizAnswers[index]?.toString()}
                        onValueChange={(value) =>
                          setQuizAnswers((prev) => ({ ...prev, [index]: Number.parseInt(value) }))
                        }
                      >
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={optionIndex.toString()} id={`q${index}-${optionIndex}`} />
                            <Label htmlFor={`q${index}-${optionIndex}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>

                      {showQuizResults && (
                        <div
                          className={`p-3 rounded-md ${
                            quizAnswers[index] === question.correctAnswer
                              ? "bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800"
                              : "bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {quizAnswers[index] === question.correctAnswer ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">
                              {quizAnswers[index] === question.correctAnswer ? "Correct!" : "Incorrect"}
                            </span>
                          </div>
                          <p className="text-sm">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {!showQuizResults ? (
                    <Button onClick={handleQuizSubmit} className="w-full">
                      Submit Quiz
                    </Button>
                  ) : (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Quiz Results</span>
                        </div>
                        <p>You scored {getQuizScore()}% on this quiz!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No quiz available for this lesson.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exercise Tab */}
        <TabsContent value="exercise">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Practical Exercise
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lessonData.exercise ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">{lessonData.exercise.title}</h3>
                    <p className="text-muted-foreground mb-4">{lessonData.exercise.description}</p>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">Your Task:</h4>
                    <p className="text-sm">{lessonData.exercise.prompt}</p>
                  </div>

                  <div>
                    <Label htmlFor="exercise-answer" className="text-base font-medium">
                      Your Answer:
                    </Label>
                    <Textarea
                      id="exercise-answer"
                      placeholder="Write your prompt here..."
                      value={exerciseAnswer}
                      onChange={(e) => setExerciseAnswer(e.target.value)}
                      className="mt-2 min-h-[120px]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowExerciseHints(!showExerciseHints)}>
                      {showExerciseHints ? "Hide" : "Show"} Hints
                    </Button>
                    <Button>Check Answer</Button>
                  </div>

                  {showExerciseHints && (
                    <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-2">Hints:</h4>
                        <ul className="space-y-1">
                          {lessonData.exercise.hints.map((hint, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{hint}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No exercise available for this lesson.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Additional Resources</h3>
              <div className="space-y-4">
                {lessonData.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{resource}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handlePrevious} disabled={activeStep === 0}>
          <ArrowLeft className={`${language === "ar" || language === "ur" ? "transform-flip" : ""} mr-2 h-4 w-4`} />
          {translations.previous || "Previous"}
        </Button>
        {activeStep < totalSteps - 1 ? (
          <Button onClick={handleNext}>
            {translations.next || "Next"}
            <ArrowRight className={`${language === "ar" || language === "ur" ? "transform-flip" : ""} ml-2 h-4 w-4`} />
          </Button>
        ) : (
          <Button onClick={handleComplete}>
            {translations.complete || "Complete"}
            <CheckCircle2 className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Helper function for level colors
function getLevelColor(level: string) {
  switch (level) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

// Enhanced lesson data with interactive elements
function getLessonData(id: string, language: string) {
  const lessonContents: Record<string, any> = {
    "1": {
      title: "Introduction to Prompt Engineering",
      description: "Learn the fundamental concepts and principles of effective prompt design",
      level: "beginner",
      duration: "15 min",
      category: "fundamentals",
      objectives: [
        "Understand what prompt engineering is and why it matters",
        "Learn the basic components of an effective prompt",
        "Identify common prompt patterns and structures",
        "Practice creating your first effective prompts",
      ],
      steps: [
        {
          title: "What is Prompt Engineering?",
          content: `
            <h2>What is Prompt Engineering?</h2>
            <p>Prompt engineering is the process of designing and refining inputs to AI models to get desired outputs. It's a crucial skill for working with large language models like GPT-4, Claude, and others.</p>
            
            <h3>Why Prompt Engineering Matters</h3>
            <p>Effective prompts can dramatically improve the quality, relevance, and accuracy of AI-generated content. Poor prompts often lead to irrelevant or low-quality outputs.</p>
            
            <h3>Key Benefits</h3>
            <ul>
              <li><strong>Better Results:</strong> Get more accurate and relevant responses</li>
              <li><strong>Efficiency:</strong> Reduce the need for multiple iterations</li>
              <li><strong>Consistency:</strong> Achieve predictable outputs for similar tasks</li>
              <li><strong>Control:</strong> Guide the AI's behavior and response style</li>
            </ul>
            
            <h2>Basic Principles</h2>
            <ul>
              <li><strong>Clarity:</strong> Be clear and specific about what you want</li>
              <li><strong>Context:</strong> Provide relevant background information</li>
              <li><strong>Structure:</strong> Organize your prompt logically</li>
              <li><strong>Iteration:</strong> Refine your prompts based on results</li>
            </ul>
          `,
          examples: [
            {
              title: "Basic vs. Improved Prompt",
              prompt: "Write about dogs",
              output: "This prompt is too vague and will likely produce generic content about dogs.",
            },
            {
              title: "Improved Version",
              prompt:
                "Write a 200-word informative article about the benefits of dog ownership for mental health, targeting first-time pet owners.",
              output: "This prompt is specific, includes length, audience, and focus, leading to much better results.",
            },
          ],
        },
      ],
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is the primary goal of prompt engineering?",
            options: [
              "To make prompts as long as possible",
              "To design inputs that produce desired AI outputs",
              "To confuse the AI model",
              "To reduce the use of AI",
            ],
            correctAnswer: 1,
            explanation:
              "Prompt engineering focuses on crafting inputs that guide AI models to produce the specific outputs you want.",
          },
          {
            id: 2,
            question: "Which of these is NOT a key principle of effective prompting?",
            options: ["Clarity", "Context", "Ambiguity", "Structure"],
            correctAnswer: 2,
            explanation:
              "Ambiguity is the opposite of what you want in prompts. Clear, specific prompts produce better results.",
          },
        ],
      },
      exercise: {
        title: "Create Your First Effective Prompt",
        description: "Practice transforming a vague prompt into a clear, specific one.",
        prompt:
          "Transform this vague prompt: 'Tell me about climate change' into a specific, well-structured prompt that would produce a focused, useful response.",
        expectedOutput: "A prompt that includes specific aspects, target audience, format, and length requirements.",
        hints: [
          "Specify what aspect of climate change you want to focus on",
          "Define your target audience",
          "Specify the desired format and length",
          "Include the purpose or context for the information",
        ],
      },
      resources: [
        "OpenAI Prompt Engineering Guide",
        "Best Practices for AI Prompting",
        "Common Prompt Patterns and Templates",
        "Prompt Engineering Research Papers",
      ],
    },
    // Add more lessons here...
  }

  return (
    lessonContents[id] || {
      title: `Lesson ${id}`,
      description: "Lesson content",
      level: "beginner",
      duration: "15 min",
      category: "fundamentals",
      objectives: ["Learn the basics"],
      steps: [
        {
          title: "Lesson Content",
          content: `<p>Content for lesson ${id} is not available yet.</p>`,
        },
      ],
      resources: ["No resources available yet"],
    }
  )
}
