import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.resetmyspace.app',
  appName: 'Reset My Space',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1B2F3A',
    },
  },
}

export default config
