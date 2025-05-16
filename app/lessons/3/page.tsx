"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function ChainOfThoughtLesson() {
  const router = useRouter()
  const { translations, language } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)

  // Get lesson data based on language
  const lessonData = getLessonData("3", language)

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
  // For demonstration, we'll include content for a few languages for lesson 3

  const lessonContents = {
    "3": {
      en: {
        title: "Chain-of-Thought Prompting",
        description: "Guide AI through complex reasoning tasks step by step",
        steps: [
          {
            title: "Introduction to Chain-of-Thought",
            content: `
              <h2>What is Chain-of-Thought Prompting?</h2>
              <p>Chain-of-Thought (CoT) prompting is an advanced technique that guides AI models to break down complex problems into a series of intermediate reasoning steps before arriving at a final answer. This approach mimics human problem-solving processes and significantly improves performance on tasks requiring multi-step reasoning.</p>
              
              <p>Rather than asking for a direct answer, CoT prompting encourages the model to "think aloud" and show its work, making the reasoning process explicit and traceable.</p>
              
              <h3>Why Chain-of-Thought Works</h3>
              <p>Chain-of-Thought prompting is effective because:</p>
              <ul>
                <li>It reduces complex problems into manageable steps</li>
                <li>It helps the model avoid reasoning errors by making each step explicit</li>
                <li>It allows for verification of the reasoning process</li>
                <li>It improves performance on math, logic, and reasoning tasks</li>
                <li>It makes the model's thought process transparent to users</li>
              </ul>
            `,
          },
          {
            title: "Basic Chain-of-Thought Structure",
            content: `
              <h2>Crafting Chain-of-Thought Prompts</h2>
              <p>A basic Chain-of-Thought prompt follows this structure:</p>
              
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">[Problem statement]</p>
                <p class="font-mono">Let's think through this step by step.</p>
              </div>
              
              <p>The key phrase "Let's think through this step by step" signals to the model that it should break down its reasoning process rather than jumping directly to an answer.</p>
              
              <h3>Example: Math Problem</h3>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">If John has 5 apples and gives 2 to Mary, then buys 3 more apples and gives half of all his apples to Tom, how many apples does John have left?</p>
                <p class="font-mono">Let's think through this step by step.</p>
              </div>
              
              <p>With this prompt, the model will likely respond by breaking down the problem:</p>
              <ol>
                <li>John starts with 5 apples</li>
                <li>John gives 2 apples to Mary, leaving him with 3 apples</li>
                <li>John buys 3 more apples, giving him a total of 6 apples</li>
                <li>John gives half of his 6 apples to Tom, which is 3 apples</li>
                <li>John has 3 apples left</li>
              </ol>
            `,
          },
          {
            title: "Examples of Chain-of-Thought Prompts",
            content: `
              <h2>Chain-of-Thought Prompt Examples</h2>
              
              <h3>Example 1: Logical Reasoning</h3>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">All mammals are warm-blooded. All whales are mammals. Are all whales warm-blooded?</p>
                <p class="font-mono">Let's think through this step by step.</p>
              </div>
              
              <h3>Example 2: Multi-Step Math Problem</h3>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">A store is having a 25% off sale. If you buy an item with a listed price of $80 and you have a coupon for an additional $10 off, what is the final price after applying both the percentage discount and the coupon? Assume the percentage discount is applied first, then the coupon.</p>
                <p class="font-mono">Let's solve this step by step.</p>
              </div>
              
              <h3>Example 3: Decision Making</h3>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">You're planning a trip and have three hotel options: Hotel A costs $200 per night and is 5 miles from the attractions you want to visit. Hotel B costs $150 per night but is 15 miles away. Hotel C costs $250 per night and is 2 miles away. If you're staying for 4 nights and transportation costs $2 per mile per day, which hotel is the most economical choice overall?</p>
                <p class="font-mono">Let's analyze this step by step.</p>
              </div>
            `,
          },
          {
            title: "Advanced Chain-of-Thought Techniques",
            content: `
              <h2>Advanced Chain-of-Thought Techniques</h2>
              
              <h3>Few-Shot Chain-of-Thought</h3>
              <p>You can provide examples of the reasoning process to guide the model:</p>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">Example 1: If I have 3 apples and get 2 more, how many do I have?</p>
                <p class="font-mono">Step 1: I start with 3 apples.</p>
                <p class="font-mono">Step 2: I get 2 more apples.</p>
                <p class="font-mono">Step 3: 3 + 2 = 5 apples total.</p>
                <p class="font-mono">Answer: 5 apples.</p>
                <p class="font-mono">---</p>
                <p class="font-mono">Example 2: If I have 10 candies and give 3 to my friend, then eat 2 myself, how many candies do I have left?</p>
                <p class="font-mono">Step 1: I start with 10 candies.</p>
                <p class="font-mono">Step 2: I give 3 candies to my friend, leaving 10 - 3 = 7 candies.</p>
                <p class="font-mono">Step 3: I eat 2 candies, leaving 7 - 2 = 5 candies.</p>
                <p class="font-mono">Answer: 5 candies.</p>
                <p class="font-mono">---</p>
                <p class="font-mono">Now solve this problem: If I have $50 and spend $15 on lunch, then receive $20 as a gift, and finally spend $25 on dinner, how much money do I have left?</p>
              </div>
              
              <h3>Self-Consistency Chain-of-Thought</h3>
              <p>Ask the model to solve the problem multiple times and check for consistency:</p>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">Solve this problem in three different ways, then determine which answer is correct:</p>
                <p class="font-mono">A factory produces 400 items per day. If they increase production by 15% for 5 days, how many additional items will they produce compared to their normal output?</p>
              </div>
              
              <h3>Structured Chain-of-Thought</h3>
              <p>Provide a specific structure for the reasoning process:</p>
              <div class="bg-muted p-4 rounded-md my-4">
                <p class="font-mono">Solve this problem by following these steps:</p>
                <p class="font-mono">1. Identify the given information</p>
                <p class="font-mono">2. Determine what we need to find</p>
                <p class="font-mono">3. Set up the equations needed</p>
                <p class="font-mono">4. Solve the equations</p>
                <p class="font-mono">5. Verify the answer makes sense</p>
                <p class="font-mono">Problem: A train travels at 60 mph for 2 hours, then increases its speed to 80 mph for 1.5 hours. What is the total distance traveled?</p>
              </div>
            `,
          },
          {
            title: "Practice Exercise",
            content: `
              <h2>Practice Exercise: Creating Chain-of-Thought Prompts</h2>
              
              <p>Now it's your turn to practice creating effective Chain-of-Thought prompts. Try crafting prompts for the following scenarios:</p>
              
              <h3>Scenario 1: Mathematical Reasoning</h3>
              <p>Create a Chain-of-Thought prompt for a multi-step math problem involving percentages, fractions, or geometry.</p>
              
              <h3>Scenario 2: Logical Analysis</h3>
              <p>Create a Chain-of-Thought prompt for analyzing a logical argument or solving a puzzle.</p>
              
              <h3>Scenario 3: Decision Making</h3>
              <p>Create a Chain-of-Thought prompt for a complex decision with multiple factors to consider.</p>
              
              <div class="bg-primary/10 p-4 rounded-md my-4">
                <p class="font-medium">Tips for effective practice:</p>
                <ul>
                  <li>Make sure the problem requires multiple steps to solve</li>
                  <li>Include clear instructions to think step by step</li>
                  <li>Consider providing a structure for the reasoning process</li>
                  <li>Test your prompts in the playground to see how they perform</li>
                </ul>
              </div>
              
              <p>After creating your prompts, try them out in the playground section of this platform to see how they perform!</p>
            `,
          },
        ],
        resources: [
          "Chain-of-Thought Research Paper",
          "Step-by-Step Reasoning Examples",
          "Advanced Problem-Solving Templates",
        ],
      },
      es: {
        title: "Prompts de Cadena de Pensamiento",
        description: "Guía a los modelos de IA a través de tareas de razonamiento complejas paso a paso",
        steps: [
          {
            title: "Introducción a la Cadena de Pensamiento",
            content: `
              <h2>¿Qué es el Prompting de Cadena de Pensamiento?</h2>
              <p>El prompting de Cadena de Pensamiento (Chain-of-Thought o CoT) es una técnica avanzada que guía a los modelos de IA para desglosar problemas complejos en una serie de pasos de razonamiento intermedios antes de llegar a una respuesta final. Este enfoque imita los procesos de resolución de problemas humanos y mejora significativamente el rendimiento en tareas que requieren razonamiento de múltiples pasos.</p>
              
              <p>En lugar de pedir una respuesta directa, el prompting CoT anima al modelo a "pensar en voz alta" y mostrar su trabajo, haciendo que el proceso de razonamiento sea explícito y rastreable.</p>
              
              <h3>Por qué funciona la Cadena de Pensamiento</h3>
              <p>El prompting de Cadena de Pensamiento es efectivo porque:</p>
              <ul>
                <li>Reduce problemas complejos a pasos manejables</li>
                <li>Ayuda al modelo a evitar errores de razonamiento al hacer cada paso explícito</li>
                <li>Permite la verificación del proceso de razonamiento</li>
                <li>Mejora el rendimiento en tareas de matemáticas, lógica y razonamiento</li>
                <li>Hace que el proceso de pensamiento del modelo sea transparente para los usuarios</li>
              </ul>
            `,
          },
          // Additional steps would be here in Spanish
        ],
        resources: [
          "Artículo de Investigación sobre Cadena de Pensamiento",
          "Ejemplos de Razonamiento Paso a Paso",
          "Plantillas Avanzadas de Resolución de Problemas",
        ],
      },
      // Add similar content for other languages
    },
  }

  // Default to English if the requested language is not available for this lesson
  const lessonId = id || "3"
  const availableContent = lessonContents[lessonId] || {}
  return availableContent[language] || availableContent.en
}
