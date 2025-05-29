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
        return { default: (props: any) => null }
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

export function createFallback(name: string) {
  const Fallback = () => {
    return (
      <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">Loading {name}...</div>
      </div>
    )
  }

  Fallback.displayName = `Fallback(${name})`
  return Fallback
}
