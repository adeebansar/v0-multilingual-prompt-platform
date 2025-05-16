"use client"

import { LanguageProvider } from "@/components/language-provider"
import type { ReactNode } from "react"

interface LanguageWrapperProps {
  children: ReactNode
}

export function LanguageWrapper({ children }: LanguageWrapperProps) {
  return <LanguageProvider>{children}</LanguageProvider>
}
