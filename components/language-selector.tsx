"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
  // Add new languages
  { value: "ar", label: "العربية", rtl: true },
  { value: "hi", label: "हिन्दी" },
  { value: "ur", label: "اردو", rtl: true },
  { value: "te", label: "తెలుగు" },
  { value: "ta", label: "தமிழ்" },
]

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const { language, setLanguage } = useLanguage()

  const currentLanguage = languages.find((l) => l.value === language)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[140px] justify-between">
          <Globe className="mr-2 h-4 w-4" />
          {currentLanguage?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.value}
                  onSelect={(currentValue) => {
                    setLanguage(currentValue as any)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", language === lang.value ? "opacity-100" : "opacity-0")} />
                  {lang.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
