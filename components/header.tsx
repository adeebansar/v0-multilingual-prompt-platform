"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/components/language-provider"
import { BookOpen, Home, Play, Settings, ClipboardCheck } from "lucide-react"
import { useEffect, useState } from "react"

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

export default function Header() {
  const pathname = usePathname()
  const { isRTL, t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Only show the correct navigation after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation: NavItem[] = [
    { name: t("home", "Home"), href: "/", icon: Home },
    { name: t("lessons", "Lessons"), href: "/lessons", icon: BookOpen },
    { name: t("playground", "Playground"), href: "/playground", icon: Play },
    { name: t("quizzes", "Quizzes"), href: "/quizzes", icon: ClipboardCheck }, // Changed from BookCheck to ClipboardCheck
  ]

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="font-bold text-primary-foreground">SS</span>
              </div>
              <span className="font-bold text-xl">ScriptShift</span>
            </div>
            <nav className="hidden md:flex gap-6">{/* Loading state */}</nav>
          </div>
          <div className="flex items-center gap-2">{/* Loading state */}</div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2" aria-label="ScriptShift Home">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground">SS</span>
            </div>
            <span className="font-bold text-xl">ScriptShift</span>
          </Link>
          <nav className="hidden md:flex gap-6" aria-label="Main Navigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center text-sm font-medium ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ModeToggle />
          <Link href="/settings">
            <Button variant="ghost" size="icon" aria-label={t("settings", "Settings")}>
              <Settings className="h-5 w-5" />
              <span className="sr-only">{t("settings", "Settings")}</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
