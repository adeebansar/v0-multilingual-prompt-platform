"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

export default function LessonTwoPage() {
  const router = useRouter()
  const { translations } = useLanguage()

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.push("/lessons")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {translations.back || "Back"} {translations.lessons || "Lessons"}
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Role-Based Prompting</h1>
        <p className="text-muted-foreground mt-2">Master the technique of assigning roles to AI models</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>What is Role-Based Prompting?</h2>
            <p>
              Role-based prompting is a technique where you assign a specific role or persona to the AI model before
              asking it to perform a task.
            </p>

            <h3>Why Role-Based Prompting Works</h3>
            <p>
              By establishing a clear role, you provide context that guides the model's response style, expertise level,
              and perspective.
            </p>

            <ul>
              <li>It provides clear context for the model</li>
              <li>It establishes expectations for expertise and tone</li>
              <li>It helps the model access relevant knowledge patterns</li>
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
