"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"
import {
  BookOpen,
  Clock,
  Users,
  Trophy,
  CheckCircle2,
  PlayCircle,
  FileText,
  Brain,
  Target,
  Lightbulb,
  Code,
  MessageSquare,
} from "lucide-react"

interface Lesson {
  id: number
  title: string
  description: string
  level: "beginner" | "intermediate" | "advanced"
  duration: string
  category: string
  objectives: string[]
  prerequisites?: string[]
  hasQuiz: boolean
  hasExercise: boolean
  completed?: boolean
  icon: React.ReactNode
}

export default function LessonsComponent() {
  const { translations } = useLanguage()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [completedLessons, setCompletedLessons] = useState<number[]>([1, 2]) // Mock completed lessons

  const lessons: Lesson[] = [
    {
      id: 1,
      title: "Introduction to Prompt Engineering",
      description: "Learn the fundamental concepts and principles of effective prompt design",
      level: "beginner",
      duration: "15 min",
      category: "fundamentals",
      objectives: [
        "Understand what prompt engineering is and why it matters",
        "Learn the basic components of an effective prompt",
        "Identify common prompt patterns and structures",
      ],
      hasQuiz: true,
      hasExercise: true,
      completed: true,
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "Role-Based Prompting",
      description: "Master the technique of assigning roles and personas to AI models",
      level: "beginner",
      duration: "20 min",
      category: "fundamentals",
      objectives: [
        "Learn how to assign effective roles to AI models",
        "Understand the impact of persona on response quality",
        "Practice creating role-based prompts for different scenarios",
      ],
      prerequisites: ["Introduction to Prompt Engineering"],
      hasQuiz: true,
      hasExercise: true,
      completed: true,
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "Context and Constraints",
      description: "Learn how to provide context and set constraints for better AI responses",
      level: "intermediate",
      duration: "25 min",
      category: "techniques",
      objectives: [
        "Understand the importance of context in prompt design",
        "Learn how to set effective constraints and boundaries",
        "Practice balancing specificity with creativity",
      ],
      prerequisites: ["Role-Based Prompting"],
      hasQuiz: true,
      hasExercise: true,
      icon: <Target className="h-5 w-5" />,
    },
    {
      id: 4,
      title: "Few-Shot Learning Techniques",
      description: "Master the art of providing examples to guide AI behavior",
      level: "intermediate",
      duration: "30 min",
      category: "techniques",
      objectives: [
        "Understand few-shot vs zero-shot prompting",
        "Learn how to select and structure effective examples",
        "Practice creating few-shot prompts for complex tasks",
      ],
      prerequisites: ["Context and Constraints"],
      hasQuiz: true,
      hasExercise: true,
      icon: <Lightbulb className="h-5 w-5" />,
    },
    {
      id: 5,
      title: "Chain-of-Thought Prompting",
      description: "Learn advanced reasoning techniques for complex problem solving",
      level: "advanced",
      duration: "35 min",
      category: "advanced",
      objectives: [
        "Understand chain-of-thought reasoning",
        "Learn step-by-step problem decomposition",
        "Practice creating prompts for complex analytical tasks",
      ],
      prerequisites: ["Few-Shot Learning Techniques"],
      hasQuiz: true,
      hasExercise: true,
      icon: <Brain className="h-5 w-5" />,
    },
    {
      id: 6,
      title: "Domain-Specific Prompting",
      description: "Customize prompts for specific industries and use cases",
      level: "intermediate",
      duration: "40 min",
      category: "applications",
      objectives: [
        "Learn domain-specific prompt patterns",
        "Understand industry terminology and context",
        "Practice creating prompts for business, technical, and creative domains",
      ],
      prerequisites: ["Context and Constraints"],
      hasQuiz: true,
      hasExercise: true,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: 7,
      title: "Prompt Optimization and Testing",
      description: "Learn systematic approaches to improve and validate your prompts",
      level: "advanced",
      duration: "45 min",
      category: "optimization",
      objectives: [
        "Learn prompt testing methodologies",
        "Understand metrics for prompt evaluation",
        "Practice iterative prompt improvement",
      ],
      prerequisites: ["Domain-Specific Prompting"],
      hasQuiz: true,
      hasExercise: true,
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      id: 8,
      title: "Conversational AI and Multi-Turn Prompts",
      description: "Master techniques for maintaining context across conversations",
      level: "advanced",
      duration: "50 min",
      category: "advanced",
      objectives: [
        "Understand conversational context management",
        "Learn multi-turn prompt strategies",
        "Practice building coherent dialogue systems",
      ],
      prerequisites: ["Chain-of-Thought Prompting"],
      hasQuiz: true,
      hasExercise: true,
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      id: 9,
      title: "Code Generation and Technical Prompts",
      description: "Specialized techniques for generating and debugging code",
      level: "advanced",
      duration: "55 min",
      category: "applications",
      objectives: [
        "Learn code generation prompt patterns",
        "Understand debugging and optimization prompts",
        "Practice technical documentation generation",
      ],
      prerequisites: ["Domain-Specific Prompting"],
      hasQuiz: true,
      hasExercise: true,
      icon: <Code className="h-5 w-5" />,
    },
  ]

  const categories = [
    { id: "all", label: "All Lessons", count: lessons.length },
    { id: "fundamentals", label: "Fundamentals", count: lessons.filter((l) => l.category === "fundamentals").length },
    { id: "techniques", label: "Techniques", count: lessons.filter((l) => l.category === "techniques").length },
    { id: "advanced", label: "Advanced", count: lessons.filter((l) => l.category === "advanced").length },
    { id: "applications", label: "Applications", count: lessons.filter((l) => l.category === "applications").length },
    { id: "optimization", label: "Optimization", count: lessons.filter((l) => l.category === "optimization").length },
  ]

  const levels = [
    { id: "all", label: "All Levels" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ]

  const filteredLessons = lessons.filter((lesson) => {
    if (activeTab === "all") return true
    if (levels.some((level) => level.id === activeTab)) {
      return activeTab === "all" || lesson.level === activeTab
    }
    return lesson.category === activeTab
  })

  const overallProgress = Math.round((completedLessons.length / lessons.length) * 100)

  const handleLessonClick = (lessonId: number) => {
    router.push(`/lessons/${lessonId}`)
  }

  const getLevelColor = (level: string) => {
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

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{translations.lessons || "Prompt Engineering Lessons"}</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Master the art of prompt engineering with our comprehensive curriculum designed for all skill levels.
        </p>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {completedLessons.length} of {lessons.length} lessons completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{overallProgress}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-2">Filter by Category</h3>
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.label}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="lg:w-48">
            <h3 className="text-sm font-medium mb-2">Filter by Level</h3>
            <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
              {levels.map((level) => (
                <TabsTrigger key={level.id} value={level.id} className="text-xs">
                  {level.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
      </Tabs>

      {/* Lessons Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.map((lesson) => (
          <Card
            key={lesson.id}
            className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
              lesson.completed ? "ring-2 ring-green-200 dark:ring-green-800" : ""
            }`}
            onClick={() => handleLessonClick(lesson.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {lesson.icon}
                  <Badge className={getLevelColor(lesson.level)}>{lesson.level}</Badge>
                </div>
                {lesson.completed && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              </div>
              <CardTitle className="text-lg leading-tight">{lesson.title}</CardTitle>
              <CardDescription className="text-sm">{lesson.description}</CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Prerequisites */}
              {lesson.prerequisites && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Prerequisites:</p>
                  <div className="flex flex-wrap gap-1">
                    {lesson.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Objectives */}
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Learning Objectives:</p>
                <ul className="text-xs space-y-1">
                  {lesson.objectives.slice(0, 2).map((objective, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-primary mt-1">•</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                  {lesson.objectives.length > 2 && (
                    <li className="text-muted-foreground">+{lesson.objectives.length - 2} more objectives</li>
                  )}
                </ul>
              </div>

              {/* Lesson Features */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {lesson.duration}
                  </div>
                  {lesson.hasQuiz && (
                    <div className="flex items-center gap-1">
                      <Brain className="h-3 w-3" />
                      Quiz
                    </div>
                  )}
                  {lesson.hasExercise && (
                    <div className="flex items-center gap-1">
                      <Code className="h-3 w-3" />
                      Exercise
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button className="w-full" variant={lesson.completed ? "outline" : "default"} size="sm">
                <PlayCircle className="h-4 w-4 mr-2" />
                {lesson.completed ? "Review Lesson" : "Start Lesson"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Path Suggestion */}
      {activeTab === "all" && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recommended Learning Path
            </CardTitle>
            <CardDescription>
              Follow this structured path to master prompt engineering from basics to advanced techniques.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium text-green-700 dark:text-green-400">Foundation (Beginner)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Introduction to Prompt Engineering</li>
                  <li>• Role-Based Prompting</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Building Skills (Intermediate)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Context and Constraints</li>
                  <li>• Few-Shot Learning Techniques</li>
                  <li>• Domain-Specific Prompting</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-red-700 dark:text-red-400">Mastery (Advanced)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Chain-of-Thought Prompting</li>
                  <li>• Conversational AI</li>
                  <li>• Code Generation</li>
                  <li>• Prompt Optimization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
