"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import type { ReactNode } from "react"

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  )
}
