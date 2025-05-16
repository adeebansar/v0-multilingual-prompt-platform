import type React from "react"
export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="lessons-layout">{children}</div>
}
