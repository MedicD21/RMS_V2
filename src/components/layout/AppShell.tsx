import { Outlet, useLocation } from 'react-router-dom'
import { BottomTabBar } from '@/components/ui/BottomTabBar'

// Tab root paths — hide tab bar on deep screens
const TAB_ROOTS = ['/spaces', '/staging', '/settings']

export function AppShell() {
  const { pathname } = useLocation()
  const showTabBar = TAB_ROOTS.some(r => pathname.startsWith(r))

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: 'var(--bg)' }}
    >
      {/* Main content area */}
      <main className="flex-1 overflow-hidden relative">
        <Outlet />
      </main>

      {/* Bottom tab bar */}
      {showTabBar && <BottomTabBar />}
    </div>
  )
}
