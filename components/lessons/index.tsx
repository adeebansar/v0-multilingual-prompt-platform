import { safeDynamicImport, createFallback } from "@/lib/dynamic-import-utils"

// Create a fallback component for the lessons page
const LessonsFallback = createFallback("Lessons")

// Properly import the lessons page with error handling
export const LessonsComponent = safeDynamicImport(() => import("./lessons-component"), {
  loading: LessonsFallback,
  ssr: true,
  displayName: "Lessons",
})
