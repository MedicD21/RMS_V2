import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#1B2F3A',
          surface: '#243D4A',
          accent: '#E8953A',
          'accent-dark': '#D4822A',
          'text-secondary': '#8FAAB8',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
