// Usage tracking storage and management
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UsageRecord = {
  date: string // YYYY-MM-DD
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCost: number
}

type UsageStore = {
  records: UsageRecord[]
  addUsage: (record: UsageRecord) => void
  clearUsage: () => void
  getUsageByDate: (startDate: string, endDate: string) => UsageRecord[]
  getUsageByModel: (model: string) => UsageRecord[]
  getTotalUsage: () => {
    promptTokens: number
    completionTokens: number
    totalTokens: number
    estimatedCost: number
  }
}

export const useUsageStore = create<UsageStore>()(
  persist(
    (set, get) => ({
      records: [],
      addUsage: (record) => {
        try {
          // Validate the record
          if (!record.date || !record.model || record.totalTokens < 0 || record.estimatedCost < 0) {
            console.error("Invalid usage record:", record)
            return
          }

          set((state) => ({
            records: [...state.records, record],
          }))
        } catch (error) {
          console.error("Error adding usage record:", error)
        }
      },
      clearUsage: () => {
        try {
          set({ records: [] })
        } catch (error) {
          console.error("Error clearing usage records:", error)
        }
      },
      getUsageByDate: (startDate, endDate) => {
        try {
          return get().records.filter((record) => record.date >= startDate && record.date <= endDate)
        } catch (error) {
          console.error("Error getting usage by date:", error)
          return []
        }
      },
      getUsageByModel: (model) => {
        try {
          return get().records.filter((record) => record.model === model)
        } catch (error) {
          console.error("Error getting usage by model:", error)
          return []
        }
      },
      getTotalUsage: () => {
        try {
          return get().records.reduce(
            (acc, record) => {
              return {
                promptTokens: acc.promptTokens + record.promptTokens,
                completionTokens: acc.completionTokens + record.completionTokens,
                totalTokens: acc.totalTokens + record.totalTokens,
                estimatedCost: acc.estimatedCost + record.estimatedCost,
              }
            },
            { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCost: 0 },
          )
        } catch (error) {
          console.error("Error calculating total usage:", error)
          return { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCost: 0 }
        }
      },
    }),
    {
      name: "usage-tracking",
      // Add error handling for storage operations
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("Usage tracking hydrated successfully")
        } else {
          console.error("Failed to hydrate usage tracking")
        }
      },
    },
  ),
)
