"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function FewShotLearningLesson() {
  const router = useRouter()
  const { translations, language } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)

  // Get lesson data based on language
  const lessonData = getLessonData("4", language)

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
          {activeStep + 1} {translations.of} {totalSteps}
        </span>
      </div>

      <Tabs defaultValue="content" className="mb-8">
        <TabsList>
          <TabsTrigger value="content">{translations.lessonContent}</TabsTrigger>
          <TabsTrigger value="resources">{translations.resources}</TabsTrigger>
          <TabsTrigger value="notes">{translations.notes}</TabsTrigger>
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
              <h3 className="text-lg font-medium mb-4">{translations.additionalResources}</h3>
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
              <h3 className="text-lg font-medium mb-4">{translations.yourNotes}</h3>
              <textarea
                className="w-full h-40 p-4 border rounded-md bg-background"
                placeholder={translations.addNotesHere}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handlePrevious} disabled={activeStep === 0}>
          <ArrowLeft className={`${language === "ar" || language === "ur" ? "transform-flip" : ""} mr-2 h-4 w-4`} />
          {translations.previous}
        </Button>
        {activeStep < totalSteps - 1 ? (
          <Button onClick={handleNext}>
            {translations.next}
            <ArrowRight className={`${language === "ar" || language === "ur" ? "transform-flip" : ""} ml-2 h-4 w-4`} />
          </Button>
        ) : (
          <Button onClick={handleComplete}>
            {translations.complete}
            <CheckCircle2 className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Function to get lesson data based on language
function getLessonData(id: string, language: string) {
  // This would typically come from an API or database
  // For demonstration, we'll include content for a few languages for lesson 4

  const lessonContents = {
    "4": {
      en: {
        title: "Few-Shot Learning",
        description: "Teach AI models by providing examples in your prompts",
        steps: [
          {
            title: "Understanding Few-Shot Learning",
            content: `
              <h2>What is Few-Shot Learning?</h2>
              <p>Few-shot learning is a powerful prompt engineering technique where you provide the AI model with a small number of examples demonstrating the pattern or format you want it to follow. Instead of explicitly explaining the rules, you show the model what you want through examples.</p>
              
              <p>This approach leverages the model's ability to recognize patterns and adapt its responses based on the examples provided, even for tasks it wasn't specifically trained on.</p>
              
              <h3>Why Few-Shot Learning Works</h3>
              <p>Few-shot learning is effective because:</p>
              <ul>
                <li>It demonstrates the desired output format through concrete examples</li>
                <li>It establishes patterns that the model can recognize and extend</li>
                <li>It's often more effective than explaining abstract rules</li>
                <li>It helps the model understand nuanced requirements</li>
                <li>It reduces the need for complex instructions</li>
              </ul>
            `,
          },
          {
            title: "Basic Few-Shot Learning Structure",
            content: `
              <h2>Crafting Few-Shot Learning Prompts</h2>
              <p>A basic few-shot learning prompt follows this structure:</p>
              
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">[Task description]</p>
                <p class="font-mono">Example 1:</p>
                <p class="font-mono">Input: [example input 1]</p>
                <p class="font-mono">Output: [example output 1]</p>
                <p class="font-mono">Example 2:</p>
                <p class="font-mono">Input: [example input 2]</p>
                <p class="font-mono">Output: [example output 2]</p>
                <p class="font-mono">Example 3:</p>
                <p class="font-mono">Input: [example input 3]</p>
                <p class="font-mono">Output: [example output 3]</p>
                <p class="font-mono">Now, please provide the output for:</p>
                <p class="font-mono">Input: [actual input]</p>
              </div>
              
              <h3>Key Components</h3>
              <ul>
                <li><strong>Task description:</strong> A brief explanation of what you want the model to do</li>
                <li><strong>Examples:</strong> 2-5 input/output pairs that demonstrate the pattern</li>
                <li><strong>Actual input:</strong> The specific input you want the model to process</li>
              </ul>
              
              <p>The examples should be representative of the task and cover different variations if possible.</p>
            `,
          },
          {
            title: "Examples of Few-Shot Learning Prompts",
            content: `
              <h2>Few-Shot Learning Prompt Examples</h2>
              
              <h3>Example 1: Text Classification</h3>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">Classify the sentiment of the following text as positive, negative, or neutral.</p>
                <p class="font-mono">Example 1:</p>
                <p class="font-mono">Text: "I absolutely loved the movie, it was fantastic!"</p>
                <p class="font-mono">Sentiment: Positive</p>
                <p class="font-mono">Example 2:</p>
                <p class="font-mono">Text: "The service was terrible and the food was cold."</p>
                <p class="font-mono">Sentiment: Negative</p>
                <p class="font-mono">Example 3:</p>
                <p class="font-mono">Text: "The package arrived on time as expected."</p>
                <p class="font-mono">Sentiment: Neutral</p>
                <p class="font-mono">Now, classify the sentiment of this text:</p>
                <p class="font-mono">Text: "While the graphics were impressive, the storyline was predictable and boring."</p>
              </div>
              
              <h3>Example 2: Format Conversion</h3>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">Convert the following dates from MM/DD/YYYY format to DD Month YYYY format.</p>
                <p class="font-mono">Example 1:</p>
                <p class="font-mono">Input: 01/15/2023</p>
                <p class="font-mono">Output: 15 January 2023</p>
                <p class="font-mono">Example 2:</p>
                <p class="font-mono">Input: 07/04/1776</p>
                <p class="font-mono">Output: 4 July 1776</p>
                <p class="font-mono">Example 3:</p>
                <p class="font-mono">Input: 12/25/2022</p>
                <p class="font-mono">Output: 25 December 2022</p>
                <p class="font-mono">Now, convert this date:</p>
                <p class="font-mono">Input: 09/11/2001</p>
              </div>
              
              <h3>Example 3: Creative Pattern</h3>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">Create a haiku about the given subject. A haiku is a three-line poem with 5 syllables in the first line, 7 in the second, and 5 in the third.</p>
                <p class="font-mono">Example 1:</p>
                <p class="font-mono">Subject: Ocean</p>
                <p class="font-mono">Haiku:</p>
                <p class="font-mono">Waves crash on the shore</p>
                <p class="font-mono">Blue expanse stretching outward</p>
                <p class="font-mono">Endless mystery</p>
                <p class="font-mono">Example 2:</p>
                <p class="font-mono">Subject: Mountain</p>
                <p class="font-mono">Haiku:</p>
                <p class="font-mono">Peaks touch the blue sky</p>
                <p class="font-mono">Standing tall through wind and snow</p>
                <p class="font-mono">Ancient and steadfast</p>
                <p class="font-mono">Now, create a haiku about:</p>
                <p class="font-mono">Subject: Autumn</p>
              </div>
            `,
          },
          {
            title: "Advanced Few-Shot Techniques",
            content: `
              <h2>Advanced Few-Shot Learning Techniques</h2>
              
              <h3>Diverse Examples</h3>
              <p>Include examples that cover different aspects or edge cases of the task:</p>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">Extract the person's name, age, and profession from the text.</p>
                <p class="font-mono">Example 1 (standard format):</p>
                <p class="font-mono">Text: "John Smith is a 35-year-old software engineer living in Boston."</p>
                <p class="font-mono">Name: John Smith</p>
                <p class="font-mono">Age: 35</p>
                <p class="font-mono">Profession: Software Engineer</p>
                <p class="font-mono">Example 2 (different order):</p>
                <p class="font-mono">Text: "At 42, Sarah Johnson works as a pediatrician in a local hospital."</p>
                <p class="font-mono">Name: Sarah Johnson</p>
                <p class="font-mono">Age: 42</p>
                <p class="font-mono">Profession: Pediatrician</p>
                <p class="font-mono">Example 3 (missing information):</p>
                <p class="font-mono">Text: "Michael Brown from Chicago has been a teacher for over 15 years."</p>
                <p class="font-mono">Name: Michael Brown</p>
                <p class="font-mono">Age: Unknown</p>
                <p class="font-mono">Profession: Teacher</p>
              </div>
              
              <h3>Graduated Complexity</h3>
              <p>Arrange examples from simple to complex to guide the model's understanding:</p>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">Solve the following math problems step by step.</p>
                <p class="font-mono">Example 1 (simple):</p>
                <p class="font-mono">Problem: 5 + 3 = ?</p>
                <p class="font-mono">Solution: 5 + 3 = 8</p>
                <p class="font-mono">Example 2 (medium):</p>
                <p class="font-mono">Problem: 12 × 4 = ?</p>
                <p class="font-mono">Solution: 12 × 4 = 48</p>
                <p class="font-mono">Example 3 (complex):</p>
                <p class="font-mono">Problem: 25% of 80 = ?</p>
                <p class="font-mono">Solution: 25% of 80 = 0.25 × 80 = 20</p>
                <p class="font-mono">Now solve:</p>
                <p class="font-mono">Problem: 15% of 120 + 45 = ?</p>
              </div>
              
              <h3>Combining with Other Techniques</h3>
              <p>Few-shot learning can be combined with other prompt engineering techniques:</p>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">You are an expert translator who specializes in formal business language. Translate the following English phrases to French with the appropriate level of formality.</p>
                <p class="font-mono">Example 1:</p>
                <p class="font-mono">English: "Thank you for your recent inquiry."</p>
                <p class="font-mono">French: "Nous vous remercions de votre récente demande."</p>
                <p class="font-mono">Example 2:</p>
                <p class="font-mono">English: "We look forward to our future collaboration."</p>
                <p class="font-mono">French: "Nous nous réjouissons de notre future collaboration."</p>
                <p class="font-mono">Now translate:</p>
                <p class="font-mono">English: "Please find attached the requested documents."</p>
              </div>
            `,
          },
          {
            title: "Practice Exercise",
            content: `
              <h2>Practice Exercise: Creating Few-Shot Learning Prompts</h2>
              
              <p>Now it's your turn to practice creating effective few-shot learning prompts. Try crafting prompts for the following scenarios:</p>
              
              <h3>Scenario 1: Text Transformation</h3>
              <p>Create a few-shot prompt that demonstrates how to transform text from passive voice to active voice.</p>
              
              <h3>Scenario 2: Data Extraction</h3>
              <p>Create a few-shot prompt that extracts specific information (like dates, locations, or amounts) from paragraphs of text.</p>
              
              <h3>Scenario 3: Style Transfer</h3>
              <p>Create a few-shot prompt that demonstrates how to rewrite text in a specific style (e.g., academic, casual, poetic).</p>
              
              <div class="bg-primary/10 p-4 rounded-md my-4">
                <p class="font-medium">Tips for effective practice:</p>
                <ul>
                  <li>Include 3-5 diverse examples that clearly demonstrate the pattern</li>
                  <li>Make sure your examples cover different variations or edge cases</li>
                  <li>Keep the format consistent across all examples</li>
                  <li>Test your prompts in the playground to see how they perform</li>
                </ul>
              </div>
              
              <p>After creating your prompts, try them out in the playground section of this platform to see how they perform!</p>
            `,
          },
        ],
        resources: ["Few-Shot Learning Guide", "Example Templates Library", "Pattern Recognition in LLMs"],
      },
      es: {
        title: "Aprendizaje con Pocos Ejemplos",
        description: "Enseña a los modelos de IA proporcionando ejemplos en tus prompts",
        steps: [
          {
            title: "Entendiendo el Aprendizaje con Pocos Ejemplos",
            content: `
              <h2>¿Qué es el Aprendizaje con Pocos Ejemplos?</h2>
              <p>El aprendizaje con pocos ejemplos (Few-Shot Learning) es una poderosa técnica de ingeniería de prompts donde proporcionas al modelo de IA un pequeño número de ejemplos que demuestran el patrón o formato que quieres que siga. En lugar de explicar explícitamente las reglas, le muestras al modelo lo que quieres a través de ejemplos.</p>
              
              <p>Este enfoque aprovecha la capacidad del modelo para reconocer patrones y adaptar sus respuestas basándose en los ejemplos proporcionados, incluso para tareas para las que no fue específicamente entrenado.</p>
              
              <h3>Por qué funciona el Aprendizaje con Pocos Ejemplos</h3>
              <p>El aprendizaje con pocos ejemplos es efectivo porque:</p>
              <ul>
                <li>Demuestra el formato de salida deseado a través de ejemplos concretos</li>
                <li>Establece patrones que el modelo puede reconocer y extender</li>
                <li>A menudo es más efectivo que explicar reglas abstractas</li>
                <li>Ayuda al modelo a entender requisitos matizados</li>
                <li>Reduce la necesidad de instrucciones complejas</li>
              </ul>
            `,
          },
          // Additional steps would be here in Spanish
        ],
        resources: [
          "Guía de Aprendizaje con Pocos Ejemplos",
          "Biblioteca de Plantillas de Ejemplo",
          "Reconocimiento de Patrones en LLMs",
        ],
      },
      // Add similar content for other languages
    },
  }

  // Default to English if the requested language is not available for this lesson
  const lessonId = id || "4"
  const availableContent = lessonContents[lessonId] || {}
  return availableContent[language] || availableContent.en
}
