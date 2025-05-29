import type { ComponentType } from "react"
import dynamic from "next/dynamic"

/**
 * Safely imports a component with proper error handling and loading states
 *
 * @param importFn - The import function that returns the component
 * @param options - Options for the dynamic import
 * @returns A dynamically imported component
 */
export function safeDynamicImport<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    loading?: ComponentType
    ssr?: boolean
    displayName?: string
  } = {},
) {
  const { loading, ssr = true, displayName } = options

  // Create the dynamic component
  const DynamicComponent = dynamic(
    () =>
      importFn().catch((err) => {
        console.error(`Failed to load dynamic component:`, err)
        // Return a minimal component that won't break rendering
        return { default: (_props: unknown) => null }
      }),
    {
      loading,
      ssr,
    },
  )

  // Set a display name for better debugging
  if (displayName) {
    DynamicComponent.displayName = `Dynamic(${displayName})`
  }

  return DynamicComponent
}

/**
 * Creates a fallback component for use with dynamic imports
 *
 * @param name - The name of the component for display purposes
 * @returns A fallback component
 */
export function createFallback(name: string) {
  const Fallback = () => <div>Loading {name}...</div>;
  Fallback.displayName = `Fallback(${name})`;
  return Fallback;
}
