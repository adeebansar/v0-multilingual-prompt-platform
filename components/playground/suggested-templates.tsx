"use client"

import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import type { PromptTemplate } from "@/lib/templates"

interface SuggestedTemplatesProps {
  templates: PromptTemplate[]
  onUseTemplate: (prompt: string) => void
  onViewCategory: (category: string) => void
}

export function SuggestedTemplates({ templates, onUseTemplate, onViewCategory }: SuggestedTemplatesProps) {
  const { translations } = useLanguage()

  if (!templates.length) return null

  return (
    <div>
      <h4 className="font-medium text-yellow-600 dark:text-yellow-400 flex items-center mb-3">
        <Lightbulb className="h-4 w-4 mr-2" />
        {translations.suggestedTemplates || "Suggested Templates"}
      </h4>
      <div className="space-y-3">
        {templates.slice(0, 2).map((template, i) => (
          <div
            key={i}
            className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-md border border-yellow-100 dark:border-yellow-800"
          >
            <h5 className="font-medium text-sm mb-1">{template.title || `Template ${i + 1}`}</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">{template.prompt}</p>
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 bg-white dark:bg-gray-800"
                onClick={() => onUseTemplate(template.prompt)}
              >
                {translations.useTemplate || "Use Template"}
              </Button>
              {template.category && (
                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                  {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                </span>
              )}
            </div>
          </div>
        ))}

        {templates.length > 2 && (
          <Button
            variant="link"
            size="sm"
            className="text-xs p-0 h-auto"
            onClick={() => {
              if (templates[0]?.category) {
                onViewCategory(templates[0].category)
              }
            }}
          >
            {translations.viewMoreTemplates || "View more templates"} →
          </Button>
        )}
      </div>
    </div>
  )
}
