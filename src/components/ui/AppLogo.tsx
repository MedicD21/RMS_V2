interface AppLogoProps {
  size?: number
  color?: string
}

/**
 * SVG version of the RMS app icon — house with circular reset arrows.
 * Background-free so it works on any surface in both themes.
 */
export function AppLogo({ size = 36, color = 'currentColor' }: AppLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-label="Reset My Space"
    >
      {/* House outline */}
      <path
        d="M50 10 L88 42 L88 86 H62 V64 H38 V86 H12 L12 42 Z"
        stroke={color}
        strokeWidth="5.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Circular reset arrows (top arc — right side) */}
      <path
        d="M36 54 A16 16 0 0 1 64 54"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrow head top-right */}
      <path
        d="M64 44 L64 54 L54 54"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Circular reset arrows (bottom arc — left side) */}
      <path
        d="M64 62 A16 16 0 0 1 36 62"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrow head bottom-left */}
      <path
        d="M36 72 L36 62 L46 62"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Amber accent — chimney / top-right detail */}
      <rect
        x="63"
        y="22"
        width="11"
        height="11"
        rx="2.5"
        fill="var(--accent)"
      />
    </svg>
  )
}
