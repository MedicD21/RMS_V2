import { useEffect, useState } from 'react'
import { useSettingsStore } from '@/store/settingsStore'

function resolveTheme(theme: string): 'dark' | 'light' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme as 'dark' | 'light'
}

export function useTheme(): 'dark' | 'light' {
  const theme = useSettingsStore((s) => s.theme)
  const [resolved, setResolved] = useState<'dark' | 'light'>(() => resolveTheme(theme))

  useEffect(() => {
    const next = resolveTheme(theme)
    setResolved(next)
    const root = document.documentElement
    root.setAttribute('data-theme', next)
    root.classList.toggle('dark', next === 'dark')
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const next = e.matches ? 'dark' : 'light'
      setResolved(next)
      document.documentElement.setAttribute('data-theme', next)
      document.documentElement.classList.toggle('dark', e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  return resolved
}
