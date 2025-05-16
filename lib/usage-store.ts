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
        set((state) => ({
          records: [...state.records, record],
        }))
      },
      clearUsage: () => {
        set({ records: [] })
      },
      getUsageByDate: (startDate, endDate) => {
        return get().records.filter((record) => record.date >= startDate && record.date <= endDate)
      },
      getUsageByModel: (model) => {
        return get().records.filter((record) => record.model === model)
      },
      getTotalUsage: () => {
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
      },
    }),
    {
      name: "usage-tracking",
    },
  ),
)
