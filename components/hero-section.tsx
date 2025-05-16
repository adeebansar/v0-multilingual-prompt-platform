"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const { translations } = useLanguage()

  return (
    <section className="relative py-12 md:py-24 lg:py-32 xl:py-36 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="inline-block bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium mb-4">
            Master AI Interactions
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              {translations.welcome}
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">{translations.subtitle}</p>
          </div>
          <div className="space-x-4 mt-8">
            <Link href="/lessons">
              <Button className="px-8 bg-primary hover:bg-primary/90">
                {translations.getStarted}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/playground">
              <Button variant="outline" className="px-8">
                {translations.tryPlayground}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
