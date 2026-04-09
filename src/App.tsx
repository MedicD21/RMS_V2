import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { useTheme } from '@/hooks/useTheme'

// Screens
import { SpacesListScreen } from '@/screens/spaces/SpacesListScreen'
import { AddSpaceScreen } from '@/screens/spaces/AddSpaceScreen'
import { SpaceDetailScreen } from '@/screens/spaces/SpaceDetailScreen'
import { ScanScreen } from '@/screens/spaces/ScanScreen'
import { CompareScansScreen } from '@/screens/spaces/CompareScansScreen'
import { StagingHomeScreen } from '@/screens/staging/StagingHomeScreen'
import { StagingAnalysisScreen } from '@/screens/staging/StagingAnalysisScreen'
import { StagingHistoryScreen } from '@/screens/staging/StagingHistoryScreen'
import { SettingsScreen } from '@/screens/settings/SettingsScreen'

function ThemeWatcher() {
  useTheme()
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeWatcher />
      <Routes>
        <Route element={<AppShell />}>
          {/* Default redirect */}
          <Route index element={<Navigate to="/spaces" replace />} />

          {/* Spaces */}
          <Route path="/spaces" element={<SpacesListScreen />} />
          <Route path="/spaces/new" element={<AddSpaceScreen />} />
          <Route path="/spaces/:spaceId" element={<SpaceDetailScreen />} />
          <Route path="/spaces/:spaceId/scan" element={<ScanScreen />} />
          <Route path="/spaces/:spaceId/compare" element={<CompareScansScreen />} />

          {/* Staging */}
          <Route path="/staging" element={<StagingHomeScreen />} />
          <Route path="/staging/analyze" element={<StagingAnalysisScreen />} />
          <Route path="/staging/history" element={<StagingHistoryScreen />} />

          {/* Settings */}
          <Route path="/settings" element={<SettingsScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
