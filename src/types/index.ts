// ─── Room Types ───────────────────────────────────────────────────────────────

export type RoomType =
  | 'bedroom'
  | 'kitchen'
  | 'living_room'
  | 'office'
  | 'bathroom'
  | 'garage'
  | 'other'

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  bedroom: 'Bedroom',
  kitchen: 'Kitchen',
  living_room: 'Living Room',
  office: 'Office',
  bathroom: 'Bathroom',
  garage: 'Garage',
  other: 'Other',
}

// ─── Score ────────────────────────────────────────────────────────────────────

export interface BreakdownMetric {
  label: string
  score: number // 0–100
}

export type ScoreColor = 'low' | 'mid' | 'high'

export function getScoreColor(score: number): ScoreColor {
  if (score <= 40) return 'low'
  if (score <= 70) return 'mid'
  return 'high'
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface Product {
  asin: string
  title: string
  price: number
  imageUrl: string
  affiliateUrl: string // includes tag=Reasonhome-20
}

// ─── Spaces ───────────────────────────────────────────────────────────────────

export interface Scan {
  id: string
  spaceId: string
  date: string // ISO 8601
  photoUri: string // local filesystem path
  score: number // 0–100
  breakdownMetrics: BreakdownMetric[]
  strengths: string[]
  weaknesses: string[]
  estimatedMinutes: number  // estimated time to reset the space
  resetSteps: string[]      // ordered action steps to tidy the space
  productSuggestions: Product[]
  renderingUri?: string // Replicate output
}

export interface Space {
  id: string
  name: string
  roomType: RoomType
  createdAt: string // ISO 8601
  scans: Scan[] // ordered oldest → newest
}

// ─── Staging ──────────────────────────────────────────────────────────────────

export interface StagingAnalysis {
  id: string
  date: string // ISO 8601
  photoUri: string
  suggestions: string[]
  renderingUri?: string
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export type ThemeMode = 'dark' | 'light' | 'system'

export interface AppSettings {
  theme: ThemeMode
  openRouterModel: string
  replicateModel: string
  amazonConfigured: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  openRouterModel: 'anthropic/claude-3.5-haiku',
  replicateModel: 'black-forest-labs/flux-1.1-pro',
  amazonConfigured: false,
}

export const OPENROUTER_MODELS = [
  { id: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash (Default)' },
  { id: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku' },
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
]

export const REPLICATE_MODELS = [
  { id: 'black-forest-labs/flux-1.1-pro', label: 'Flux 1.1 Pro (Default)' },
]

// ─── AI Response shapes ───────────────────────────────────────────────────────

export interface SpaceAnalysisResponse {
  score: number
  breakdownMetrics: BreakdownMetric[]
  strengths: string[]
  weaknesses: string[]
  estimatedMinutes: number
  resetSteps: string[]
  productCategories: string[]
}

export interface StagingAnalysisResponse {
  suggestions: string[]
  stagingContext: string
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type TabRoute = 'spaces' | 'staging' | 'settings'
