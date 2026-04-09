# Reset My Space — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the complete Reset My Space mobile app (React + Vite + Capacitor).

**Architecture:** Three-tab bottom navigation (Spaces, Staging, Settings). Vite + React + TypeScript + Capacitor 6. Zustand with persist for state. Clean service interfaces for storage/AI/Amazon.

**Tech Stack:** React 19, Vite 6, TypeScript 5, Capacitor 6, Zustand 5, React Router 6, Tailwind CSS 3, Vitest, OpenRouter API, Replicate API, Amazon PA API 5.0

---

- [ ] Task 1: Scaffold project (Vite + React + TS + Tailwind + Vitest + Capacitor)
- [ ] Task 2: Design tokens, global styles, theme system (dark/light)
- [ ] Task 3: TypeScript types + service interfaces
- [ ] Task 4: LocalStorageAdapter + Zustand stores
- [ ] Task 5: Core UI components (ScoreRing, MetricBar, BottomTabBar, LoadingRing, BeforeAfterToggle, ProductCard)
- [ ] Task 6: Navigation shell (AppShell + React Router + tabs)
- [ ] Task 7: Camera hook (useCamera wrapping Capacitor)
- [ ] Task 8: AI Service (OpenRouter — analysis + staging prompts)
- [ ] Task 9: Image Gen Service (Replicate)
- [ ] Task 10: Amazon Service (MockAdapter + PaApiAdapter stub)
- [ ] Task 11: Spaces — List screen + Add Space screen
- [ ] Task 12: Spaces — Camera/Upload → Analysis flow + results
- [ ] Task 13: Spaces — Space Detail screen
- [ ] Task 14: Spaces — Compare Scans screen
- [ ] Task 15: Staging — Home + Analysis flow + History
- [ ] Task 16: Settings screen + theme wiring
- [ ] Task 17: Capacitor config + build scripts
