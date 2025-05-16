"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"

export default function LessonsComponent() {
  const { translations } = useLanguage()
  const [activeTab, setActiveTab] = useState("all")

  const lessons = [
    {
      id: 1,
      title: "Introduction to Prompt Engineering",
      description: "Learn the basics of crafting effective prompts",
      level: "beginner",
      duration: "15 min",
    },
    {
      id: 2,
      title: "Advanced Prompt Techniques",
      description: "Master advanced techniques for complex tasks",
      level: "advanced",
      duration: "25 min",
    },
    {
      id: 3,
      title: "Domain-Specific Prompting",
      description: "Customize prompts for specific domains",
      level: "intermediate",
      duration: "20 min",
    },
    {
      id: 4,
      title: "Prompt Optimization Strategies",
      description: "Optimize your prompts for better results",
      level: "advanced",
      duration: "30 min",
    },
  ]

  const filteredLessons = activeTab === "all" ? lessons : lessons.filter((lesson) => lesson.level === activeTab)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{translations.lessons || "Lessons"}</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">{translations.all || "All"}</TabsTrigger>
          <TabsTrigger value="beginner">{translations.beginner || "Beginner"}</TabsTrigger>
          <TabsTrigger value="intermediate">{translations.intermediate || "Intermediate"}</TabsTrigger>
          <TabsTrigger value="advanced">{translations.advanced || "Advanced"}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.map((lesson) => (
          <Card key={lesson.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription>{lesson.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <span className="capitalize">{lesson.level}</span>
                </span>
                <span>{lesson.duration}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
