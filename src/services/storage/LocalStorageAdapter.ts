import type { Space, StagingAnalysis } from '@/types'
import type { StorageService } from './StorageService'

const KEYS = {
  spaces: 'rms:spaces',
  staging: 'rms:staging',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export const localStorageAdapter: StorageService = {
  async getSpaces() {
    return read<Space[]>(KEYS.spaces, [])
  },

  async saveSpace(space) {
    const spaces = read<Space[]>(KEYS.spaces, [])
    const idx = spaces.findIndex((s) => s.id === space.id)
    if (idx >= 0) {
      spaces[idx] = space
    } else {
      spaces.push(space)
    }
    write(KEYS.spaces, spaces)
  },

  async deleteSpace(id) {
    const spaces = read<Space[]>(KEYS.spaces, []).filter((s) => s.id !== id)
    write(KEYS.spaces, spaces)
  },

  async getStagingAnalyses() {
    return read<StagingAnalysis[]>(KEYS.staging, [])
  },

  async saveStagingAnalysis(analysis) {
    const list = read<StagingAnalysis[]>(KEYS.staging, [])
    const idx = list.findIndex((a) => a.id === analysis.id)
    if (idx >= 0) {
      list[idx] = analysis
    } else {
      list.push(analysis)
    }
    write(KEYS.staging, list)
  },

  async deleteStagingAnalysis(id) {
    const list = read<StagingAnalysis[]>(KEYS.staging, []).filter(
      (a) => a.id !== id
    )
    write(KEYS.staging, list)
  },

  async clearAll() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
  },
}
