"use client"

import { LanguageProvider } from "@/contexts/language-context"
import type { ReactNode } from "react"

export function LanguageWrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>
}
