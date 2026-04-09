# Reset My Space — Design Spec
**Date:** 2026-04-09  
**Status:** Approved

---

## Overview

Reset My Space (RMS) is a mobile app (iOS + Android) built with React + Vite + Capacitor. It helps users analyze, improve, and track the organization of their spaces, and separately helps home sellers stage rooms for property showings. The app uses AI vision analysis, AI image generation, and Amazon affiliate product recommendations.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Vite + React 19 + TypeScript | Modern, fast, native Capacitor support |
| Native shell | Capacitor 6 | Real App Store distribution, native camera API |
| State | Zustand + persist middleware | Lightweight, localStorage today, Supabase-ready |
| Routing | React Router v6 | Screen navigation within tabs |
| Styling | Tailwind CSS + CSS custom properties | Full design control, theme system |
| Vision AI | OpenRouter API | Flexible model selection, room analysis |
| Image gen | Replicate API | Flux model for room rendering |
| Products | Amazon PA API 5.0 | Affiliate tag: Reasonhome-20 |
| Storage | LocalStorage (V1) → Supabase/Neon (future) | Clean adapter interface |
| Auth | None (V1) → to be added with cloud storage | Zero friction for V1 |

**Capacitor plugins:**
- `@capacitor/camera` — take photo or pick from library
- `@capacitor/filesystem` — store photos locally on device
- `@capacitor/haptics` — tactile feedback on interactions
- `@capacitor/status-bar` — status bar styling per theme

---

## Navigation Structure

Bottom tab bar — three tabs, always visible:

```
[ Spaces ]   [ Staging ]   [ Settings ]
```

No summary text or hero copy on any tab home screen. Each tab maintains its own navigation stack independently.

### Spaces Tab Stack
```
Spaces List
  ├── New Space → Camera/Upload → Analysis Results
  ├── Space Detail
  │     ├── New Scan → Camera/Upload → Analysis Results
  │     └── Compare Scans
```

### Staging Tab Stack
```
Staging Home
  └── Camera/Upload → Analysis Results → Rendered Preview
  └── Staging History (secondary)
```

### Settings Tab
```
Settings (single screen)
```

---

## Design System

### Color Palette (derived from app icon)

| Token | Dark Mode | Light Mode |
|---|---|---|
| Background | `#1B2F3A` | `#F4F6F7` |
| Surface (cards) | `#243D4A` | `#FFFFFF` |
| Primary accent | `#E8953A` (amber) | `#D4822A` |
| Text primary | `#FFFFFF` | `#1B2F3A` |
| Text secondary | `#8FAAB8` | `#5A7A8A` |
| Score — low (0–40) | `#E85454` (red) | `#D43A3A` |
| Score — mid (41–70) | `#E8953A` (amber) | `#D4822A` |
| Score — high (71–100) | `#4CAF82` (green) | `#3A9E6E` |
| Destructive | `#E85454` | `#D43A3A` |

### Typography
- **Font:** Inter (Google Fonts)
- Headlines: Bold (700)
- Body: Regular (400)
- Score display: Extra Bold (800), large display size
- Bullets and labels: Medium (500)

### Score Ring Component
- Circular SVG progress ring, 0–100 fill
- Color shifts dynamically: red → amber → green based on score value
- Two sizes: **compact** (~48px, Spaces List) and **large** (~140px, Space Detail)
- Animated fill on load

### Breakdown Metric Bar Component
- Labeled horizontal filled bar
- Same red/amber/green color logic as ring
- Used in Space Detail and Compare screens

### Theme
- Dark / Light / System — controlled via CSS custom properties
- Persisted in localStorage via Zustand settings store
- Applied at root element via `data-theme` attribute

### AI Tone
Warm, encouraging, but direct and honest — like a professional interior designer. Not overly effusive. Will name specific problems clearly. Uses "you" and "your space" naturally.

---

## Feature: Spaces

### Spaces List Screen
- Grid or card list of all saved Spaces
- Each card: compact Ring Score + Space name + room type label + last scan date
- Empty state: minimal illustration + "Add your first Space" CTA
- Floating action button (amber, bottom right): "+" → Add Space flow
- No summary text on this screen

### Add Space Flow
1. Name the space (text input)
2. Select room type (Bedroom, Kitchen, Living Room, Office, Bathroom, Garage, Other)
3. Proceeds to Camera/Upload → Analysis

### Camera / Upload Screen (shared component)
- Two options: "Take Photo" (Capacitor Camera) or "Choose from Library"
- Preview of selected photo with "Use this photo" confirm and "Retake" option

### AI Analysis Flow (Spaces)
1. Photo sent to OpenRouter vision model
2. Model returns structured JSON:
   - `score` (0–100 overall organizational score)
   - `breakdownMetrics` — array of `{ label, score }` (5 metrics: Clutter Level, Storage Efficiency, Accessibility, Visual Flow, Labeling)
   - `strengths` — array of strings (3–5 bullets)
   - `weaknesses` — array of strings (3–5 bullets)
   - `productCategories` — array of search terms for Amazon (e.g., "cable management box", "under-bed storage bins")
3. Amazon PA API queried with each product category
4. Top 2–3 products per category returned, shown in carousel
5. Replicate called with original photo + weaknesses context to generate optimized room rendering

### Space Detail Screen
- Large Ring Score (~140px) at top center — most recent scan score
- Scan photo thumbnail + scan date beneath ring
- Breakdown metrics as labeled filled bars (5 metrics)
- Strengths section: green dot bullets
- Weaknesses section: amber dot bullets
- Amazon product recommendations: horizontal scroll carousel
  - Each card: product image, name (truncated), price, "View on Amazon" button (affiliate link with `Reasonhome-20` tag)
- AI room rendering: full-width "after" image with swipeable before/after toggle (before = original scan photo, after = Replicate rendering)
- Two buttons (sticky bottom): **New Scan** | **Compare Scans**

### New Scan
- Triggers Camera/Upload → Analysis flow
- New scan appended to space's `scans[]` array
- Space Detail updates to show new most-recent scan

### Compare Scans Screen
- Two dropdowns at top: left scan date, right scan date
- Default: two most recent scans (left = older, right = newer)
- Side-by-side layout:
  - Ring scores (left vs right)
  - Score delta badge between rings (e.g., `+12 pts`)
  - Photo thumbnails above each column
  - Breakdown metric bars paired side-by-side for each metric

---

## Feature: Home Staging

### Staging Home Screen
- Headline: "Stage Your Space to Sell"
- Single prominent CTA: "Analyze a Room" (camera icon + amber button)
- One-liner: "Get expert staging suggestions and see your room transformed"
- Secondary link: "History" (text link, not prominent)

### AI Analysis Flow (Staging)
- Photo sent to OpenRouter vision model with staging-specific prompt
- Model returns:
  - `suggestions` — array of numbered actionable strings (5–8 items), interior designer tone
  - `stagingContext` — brief description of ideal staged version, used ephemerally for Replicate rendering prompt (not stored)
- No score — staging is qualitative only
- Loading state: animated ring + warm status messages ("Reviewing your space…", "Thinking like a stager…")

### Staging Results Screen
- Photo at top
- Numbered suggestion bullets (specific, actionable, honest)
- **Generate Preview** button → calls Replicate with photo + suggestions context
- Generated "after" image full-width below, swipeable before/after toggle

### Staging History
- List of past staging analyses: date + thumbnail
- Tap to revisit results (read-only, no re-analysis)
- Auto-saved immediately after suggestions are generated (rendering is optional and async — does not block save)

---

## Feature: Settings

| Setting | Type | Default |
|---|---|---|
| Appearance | Segmented: Dark / Light / System | System |
| AI Vision Model | Dropdown | `google/gemini-2.0-flash-001` |
| Image Gen Model | Dropdown | `black-forest-labs/flux-1.1-pro` |
| Amazon PA API Status | Indicator + setup link | Not configured |
| Clear All Data | Destructive button (confirmation modal) | — |
| About / Version | Info row | — |
| Affiliate Disclosure | Required by Amazon ToS | Always visible |

Available OpenRouter vision models (selectable):
- `google/gemini-2.0-flash-001` (default — fast, cost-efficient)
- `anthropic/claude-3.5-haiku`
- `openai/gpt-4o-mini`

---

## Data Models

```typescript
type RoomType = 
  | 'bedroom' | 'kitchen' | 'living_room' | 'office' 
  | 'bathroom' | 'garage' | 'other';

interface BreakdownMetric {
  label: string;   // e.g., "Clutter Level"
  score: number;   // 0–100
}

interface Product {
  asin: string;
  title: string;
  price: number;
  imageUrl: string;
  affiliateUrl: string;  // includes tag=Reasonhome-20
}

interface Scan {
  id: string;
  spaceId: string;
  date: string;           // ISO 8601
  photoUri: string;       // local filesystem path (Capacitor)
  score: number;          // 0–100
  breakdownMetrics: BreakdownMetric[];
  strengths: string[];
  weaknesses: string[];
  productSuggestions: Product[];
  renderingUri?: string;  // Replicate output, local path
}

interface Space {
  id: string;
  name: string;
  roomType: RoomType;
  createdAt: string;
  scans: Scan[];          // ordered oldest → newest
}

interface StagingAnalysis {
  id: string;
  date: string;
  photoUri: string;
  suggestions: string[];
  renderingUri?: string;
}

interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  openRouterModel: string;
  replicateModel: string;
  amazonConfigured: boolean;
}
```

---

## Service Layer

Each service is defined as a TypeScript interface. Adapters implement the interface. Swapping providers = swapping the adapter, zero UI changes.

```
StorageService (interface)
  └── LocalStorageAdapter          ← V1
  └── SupabaseAdapter              ← future
  └── NeonAdapter                  ← future

AIService
  └── OpenRouterAdapter            ← vision analysis + prompt engineering

ImageGenService
  └── ReplicateAdapter             ← Flux model room rendering

AmazonService (interface)
  └── PaApiAdapter                 ← Amazon PA API 5.0 (production)
  └── MockAmazonAdapter            ← hardcoded realistic data (development)
```

### Amazon Dev Strategy
During development, `MockAmazonAdapter` returns a curated set of realistic organizational products with real affiliate-linked Amazon URLs. Swapping to `PaApiAdapter` in production requires only changing the adapter instantiation — all UI code stays the same.

---

## OpenRouter Prompt Design

### Spaces Analysis Prompt (system)
> "You are a professional interior organizer and spatial efficiency expert. Analyze the provided room photo and return a JSON object with the following fields: score (0-100 integer representing overall organization), breakdownMetrics (array of objects with label and score for: Clutter Level, Storage Efficiency, Accessibility, Visual Flow, Labeling), strengths (3-5 specific bullet points), weaknesses (3-5 specific bullet points), productCategories (3-5 Amazon search terms for organizational products that would address the weaknesses). Be warm but direct and honest, like a professional designer who respects the client enough to tell them the truth."

### Staging Analysis Prompt (system)
> "You are a professional home stager with deep experience preparing properties for real estate showings and listing photography. Analyze the provided room photo and return a JSON object with: suggestions (5-8 numbered, specific, actionable staging recommendations), stagingContext (a brief description of the ideal staged version of this room, for use in image generation). Be warm but direct — a good stager tells the client exactly what needs to change, with kindness but without vagueness."

---

## Key Constraints & Decisions

- **No auth V1** — fully anonymous, all data local. Auth added alongside cloud storage migration.
- **Amazon PA API keys** — will be provided by user for production. MockAdapter used during development.
- **Photo storage** — photos saved to device filesystem via `@capacitor/filesystem`, URIs stored in Zustand/localStorage. On migration to cloud, photos move to Supabase Storage or similar.
- **Replicate calls are async** — UI shows loading state with animation. Results stored locally once returned.
- **Score ring color is dynamic** — computed from score value at render time, not stored.
- **No summary text on tab home screens** — per design decision, navigation is the primary affordance.
- **Affiliate disclosure** — always visible in Settings per Amazon Associates ToS requirement.
