"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Wand2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface ImprovedPromptsProps {
  improvedPrompts: string[]
  onUsePrompt: (prompt: string) => void
  onViewMore: () => void
}

export function ImprovedPrompts({ improvedPrompts, onUsePrompt, onViewMore }: ImprovedPromptsProps) {
  const { translations } = useLanguage()

  if (!improvedPrompts.length) return null

  return (
    <div className="mt-6">
      <h4 className="font-medium text-purple-600 dark:text-purple-400 flex items-center mb-3">
        <Wand2 className="h-4 w-4 mr-2" />
        {translations.improvedPrompts || "Improved Prompts"}
      </h4>
      <div className="space-y-3">
        {improvedPrompts.slice(0, 2).map((improvedPrompt, i) => (
          <div
            key={i}
            className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-md border border-purple-100 dark:border-purple-800 hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{improvedPrompt}</p>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 bg-white dark:bg-gray-800 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
              onClick={() => onUsePrompt(improvedPrompt)}
            >
              <ArrowRight className="h-3 w-3 mr-1 text-purple-500" />
              {translations.usePrompt || "Use This Prompt"}
            </Button>
          </div>
        ))}

        {improvedPrompts.length > 2 && (
          <Button
            variant="link"
            size="sm"
            className="text-xs p-0 h-auto text-purple-500 hover:text-purple-700"
            onClick={onViewMore}
          >
            {translations.viewMorePrompts || "View more improved prompts"} →
          </Button>
        )}
      </div>
    </div>
  )
}
