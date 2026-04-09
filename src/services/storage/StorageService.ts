import type { Space, StagingAnalysis } from '@/types'

/**
 * Storage interface — swap LocalStorageAdapter for SupabaseAdapter
 * without touching any UI code.
 */
export interface StorageService {
  // Spaces
  getSpaces(): Promise<Space[]>
  saveSpace(space: Space): Promise<void>
  deleteSpace(id: string): Promise<void>

  // Staging
  getStagingAnalyses(): Promise<StagingAnalysis[]>
  saveStagingAnalysis(analysis: StagingAnalysis): Promise<void>
  deleteStagingAnalysis(id: string): Promise<void>

  // Nuke everything
  clearAll(): Promise<void>
}
