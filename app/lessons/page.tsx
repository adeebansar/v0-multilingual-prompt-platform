"use client"

import { useLanguage } from "@/components/language-provider"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Lightbulb, Users, Workflow, Layers, Sparkles, Globe, BookCheck, Code } from "lucide-react"

export default function LessonsPage() {
  const { translations, isRTL } = useLanguage()

  // Define all 8 lessons for all languages
  const lessons = [
    {
      id: 1,
      title: translations.lesson1Title || "Introduction to Prompt Engineering",
      description: translations.lesson1Desc || "Learn the basics of crafting effective prompts",
      duration: "30",
      levelKey: "beginner",
      progress: 0,
      category: "fundamentals",
      icon: Lightbulb,
    },
    {
      id: 2,
      title: translations.lesson2Title || "Role-Based Prompting",
      description: translations.lesson2Desc || "Master the technique of assigning roles to AI models",
      duration: "35",
      levelKey: "beginner",
      progress: 0,
      category: "fundamentals",
      icon: Users,
    },
    {
      id: 3,
      title: translations.lesson3Title || "Chain-of-Thought Prompting",
      description: translations.lesson3Desc || "Guide AI models through complex reasoning tasks step by step",
      duration: "45",
      levelKey: "intermediate",
      progress: 0,
      category: "advanced",
      icon: Workflow,
    },
    {
      id: 4,
      title: translations.lesson4Title || "Few-Shot Learning",
      description: translations.lesson4Desc || "Teach AI models by providing examples in your prompts",
      duration: "40",
      levelKey: "intermediate",
      progress: 0,
      category: "advanced",
      icon: Layers,
    },
    {
      id: 5,
      title: translations.lesson5Title || "Advanced Techniques",
      description: translations.lesson5Desc || "Master complex prompt structures and patterns",
      duration: "50",
      levelKey: "advanced",
      progress: 0,
      category: "advanced",
      icon: Sparkles,
    },
    {
      id: 6,
      title: translations.lesson6Title || "Domain-Specific Prompting",
      description: translations.lesson6Desc || "Tailor prompts for specific use cases and industries",
      duration: "45",
      levelKey: "intermediate",
      progress: 0,
      category: "specialized",
      icon: Globe,
    },
    {
      id: 7,
      title: translations.lesson7Title || "Prompt Optimization",
      description: translations.lesson7Desc || "Learn techniques to refine and improve your prompts",
      duration: "35",
      levelKey: "intermediate",
      progress: 0,
      category: "advanced",
      icon: BookCheck,
    },
    {
      id: 8,
      title: translations.lesson8Title || "Creative Writing Prompts",
      description: translations.lesson8Desc || "Specialized techniques for creative and narrative tasks",
      duration: "40",
      levelKey: "advanced",
      progress: 0,
      category: "specialized",
      icon: Code,
    },
  ]

  return (
    <div className={`container mx-auto px-4 py-8 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">{translations.lessons}</h1>
        <p className="text-gray-600 dark:text-gray-400">{translations.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>
                {translations.lesson} {lesson.id}: {lesson.title}
              </CardTitle>
              <CardDescription>{lesson.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  {lesson.duration} {translations.min}
                </div>
                <div className="text-sm text-muted-foreground">{translations[lesson.levelKey] || lesson.levelKey}</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/lessons/${lesson.id}`} className="w-full">
                <Button className="w-full">{translations.startLesson}</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8 p-4 bg-primary/10 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Alternative Lesson Access</h2>
        <p className="mb-4">
          If you're experiencing issues with the regular lesson pages, you can try these alternative links:
        </p>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <a href="/lesson-one">Lesson 1 (Alternative)</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/lesson-two">Lesson 2 (Alternative)</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
