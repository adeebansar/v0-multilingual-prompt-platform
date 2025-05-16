"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Wand2, X } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface ImprovedPromptsModalProps {
  improvedPrompts: string[]
  onUsePrompt: (prompt: string) => void
  onClose: () => void
}

export function ImprovedPromptsModal({ improvedPrompts, onUsePrompt, onClose }: ImprovedPromptsModalProps) {
  const { translations } = useLanguage()

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto bg-white dark:bg-gray-900 p-0 border-primary/20 shadow-xl">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <Wand2 className="h-5 w-5 mr-2" />
            {translations.improvedPrompts || "Improved Prompts"}
          </h2>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {translations.improvedPromptsDescription ||
              "These enhanced versions of your prompt will help you get better results from AI. Click 'Use This Prompt' to apply one."}
          </p>

          <div className="space-y-4 mt-4">
            {improvedPrompts.map((improvedPrompt, i) => (
              <div
                key={i}
                className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-md border border-purple-100 dark:border-purple-800 hover:shadow-md transition-shadow"
              >
                <p className="text-gray-800 dark:text-gray-200 mb-3">{improvedPrompt}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-gray-800 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => {
                    onUsePrompt(improvedPrompt)
                    onClose()
                  }}
                >
                  <ArrowRight className="h-4 w-4 mr-2 text-purple-500" />
                  {translations.usePrompt || "Use This Prompt"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
