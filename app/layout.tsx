import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { LanguageProvider } from "@/components/language-provider"
import { Analytics } from "@vercel/analytics/react"
import "@/app/globals.css"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ScriptShift Prompt Master",
  description: "Learn prompt engineering in your language",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <footer className="border-t py-4">
                  <div className="container mx-auto text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} ScriptShift Prompt Master. All rights reserved.
                  </div>
                </footer>
              </div>
            </Suspense>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
