"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { translations, language } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)

  // Get lesson ID from params
  const lessonId = params.id as string

  // Get lesson data based on language and lesson ID
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
    // In a real app, you would save progress to a database
    router.push("/lessons")
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.push("/lessons")} className="mb-4">
        <ArrowLeft className={`${language === "ar" || language === "ur" ? "transform-flip" : ""} mr-2 h-4 w-4`} />
        {translations.back} {translations.lessons}
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{lessonData.title}</h1>
        <p className="text-muted-foreground mt-2">{lessonData.description}</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-sm text-muted-foreground">
          {activeStep + 1} {translations.of || "of"} {totalSteps}
        </span>
      </div>

      <Tabs defaultValue="content" className="mb-8">
        <TabsList>
          <TabsTrigger value="content">{translations.lessonContent || "Lesson Content"}</TabsTrigger>
          <TabsTrigger value="resources">{translations.resources || "Resources"}</TabsTrigger>
          <TabsTrigger value="notes">{translations.notes || "Notes"}</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <Card>
            <CardContent className="pt-6">
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: lessonData.steps[activeStep].content,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resources">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">{translations.additionalResources || "Additional Resources"}</h3>
              <ul className="space-y-2">
                {lessonData.resources.map((resource, index) => (
                  <li key={index}>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      {resource}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">{translations.yourNotes || "Your Notes"}</h3>
              <textarea
                className="w-full h-40 p-4 border rounded-md bg-background"
                placeholder={translations.addNotesHere || "Add notes here..."}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

// Define types for lesson structure
interface LessonStep {
  title: string;
  content: string;
}

interface LessonContent {
  title: string;
  description: string;
  steps: LessonStep[];
  resources: string[];
}

// Function to get lesson data based on language and lesson ID
function getLessonData(id: string, language: string): LessonContent {
  // This would typically come from an API or database
  // For demonstration, we'll include content for a few languages and lessons

  const lessonContents: Record<string, Record<string, LessonContent>> = {
    "1": {
      en: {
        title: "Introduction to Prompt Engineering",
        description: "Learn the basics of crafting effective prompts",
        steps: [
          {
            title: "What is Prompt Engineering?",
            content: `
              <h2>What is Prompt Engineering?</h2>
              <p>Prompt engineering is the process of designing and refining inputs to AI models to get desired outputs. It's a crucial skill for working with large language models like GPT-4.</p>
              
              <h3>Why Prompt Engineering Matters</h3>
              <p>Effective prompts can dramatically improve the quality, relevance, and accuracy of AI-generated content. Poor prompts often lead to irrelevant or low-quality outputs.</p>
              
              <h2>Basic Principles</h2>
              <ul>
                <li><strong>Clarity:</strong> Be clear and specific about what you want</li>
                <li><strong>Context:</strong> Provide relevant background information</li>
                <li><strong>Structure:</strong> Organize your prompt logically</li>
                <li><strong>Iteration:</strong> Refine your prompts based on results</li>
              </ul>
            `,
          },
          {
            title: "Components of an Effective Prompt",
            content: `
              <h2>Components of an Effective Prompt</h2>
              <p>A well-crafted prompt typically includes several key components:</p>
              
              <h3>1. Task Specification</h3>
              <p>Clearly state what you want the AI to do. For example: "Write," "Summarize," "Explain," "Analyze," etc.</p>
              
              <h3>2. Context and Background</h3>
              <p>Provide relevant information that helps the AI understand the scope and purpose of your request.</p>
              
              <h3>3. Format Instructions</h3>
              <p>Specify how you want the response formatted: as a list, paragraph, table, etc.</p>
              
              <h3>4. Examples (Optional)</h3>
              <p>Include examples of the kind of response you're looking for, especially for complex tasks.</p>
              
              <h3>5. Constraints and Parameters</h3>
              <p>Set boundaries like word count, tone, audience level, or specific aspects to include/exclude.</p>
            `,
          },
          {
            title: "Common Prompt Patterns",
            content: `
              <h2>Common Prompt Patterns</h2>
              <p>Certain patterns have emerged as particularly effective in prompt engineering:</p>
              
              <h3>Direct Instruction</h3>
              <p>Simply tell the AI what to do: "Write a summary of quantum computing for beginners."</p>
              
              <h3>Role Assignment</h3>
              <p>Assign a role to the AI: "As an expert in climate science, explain the greenhouse effect."</p>
              
              <h3>Step-by-Step Requests</h3>
              <p>Break down complex tasks: "First, explain what blockchain is. Then, describe three applications. Finally, discuss limitations."</p>
              
              <h3>Few-Shot Learning</h3>
              <p>Provide examples of the pattern you want the AI to follow:</p>
              <pre>
              Input: "Apple"
              Output: "Apple is a fruit that grows on trees and is typically red, green, or yellow."
              
              Input: "Coffee"
              Output: "Coffee is a beverage made from roasted coffee beans and is known for its stimulating effects."
              
              Input: "Democracy"
              </pre>
            `,
          },
        ],
        resources: ["Prompt Engineering Guide", "Effective Prompting Techniques", "AI Interaction Best Practices"],
      },
      es: {
        title: "Introducción a la Ingeniería de Prompts",
        description: "Aprende los fundamentos para crear prompts efectivos",
        steps: [
          {
            title: "¿Qué es la Ingeniería de Prompts?",
            content: `
              <h2>¿Qué es la Ingeniería de Prompts?</h2>
              <p>La ingeniería de prompts es el proceso de diseñar y refinar entradas para modelos de IA para obtener los resultados deseados. Es una habilidad crucial para trabajar con modelos de lenguaje grandes como GPT-4.</p>
              
              <h3>Por qué es importante la Ingeniería de Prompts</h3>
              <p>Los prompts efectivos pueden mejorar dramáticamente la calidad, relevancia y precisión del contenido generado por IA. Los prompts deficientes a menudo conducen a resultados irrelevantes o de baja calidad.</p>
              
              <h2>Principios Básicos</h2>
              <ul>
                <li><strong>Claridad:</strong> Sé claro y específico sobre lo que quieres</li>
                <li><strong>Contexto:</strong> Proporciona información de fondo relevante</li>
                <li><strong>Estructura:</strong> Organiza tu prompt de manera lógica</li>
                <li><strong>Iteración:</strong> Refina tus prompts basándote en los resultados</li>
              </ul>
            `,
          },
          // Additional steps would be here in Spanish
        ],
        resources: [
          "Guía de Ingeniería de Prompts",
          "Técnicas Efectivas de Prompting",
          "Mejores Prácticas de Interacción con IA",
        ],
      },
      // Add similar content for other languages
    },
    "2": {
      en: {
        title: "Role-Based Prompting",
        description: "Master the technique of assigning roles to AI models",
        steps: [
          {
            title: "Introduction to Role-Based Prompting",
            content: `
              <h2>What is Role-Based Prompting?</h2>
              <p>Role-based prompting is a technique where you assign a specific role or persona to the AI model before asking it to perform a task. This helps frame the response in a particular context or expertise level.</p>
              
              <h3>Why Role-Based Prompting Works</h3>
              <p>By establishing a clear role, you provide context that guides the model's response style, expertise level, and perspective. This technique leverages the model's ability to adapt its outputs based on the assigned role.</p>
              
              <h2>Benefits of Role-Based Prompting</h2>
              <ul>
                <li><strong>Expertise:</strong> Access specialized knowledge domains</li>
                <li><strong>Consistency:</strong> Maintain a consistent perspective throughout responses</li>
                <li><strong>Tone Control:</strong> Influence the formality and style of responses</li>
                <li><strong>Creativity:</strong> Unlock different creative approaches</li>
              </ul>
            `,
          },
          {
            title: "Basic Role-Based Prompt Structure",
            content: `
              <h2>Crafting Role-Based Prompts</h2>
              <p>A basic role-based prompt follows this structure:</p>
              
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">You are a [role/profession/character] who [key characteristics]. [Task or question]</p>
              </div>
              
              <h3>Example Roles</h3>
              <ul>
                <li><strong>Professional roles:</strong> Scientist, teacher, journalist, lawyer, doctor</li>
                <li><strong>Expertise levels:</strong> Expert, beginner, researcher, student</li>
                <li><strong>Historical figures:</strong> Einstein, Shakespeare, Marie Curie</li>
                <li><strong>Character types:</strong> Mentor, critic, advocate, skeptic</li>
              </ul>
              
              <h3>Example Role-Based Prompts</h3>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">You are an experienced physics professor who specializes in explaining complex concepts to undergraduate students. Explain quantum entanglement in simple terms.</p>
              </div>
              
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">You are a literary critic with expertise in 19th century literature. Analyze the themes in Jane Austen's "Pride and Prejudice."</p>
              </div>
            `,
          },
          {
            title: "Advanced Role-Based Techniques",
            content: `
              <h2>Advanced Role-Based Techniques</h2>
              
              <h3>Multi-Role Prompting</h3>
              <p>Assign multiple roles to create a dialogue or debate:</p>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">You are both a proponent and critic of cryptocurrency. Create a balanced dialogue between these two perspectives discussing the future of Bitcoin.</p>
              </div>
              
              <h3>Role Evolution</h3>
              <p>Change roles throughout a conversation to get different perspectives:</p>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">First, as a financial advisor, explain the concept of compound interest. Then, as a historian, describe how compound interest has shaped economies throughout history.</p>
              </div>
              
              <h3>Detailed Role Specifications</h3>
              <p>Provide rich details about the role to get more nuanced responses:</p>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">You are a marine biologist with 20 years of field experience studying coral reefs in the Great Barrier Reef. You're passionate about conservation but also pragmatic about economic realities. Explain the current state of coral bleaching and recommend actionable steps for preservation.</p>
              </div>
            `,
          },
        ],
        resources: [
          "Role-Based Prompting Guide",
          "Expert Personas for AI Interaction",
          "Character Development in Prompts",
        ],
      },
      es: {
        title: "Prompts Basados en Roles",
        description: "Domina la técnica de asignar roles a modelos de IA",
        steps: [
          {
            title: "Introducción a los Prompts Basados en Roles",
            content: `
              <h2>¿Qué son los Prompts Basados en Roles?</h2>
              <p>Los prompts basados en roles son una técnica donde asignas un rol o persona específica al modelo de IA antes de pedirle que realice una tarea. Esto ayuda a enmarcar la respuesta en un contexto o nivel de experiencia particular.</p>
              
              <h3>Por qué funcionan los Prompts Basados en Roles</h3>
              <p>Al establecer un rol claro, proporcionas contexto que guía el estilo de respuesta del modelo, el nivel de experiencia y la perspectiva. Esta técnica aprovecha la capacidad del modelo para adaptar sus salidas según el rol asignado.</p>
              
              <h2>Beneficios de los Prompts Basados en Roles</h2>
              <ul>
                <li><strong>Experiencia:</strong> Accede a dominios de conocimiento especializado</li>
                <li><strong>Consistencia:</strong> Mantén una perspectiva consistente en las respuestas</li>
                <li><strong>Control de Tono:</strong> Influye en la formalidad y estilo de las respuestas</li>
                <li><strong>Creatividad:</strong> Desbloquea diferentes enfoques creativos</li>
              </ul>
            `,
          },
          // Additional steps would be here in Spanish
        ],
        resources: [
          "Guía de Prompts Basados en Roles",
          "Personas Expertas para Interacción con IA",
          "Desarrollo de Personajes en Prompts",
        ],
      },
      // Add similar content for other languages
    },
    // Add similar content for other lessons
  }

  // Default to English if the requested language is not available for this lesson
  const availableContent = lessonContents[id] || {}
  return (
    availableContent[language] ||
    availableContent.en || {
      title: `Lesson ${id}`,
      description: "Lesson content",
      steps: [
        {
          title: "Lesson Content",
          content: `<p>Content for lesson ${id} is not available in your selected language yet.</p>`,
        },
      ],
      resources: ["No resources available yet"],
    }
  )
}
