"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function SimpleLessonPage() {
  const router = useRouter()

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.push("/lessons")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Lessons
      </Button>

      <h1 className="text-3xl font-bold mb-6">Introduction to Prompt Engineering</h1>
      <p className="mb-4">This is a simplified version of the lesson page.</p>

      <div className="prose max-w-none">
        <h2>What is Prompt Engineering?</h2>
        <p>
          Prompt engineering is the process of designing and refining inputs to AI models to get desired outputs. It's a
          crucial skill for working with large language models.
        </p>

        <h3>Why Prompt Engineering Matters</h3>
        <p>
          Effective prompts can dramatically improve the quality, relevance, and accuracy of AI-generated content. Poor
          prompts often lead to irrelevant or low-quality outputs.
        </p>

        <ul>
          <li>Get more accurate and relevant responses</li>
          <li>Reduce hallucinations and factual errors</li>
          <li>Guide the AI toward your desired format and style</li>
        </ul>
      </div>

      <div className="mt-8">
        <Button onClick={() => router.push("/lessons")}>Return to Lessons</Button>
      </div>
    </div>
  )
}
