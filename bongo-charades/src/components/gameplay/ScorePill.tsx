interface ScorePillProps {
  score: number
  label?: string
}

/**
 * Top-right score HUD pill (Artboard 9 — Gameplay).
 */
export function ScorePill({ score, label = 'Score' }: ScorePillProps) {
  return (
    <div className="hud-pill" aria-live="polite">
      <span className="d" style={{ fontSize: 34, lineHeight: '38px' }}>
        {label} {score}
      </span>
    </div>
  )
}
