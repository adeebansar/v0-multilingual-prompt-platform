"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

// Define types for Quiz data structure
interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: number | string; // Allow string if IDs can be non-numeric
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
}

interface QuizData {
  id: number | string; // Allow string if IDs can be non-numeric
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const { translations, language } = useLanguage()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)

  // Get quiz data based on the ID and language
  useEffect(() => {
    const data = getQuizData(params.id as string, language)
    setQuizData(data)
    setLoading(false)
  }, [params.id, language])

  if (loading || !quizData) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  const totalQuestions = quizData.questions.length
  const progress = Math.round(((currentQuestion + 1) / totalQuestions) * 100)

  const handleSelectAnswer = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: value,
    })
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
      window.scrollTo(0, 0)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleFinish = () => {
    // In a real app, you would save results to a database
    router.push("/quizzes")
  }

  const calculateScore = () => {
    let correctCount = 0
    quizData.questions.forEach((question: QuizQuestion, index: number) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++
      }
    })
    return {
      correct: correctCount,
      total: totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100),
    }
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="container py-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{translations.quizResults}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold mb-2">{score.percentage}%</div>
              <p className="text-muted-foreground">
                {translations.correctAnswers
                  .replace("{correct}", score.correct.toString())
                  .replace("{total}", score.total.toString())}
              </p>
            </div>

            <div className="space-y-6 mt-8">
              {quizData.questions.map((question: QuizQuestion, index: number) => {
                const isCorrect = selectedAnswers[index] === question.correctAnswer
                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg ${isCorrect ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}
                  >
                    <h3 className="font-medium mb-2">
                      {translations.question} {index + 1}: {question.question}
                    </h3>
                    <div className="ml-6 mb-2">
                      <p className="flex items-center">
                        <span
                          className={`font-medium ${isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {translations.yourAnswer}:{" "}
                          {question.options.find((opt: QuizOption) => opt.id === selectedAnswers[index])?.text ||
                            translations.notAnswered}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-green-600 dark:text-green-400 font-medium mt-1">
                          {translations.correctAnswer}:{" "}
                          {question.options.find((opt: QuizOption) => opt.id === question.correctAnswer)?.text}
                        </p>
                      )}
                    </div>
                    <p className="text-sm mt-2 text-muted-foreground">{question.explanation}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleFinish} className="w-full">
              {translations.finish}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQuestionData = quizData.questions[currentQuestion]

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => router.push("/quizzes")} className="mb-4">
        <ArrowLeft className={`${language === "ar" || language === "ur" ? "transform-flip" : ""} mr-2 h-4 w-4`} />
        {translations.backToQuizzes}
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{quizData.title}</h1>
        <p className="text-muted-foreground mt-2">{quizData.description}</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-sm text-muted-foreground">
          {currentQuestion + 1} {translations.of} {totalQuestions}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {translations.question} {currentQuestion + 1}: {currentQuestionData.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAnswers[currentQuestion] || ""}
            onValueChange={handleSelectAnswer}
            className="space-y-4"
          >
            {currentQuestionData.options.map((option: QuizOption) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Label htmlFor={`option-${option.id}`} className="flex-1">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            <ArrowLeft className={`${language === "ar" || language === "ur" ? "transform-flip" : ""} mr-2 h-4 w-4`} />
            {translations.previous}
          </Button>
          <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestion]}>
            {currentQuestion < totalQuestions - 1 ? (
              <>
                {translations.next}
                <ArrowRight
                  className={`${language === "ar" || language === "ur" ? "transform-flip" : ""} ml-2 h-4 w-4`}
                />
              </>
            ) : (
              <>
                {translations.finish}
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Function to get quiz data based on ID and language
function getQuizData(id: string, language: string): QuizData | undefined {
  // This would typically come from an API or database
  // For demonstration, we'll include content for all languages

  const quizContents: Record<string, Record<string, QuizData>> = {
    "1": {
      en: {
        id: 1,
        title: "Prompt Engineering Basics",
        description: "Test your knowledge of fundamental prompt engineering concepts",
        questions: [
          {
            id: 1,
            question: "What is prompt engineering?",
            options: [
              { id: "a", text: "Writing code to create AI models" },
              { id: "b", text: "Designing inputs to get desired outputs from AI models" },
              { id: "c", text: "A type of software engineering for prompt applications" },
              { id: "d", text: "Creating hardware for AI systems" },
            ],
            correctAnswer: "b",
            explanation:
              "Prompt engineering is the process of designing and refining inputs to AI models to get desired outputs. It involves understanding how to effectively communicate with AI systems.",
          },
          {
            id: 2,
            question: "Which of the following is NOT a common prompt engineering technique?",
            options: [
              { id: "a", text: "Role-based prompting" },
              { id: "b", text: "Few-shot learning" },
              { id: "c", text: "Chain-of-thought prompting" },
              { id: "d", text: "Neural network training" },
            ],
            correctAnswer: "d",
            explanation:
              "Neural network training is part of developing AI models, not a prompt engineering technique. The other options are all established prompt engineering methods.",
          },
          // Additional questions would be here
        ],
      },
      es: {
        id: 1,
        title: "Fundamentos de Ingeniería de Prompts",
        description: "Evalúa tu conocimiento de los conceptos fundamentales de ingeniería de prompts",
        questions: [
          {
            id: 1,
            question: "¿Qué es la ingeniería de prompts?",
            options: [
              { id: "a", text: "Escribir código para crear modelos de IA" },
              { id: "b", text: "Diseñar entradas para obtener salidas deseadas de modelos de IA" },
              { id: "c", text: "Un tipo de ingeniería de software para aplicaciones de prompt" },
              { id: "d", text: "Crear hardware para sistemas de IA" },
            ],
            correctAnswer: "b",
            explanation:
              "La ingeniería de prompts es el proceso de diseñar y refinar entradas para modelos de IA para obtener las salidas deseadas. Implica entender cómo comunicarse efectivamente con sistemas de IA.",
          },
          {
            id: 2,
            question: "¿Cuál de las siguientes NO es una técnica común de ingeniería de prompts?",
            options: [
              { id: "a", text: "Prompts basados en roles" },
              { id: "b", text: "Aprendizaje con pocos ejemplos" },
              { id: "c", text: "Prompts de cadena de pensamiento" },
              { id: "d", text: "Entrenamiento de redes neuronales" },
            ],
            correctAnswer: "d",
            explanation:
              "El entrenamiento de redes neuronales es parte del desarrollo de modelos de IA, no una técnica de ingeniería de prompts. Las otras opciones son métodos establecidos de ingeniería de prompts.",
          },
          // Additional questions would be here
        ],
      },
      // Add similar content for other languages
    },
    // Additional quizzes would be here
  }

  // Default to English if the requested language is not available for this quiz
  const quizId = id || "1"
  const availableContent = quizContents[quizId] || {}
  return availableContent[language] || availableContent.en
}
