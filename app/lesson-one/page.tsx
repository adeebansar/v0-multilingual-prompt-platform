"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

export default function LessonOnePage() {
  const router = useRouter()
  const { translations } = useLanguage()

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.push("/lessons")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {translations.back || "Back"} {translations.lessons || "Lessons"}
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Introduction to Prompt Engineering</h1>
        <p className="text-muted-foreground mt-2">Learn the basics of crafting effective prompts</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>What is Prompt Engineering?</h2>
            <p>
              Prompt engineering is the process of designing and refining inputs to AI models to get desired outputs.
              It's a crucial skill for working with large language models.
            </p>

            <h3>Why Prompt Engineering Matters</h3>
            <p>
              Effective prompts can dramatically improve the quality, relevance, and accuracy of AI-generated content.
              Poor prompts often lead to irrelevant or low-quality outputs.
            </p>

            <ul>
              <li>Get more accurate and relevant responses</li>
              <li>Reduce hallucinations and factual errors</li>
              <li>Guide the AI toward your desired format and style</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-end">
        <Button onClick={() => router.push("/lessons")}>{translations.complete || "Complete"}</Button>
      </div>
    </div>
  )
}
