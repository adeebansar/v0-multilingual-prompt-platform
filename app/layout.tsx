import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ScriptShift Prompt Master",
  description: "Master the art of prompt engineering in your language",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}

// Import the client providers from a separate file
import { ClientProviders } from "@/components/client-providers"
