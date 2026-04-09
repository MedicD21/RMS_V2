import { getScoreColor } from '@/types'

interface ScoreRingProps {
  score: number
  size?: 'compact' | 'large'
  animated?: boolean
}

const SIZES = {
  compact: { px: 56, r: 22, stroke: 4, fontSize: 13, fontWeight: 700 },
  large:   { px: 148, r: 58, stroke: 8, fontSize: 32, fontWeight: 800 },
}

const COLOR_MAP = {
  low:  'var(--score-low)',
  mid:  'var(--score-mid)',
  high: 'var(--score-high)',
}

export function ScoreRing({ score, size = 'compact', animated = true }: ScoreRingProps) {
  const { px, r, stroke, fontSize, fontWeight } = SIZES[size]
  const center = px / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - Math.min(score, 100) / 100)
  const color = COLOR_MAP[getScoreColor(score)]

  return (
    <svg
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      aria-label={`Score: ${score} out of 100`}
    >
      {/* Track */}
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth={stroke}
      />
      {/* Fill */}
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
        style={
          animated
            ? {
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }
            : undefined
        }
      />
      {/* Label */}
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontFamily="Inter, sans-serif"
      >
        {score}
      </text>
    </svg>
  )
}
