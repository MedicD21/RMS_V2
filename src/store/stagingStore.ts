import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StagingAnalysis } from '@/types'
import { localStorageAdapter } from '@/services/storage/LocalStorageAdapter'

interface StagingState {
  analyses: StagingAnalysis[]
  loadAnalyses: () => Promise<void>
  addAnalysis: (analysis: StagingAnalysis) => Promise<void>
  updateRendering: (id: string, uri: string) => Promise<void>
  deleteAnalysis: (id: string) => Promise<void>
}

export const useStagingStore = create<StagingState>()(
  persist(
    (set, get) => ({
      analyses: [],

      loadAnalyses: async () => {
        const analyses = await localStorageAdapter.getStagingAnalyses()
        set({ analyses })
      },

      addAnalysis: async (analysis) => {
        await localStorageAdapter.saveStagingAnalysis(analysis)
        set((s) => ({ analyses: [analysis, ...s.analyses] }))
      },

      updateRendering: async (id, uri) => {
        const updated = get().analyses.map((a) =>
          a.id === id ? { ...a, renderingUri: uri } : a
        )
        const analysis = updated.find((a) => a.id === id)
        if (analysis) await localStorageAdapter.saveStagingAnalysis(analysis)
        set({ analyses: updated })
      },

      deleteAnalysis: async (id) => {
        await localStorageAdapter.deleteStagingAnalysis(id)
        set((s) => ({ analyses: s.analyses.filter((a) => a.id !== id) }))
      },
    }),
    { name: 'rms:staging-store' }
  )
)
