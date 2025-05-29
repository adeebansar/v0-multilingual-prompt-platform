import { safeDynamicImport, createFallback } from "@/lib/dynamic-import-utils"

// Create a fallback component for the hero section
const HeroSectionFallback = createFallback("HeroSection")

// Properly import the hero section with error handling
export const DynamicHeroSection = safeDynamicImport(
  () => import("./hero-section-component").then((mod) => ({ default: mod.HeroSection })),
  {
    loading: HeroSectionFallback,
    ssr: true,
    displayName: "HeroSection",
  },
)
