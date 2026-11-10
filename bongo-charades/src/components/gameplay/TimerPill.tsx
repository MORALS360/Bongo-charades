interface TimerPillProps {
  /** Remaining time in seconds (e.g. 42 -> "0:42") */
  secondsRemaining: number
}

function formatMinutesSeconds(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds))
  const mins = Math.floor(clamped / 60)
  const secs = clamped % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Top-left countdown timer HUD pill (Artboard 9 — Gameplay).
 */
export function TimerPill({ secondsRemaining }: TimerPillProps) {
  return (
    <div className="hud-pill" aria-live="polite" aria-label="Time remaining">
      <span className="d" style={{ fontSize: 34, lineHeight: '38px' }}>
        {formatMinutesSeconds(secondsRemaining)}
      </span>
    </div>
  )
}
