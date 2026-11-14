/**
 * White Correct (check mark) and Pass (skip arrow) icons in a soft white ring.
 * Used on the instruction tiles and the full-screen answer feedback.
 */
export function FeedbackIcon({ kind, size = 120 }: { kind: 'correct' | 'pass'; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="60" cy="60" r="54" fill="rgba(255,255,255,0.18)" stroke="#FFFFFF" strokeWidth="8" />
      {kind === 'correct' ? (
        <path
          d="M34 62 L52 80 L87 42"
          stroke="#FFFFFF"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <g stroke="#FFFFFF" strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 40 L60 60 L40 80" />
          <path d="M62 40 L82 60 L62 80" />
        </g>
      )}
    </svg>
  )
}
