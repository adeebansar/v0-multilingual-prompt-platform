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
  addPrompt: (item: Omit<PromptHistoryItem, "id" | "createdAt">) => void
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
        const newItem = {
          ...item,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          tags: [],
        }
        set((state) => ({
          history: [newItem, ...state.history].slice(0, 100), // Keep only the last 100 items
        }))
        return newItem
      },
      removePrompt: (id) => {
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        }))
      },
      clearHistory: () => {
        set({ history: [] })
      },
      getPrompt: (id) => {
        return get().history.find((item) => item.id === id)
      },
      addTagToPrompt: (id, tag) => {
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
      },
      removeTagFromPrompt: (id, tag) => {
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
      },
    }),
    {
      name: "prompt-history",
    },
  ),
)
