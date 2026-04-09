import { useState, useRef } from 'react'

interface BeforeAfterToggleProps {
  beforeUri: string
  afterUri: string
  beforeLabel?: string
  afterLabel?: string
}

export function BeforeAfterToggle({
  beforeUri,
  afterUri,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: BeforeAfterToggleProps) {
  const [showAfter, setShowAfter] = useState(true)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    setDragging(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragging) return
    const dx = e.changedTouches[0].clientX - startX.current
    if (Math.abs(dx) > 40) {
      setShowAfter(dx < 0) // swipe left → after, swipe right → before
    }
    setDragging(false)
  }

  return (
    <div className="rounded-2xl overflow-hidden relative" style={{ background: 'var(--surface)' }}>
      {/* Image */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full"
        style={{ aspectRatio: '4/3' }}
      >
        <img
          src={beforeUri}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: showAfter ? 0 : 1 }}
        />
        <img
          src={afterUri}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: showAfter ? 1 : 0 }}
        />

        {/* Swipe hint */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-full"
          style={{
            background: 'rgba(0,0,0,0.45)',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          swipe to compare
        </div>
      </div>

      {/* Toggle pills */}
      <div
        className="flex p-1 gap-1 rounded-xl mx-4 my-3"
        style={{ background: 'var(--bg)' }}
      >
        {[
          { label: beforeLabel, active: !showAfter, onClick: () => setShowAfter(false) },
          { label: afterLabel, active: showAfter, onClick: () => setShowAfter(true) },
        ].map(({ label, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
