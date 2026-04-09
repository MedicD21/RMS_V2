import { useEffect, useState } from 'react'

const MESSAGES = [
  'Reviewing your space…',
  'Analyzing organization…',
  'Identifying opportunities…',
  'Curating suggestions…',
  'Almost there…',
]

const STAGING_MESSAGES = [
  'Reviewing your space…',
  'Thinking like a stager…',
  'Finding the best angles…',
  'Crafting suggestions…',
  'Almost there…',
]

const RENDER_MESSAGES = [
  'Imagining the possibilities…',
  'Rendering your optimized space…',
  'Bringing it to life…',
  'Almost ready…',
]

interface LoadingRingProps {
  mode?: 'analysis' | 'staging' | 'render'
}

export function LoadingRing({ mode = 'analysis' }: LoadingRingProps) {
  const [msgIdx, setMsgIdx] = useState(0)

  const messages =
    mode === 'staging'
      ? STAGING_MESSAGES
      : mode === 'render'
      ? RENDER_MESSAGES
      : MESSAGES

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx((i) => (i + 1) % messages.length)
    }, 2200)
    return () => clearInterval(id)
  }, [messages.length])

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      {/* Spinning ring */}
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40" cy="40" r="34"
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
          />
          <circle
            cx="40" cy="40" r="34"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="213.6"
            strokeDashoffset="150"
            style={{
              animation: 'spin 1.4s linear infinite',
              transformOrigin: '40px 40px',
            }}
          />
        </svg>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {/* Cycling message */}
      <p
        className="text-base font-medium text-center transition-opacity duration-500"
        style={{ color: 'var(--text-secondary)' }}
      >
        {messages[msgIdx]}
      </p>
    </div>
  )
}
