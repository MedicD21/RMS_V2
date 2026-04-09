import { getScoreColor } from '@/types'

interface MetricBarProps {
  label: string
  score: number
}

const COLOR_MAP = {
  low:  'var(--score-low)',
  mid:  'var(--score-mid)',
  high: 'var(--score-high)',
}

const BG_MAP = {
  low:  'var(--score-low-bg)',
  mid:  'var(--score-mid-bg)',
  high: 'var(--score-high-bg)',
}

export function MetricBar({ label, score }: MetricBarProps) {
  const colorKey = getScoreColor(score)
  const color = COLOR_MAP[colorKey]
  const bg = BG_MAP[colorKey]

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </span>
        <span className="text-sm font-bold" style={{ color }}>
          {score}
        </span>
      </div>
      <div
        className="h-2 w-full rounded-full overflow-hidden"
        style={{ background: 'var(--border)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${score}%`,
            background: color,
            boxShadow: `0 0 6px ${bg}`,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  )
}
