import { safeDynamicImport, createFallback } from "@/lib/dynamic-import-utils"

// Create a fallback component for the playground
const PlaygroundFallback = createFallback("Playground")

// Properly import the playground with error handling
export const Playground = safeDynamicImport(() => import("./playground-component"), {
  loading: PlaygroundFallback,
  // Disable SSR for the playground as it might use browser-only APIs
  ssr: false,
  displayName: "Playground",
})
