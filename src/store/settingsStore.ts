import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings, ThemeMode } from '@/types'
import { DEFAULT_SETTINGS } from '@/types'

interface SettingsState extends AppSettings {
  setTheme: (theme: ThemeMode) => void
  setOpenRouterModel: (model: string) => void
  setReplicateModel: (model: string) => void
  setAmazonConfigured: (configured: boolean) => void
  clearAllData: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setTheme: (theme) => set({ theme }),
      setOpenRouterModel: (openRouterModel) => set({ openRouterModel }),
      setReplicateModel: (replicateModel) => set({ replicateModel }),
      setAmazonConfigured: (amazonConfigured) => set({ amazonConfigured }),

      clearAllData: () => {
        // Clear spaces + staging from localStorage
        localStorage.removeItem('rms:spaces')
        localStorage.removeItem('rms:staging')
        localStorage.removeItem('rms:spaces-store')
        localStorage.removeItem('rms:staging-store')
        window.location.reload()
      },
    }),
    { name: 'rms:settings' }
  )
)
