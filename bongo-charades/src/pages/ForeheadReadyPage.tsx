import { ForeheadPositioningSvg } from '../components/illustrations/CategoryIcon'
import { FeedbackIcon } from '../components/gameplay/FeedbackIcon'
import { RotateDevicePrompt } from '../components/gameplay/RotateDevicePrompt'
import { useIsPortraitPhone } from '../hooks/useIsPortraitPhone'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'

interface ForeheadReadyPageProps {
  isQuickPlay?: boolean
  backLabel?: string
  currentTeamName: string
  currentTeamIndex: number
  totalTeams: number
  onReady: () => void
  onBackToSetup: () => void
  onBackToHome: () => void
}

/**
 * Bongo Charades — Get Ready screen (Artboard 7 / PDF Page 7, refined).
 *
 * This is where players learn everything they need, because the countdown and the
 * prompt screen stay instruction-free:
 *   1. Hold the phone sideways on your forehead, screen facing friends.
 *   2. Tilt DOWN = Correct (green) · Tilt UP = Pass (red).
 *   3. Hold still after tapping Ready (we calibrate your neutral position).
 *
 * Teams mode shows whose turn it is (plain text, no badge). Quick Play shows nothing
 * extra. "I'm Ready" requests motion permission (iPhone) and starts calibration.
 */
export function ForeheadReadyPage({
  currentTeamName,
  currentTeamIndex,
  totalTeams,
  onReady,
  onBackToSetup,
  onBackToHome,
  isQuickPlay = false,
  backLabel = 'Setup',
}: ForeheadReadyPageProps) {
  // Gameplay is landscape-only: on a phone held upright, wait here until it's turned.
  const isPortraitPhone = useIsPortraitPhone()
  if (isPortraitPhone) {
    return (
      <RotateDevicePrompt message="Turn your phone sideways to start. You'll hold it on your forehead, screen facing your friends." />
    )
  }

  return (
    <div className="ready-stage">
      <div className="ready-stage__art">
        <ForeheadPositioningSvg width={290} height={196} />
      </div>

      <div className="ready-stage__content">
        {!isQuickPlay && (
          <p className="ready-stage__turn">
            Team {currentTeamIndex + 1} of {totalTeams} · {currentTeamName}
          </p>
        )}

        <h1 className="d ready-stage__title">Get ready!</h1>

        <p className="ready-stage__lead">
          Hold your phone sideways on your forehead, screen facing your friends.
        </p>

        <div className="ready-stage__controls">
          <div className="control-chip control-chip--correct">
            <FeedbackIcon kind="correct" size={30} />
            <span>
              <b>Tilt down</b> = Correct
            </span>
          </div>
          <div className="control-chip control-chip--pass">
            <FeedbackIcon kind="pass" size={30} />
            <span>
              <b>Tilt up</b> = Pass
            </span>
          </div>
        </div>

        <p className="ready-stage__hint">Tap Ready, then hold still for a moment.</p>

        <PrimaryButton size="lg" onClick={onReady} style={{ minHeight: 54, fontSize: 20 }}>
          I'm Ready
        </PrimaryButton>

        <div style={{ display: 'flex', gap: 8 }}>
          <SecondaryButton onClick={onBackToSetup} style={{ minHeight: 40, fontSize: 14, flex: 1 }}>
            ← Back to {backLabel}
          </SecondaryButton>
          <SecondaryButton onClick={onBackToHome} style={{ minHeight: 40, fontSize: 14, flex: 1 }}>
            Home
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}
