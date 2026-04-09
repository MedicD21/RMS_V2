import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Space, Scan } from '@/types'
import { localStorageAdapter } from '@/services/storage/LocalStorageAdapter'

interface SpacesState {
  spaces: Space[]
  loading: boolean
  // Actions
  loadSpaces: () => Promise<void>
  addSpace: (space: Space) => Promise<void>
  updateSpace: (space: Space) => Promise<void>
  deleteSpace: (id: string) => Promise<void>
  addScan: (spaceId: string, scan: Scan) => Promise<void>
  updateScanRendering: (spaceId: string, scanId: string, uri: string) => Promise<void>
}

export const useSpacesStore = create<SpacesState>()(
  persist(
    (set, get) => ({
      spaces: [],
      loading: false,

      loadSpaces: async () => {
        set({ loading: true })
        const spaces = await localStorageAdapter.getSpaces()
        set({ spaces, loading: false })
      },

      addSpace: async (space) => {
        await localStorageAdapter.saveSpace(space)
        set((s) => ({ spaces: [...s.spaces, space] }))
      },

      updateSpace: async (space) => {
        await localStorageAdapter.saveSpace(space)
        set((s) => ({
          spaces: s.spaces.map((sp) => (sp.id === space.id ? space : sp)),
        }))
      },

      deleteSpace: async (id) => {
        await localStorageAdapter.deleteSpace(id)
        set((s) => ({ spaces: s.spaces.filter((sp) => sp.id !== id) }))
      },

      addScan: async (spaceId, scan) => {
        const space = get().spaces.find((s) => s.id === spaceId)
        if (!space) return
        const updated: Space = { ...space, scans: [...space.scans, scan] }
        await localStorageAdapter.saveSpace(updated)
        set((s) => ({
          spaces: s.spaces.map((sp) => (sp.id === spaceId ? updated : sp)),
        }))
      },

      updateScanRendering: async (spaceId, scanId, uri) => {
        const space = get().spaces.find((s) => s.id === spaceId)
        if (!space) return
        const updated: Space = {
          ...space,
          scans: space.scans.map((sc) =>
            sc.id === scanId ? { ...sc, renderingUri: uri } : sc
          ),
        }
        await localStorageAdapter.saveSpace(updated)
        set((s) => ({
          spaces: s.spaces.map((sp) => (sp.id === spaceId ? updated : sp)),
        }))
      },
    }),
    { name: 'rms:spaces-store' }
  )
)
