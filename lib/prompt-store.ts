// Prompt history storage and management
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PromptHistoryItem = {
  id: string
  prompt: string
  response: string
  model: string
  temperature: number
  createdAt: Date
  tags?: string[]
}

type PromptStore = {
  history: PromptHistoryItem[]
  addPrompt: (item: Omit<PromptHistoryItem, "id" | "createdAt">) => PromptHistoryItem
  removePrompt: (id: string) => void
  clearHistory: () => void
  getPrompt: (id: string) => PromptHistoryItem | undefined
  addTagToPrompt: (id: string, tag: string) => void
  removeTagFromPrompt: (id: string, tag: string) => void
}

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      history: [],
      addPrompt: (item) => {
        try {
          const newItem = {
            ...item,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            tags: item.tags || [],
          }
          set((state) => ({
            history: [newItem, ...state.history].slice(0, 100), // Keep only the last 100 items
          }))
          return newItem
        } catch (error) {
          console.error("Error adding prompt to history:", error)
          // Return a default item in case of error
          const fallbackItem = {
            ...item,
            id: `fallback-${Date.now()}`,
            createdAt: new Date(),
            tags: item.tags || [],
          }
          return fallbackItem
        }
      },
      removePrompt: (id) => {
        try {
          set((state) => ({
            history: state.history.filter((item) => item.id !== id),
          }))
        } catch (error) {
          console.error("Error removing prompt from history:", error)
        }
      },
      clearHistory: () => {
        try {
          set({ history: [] })
        } catch (error) {
          console.error("Error clearing prompt history:", error)
        }
      },
      getPrompt: (id) => {
        try {
          return get().history.find((item) => item.id === id)
        } catch (error) {
          console.error("Error getting prompt from history:", error)
          return undefined
        }
      },
      addTagToPrompt: (id, tag) => {
        try {
          set((state) => ({
            history: state.history.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  tags: [...(item.tags || []), tag],
                }
              }
              return item
            }),
          }))
        } catch (error) {
          console.error("Error adding tag to prompt:", error)
        }
      },
      removeTagFromPrompt: (id, tag) => {
        try {
          set((state) => ({
            history: state.history.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  tags: (item.tags || []).filter((t) => t !== tag),
                }
              }
              return item
            }),
          }))
        } catch (error) {
          console.error("Error removing tag from prompt:", error)
        }
      },
    }),
    {
      name: "prompt-history",
      // Add error handling for storage operations
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("Prompt history hydrated successfully")
        } else {
          console.error("Failed to hydrate prompt history")
        }
      },
    },
  ),
)
