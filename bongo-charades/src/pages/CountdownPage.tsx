import { RotateDevicePrompt } from '../components/gameplay/RotateDevicePrompt'
import { FeedbackIcon } from '../components/gameplay/FeedbackIcon'
import { useCountdown, type CountdownStep } from '../hooks/useCountdown'
import { useIsPortraitPhone } from '../hooks/useIsPortraitPhone'

interface CountdownPageProps {
  onCountdownComplete: () => void
  soundEnabled?: boolean
}

const STEPS: CountdownStep[] = [3, 2, 1, 'GO!']

/**
 * Bongo Charades — Instructions + Countdown stage (Artboard 8 / PDF Page 8, extended).
 *
 * Shown right before every round. While the 3-2-1-GO! countdown runs, the screen
 * explains the controls in big, colour-coded tiles that match the feedback colours
 * used during play (green = Correct, red = Pass). Once the round starts the
 * instructions are gone, so the gameplay screen can stay clean.
 *
 * If a phone is held in portrait, the countdown waits behind a "turn your phone"
 * screen and restarts from 3 once the phone is sideways.
 */
export function CountdownPage({ onCountdownComplete, soundEnabled = true }: CountdownPageProps) {
  const isPortraitPhone = useIsPortraitPhone()
  if (isPortraitPhone) return <RotateDevicePrompt />
  return <CountdownStage onCountdownComplete={onCountdownComplete} soundEnabled={soundEnabled} />
}

function CountdownStage({ onCountdownComplete, soundEnabled }: Required<CountdownPageProps>) {
  const { step } = useCountdown({
    active: true,
    onComplete: onCountdownComplete,
    soundEnabled,
  })

  return (
    <div className="countdown-stage">
      {/* Golden radial countdown circle */}
      <div className="countdown-circle" aria-live="assertive">
        <span className="d" style={{ fontSize: step === 'GO!' ? 92 : 150, lineHeight: 1 }}>
          {step}
        </span>
      </div>

      <div className="countdown-instructions">
        <b className="countdown-instructions__label">How to answer</b>

        <div className="instruction-tile instruction-tile--correct">
          <FeedbackIcon kind="correct" size={44} />
          <div>
            <span className="instruction-tile__gesture">↓ Tilt down</span>
            <span className="d instruction-tile__word">Correct</span>
          </div>
        </div>

        <div className="instruction-tile instruction-tile--pass">
          <FeedbackIcon kind="pass" size={44} />
          <div>
            <span className="instruction-tile__gesture">↑ Tilt up</span>
            <span className="d instruction-tile__word">Pass</span>
          </div>
        </div>

        <div className="countdown-steps" aria-hidden="true">
          {STEPS.map((s) => (
            <span
              key={String(s)}
              className={`d countdown-step ${s === step ? 'countdown-step--active' : ''}`.trim()}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
