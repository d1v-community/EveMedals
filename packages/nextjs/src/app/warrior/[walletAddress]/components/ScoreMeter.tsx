interface ScoreMeterProps {
  score: number
  maxScore?: number
}

// Draws a semi-circle arc gauge (top half) using SVG
export default function ScoreMeter({ score, maxScore = 10000 }: ScoreMeterProps) {
  const pct = Math.min(1, Math.max(0, score / maxScore))
  const radius = 80
  const cx = 100
  const cy = 100
  const circumference = Math.PI * radius // half circle
  const offset = circumference * (1 - pct)

  // Color interpolation: steel → amber → martian → crimson
  const getColor = (p: number) => {
    if (p < 0.3) return '#8ea1ad'
    if (p < 0.55) return '#d9a441'
    if (p < 0.8) return '#f0642f'
    return '#e63946'
  }

  const color = getColor(pct)

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 200 110"
        width="220"
        height="120"
        aria-label={`Combat score ${score} out of ${maxScore}`}
      >
        {/* Track */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${offset}`}
          style={{ transition: 'stroke-dashoffset 1.2s ease, stroke 0.6s ease' }}
        />
        {/* Center score */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize="28"
          fontWeight="700"
          fill={color}
          fontFamily="var(--sds-font-mono)"
          style={{ transition: 'fill 0.6s ease' }}
        >
          {score.toLocaleString()}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fontSize="9"
          fill="rgba(255,255,255,0.45)"
          fontFamily="var(--sds-font-mono)"
          letterSpacing="2"
        >
          / {maxScore.toLocaleString()}
        </text>
        {/* Min / Max labels */}
        <text x={cx - radius + 2} y={cy + 20} fontSize="8" fill="rgba(255,255,255,0.3)" fontFamily="var(--sds-font-mono)">0</text>
        <text x={cx + radius - 28} y={cy + 20} fontSize="8" fill="rgba(255,255,255,0.3)" fontFamily="var(--sds-font-mono)">10000</text>
      </svg>
      <p
        className="text-xs uppercase tracking-widest"
        style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--sds-font-mono)' }}
      >
        Combat Score
      </p>
    </div>
  )
}
