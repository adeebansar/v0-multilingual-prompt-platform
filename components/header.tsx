"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/components/language-provider"
import { BookOpen, Home, Play, Settings, BookCheck } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const { translations, isRTL } = useLanguage()

  const navigation = [
    { name: translations.home, href: "/", icon: Home },
    { name: translations.lessons, href: "/lessons", icon: BookOpen },
    { name: translations.playground, href: "/playground", icon: Play },
    { name: translations.quizzes, href: "/quizzes", icon: BookCheck },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground">SS</span>
            </div>
            <span className="font-bold text-xl">ScriptShift</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center text-sm font-medium ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
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
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">{translations.settings}</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
