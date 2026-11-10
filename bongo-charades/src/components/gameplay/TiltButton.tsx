import type { GameplayAction } from '../../types'

interface TiltButtonProps {
  action: GameplayAction
  onTrigger: (action: GameplayAction) => void
  showTiltHint?: boolean
  passLabel?: string
  correctLabel?: string
  tiltUpHint?: string
  tiltDownHint?: string
}

/**
 * Manual gameplay control & tilt hint button (Artboard 9 — Gameplay).
 *
 * Product Rule:
 * - Tilt UP = Pass (#F59A23 Orange, "Pass ↑ / Tilt up")
 * - Tilt DOWN = Correct (#14B8A6 Teal, "Correct ↓ / Tilt down")
 */
export function TiltButton({
  action,
  onTrigger,
  showTiltHint = true,
  passLabel = 'Pass ↑',
  correctLabel = 'Correct ↓',
  tiltUpHint = 'Tilt up',
  tiltDownHint = 'Tilt down',
}: TiltButtonProps) {
  const isPass = action === 'pass'
  const label = isPass ? passLabel : correctLabel
  const hint = isPass ? tiltUpHint : tiltDownHint

  return (
    <button
      type="button"
      className={`tilt-btn ${isPass ? 'tilt-btn--pass' : 'tilt-btn--correct'}`}
      onClick={() => onTrigger(action)}
    >
      <span>{label}</span>
      {showTiltHint && <span className="tilt-btn__sub">{hint}</span>}
    </button>
  )
}
