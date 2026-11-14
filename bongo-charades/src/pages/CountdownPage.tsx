import { RotateDevicePrompt } from '../components/gameplay/RotateDevicePrompt'
import { useCountdown } from '../hooks/useCountdown'
import { useIsPortraitPhone } from '../hooks/useIsPortraitPhone'

interface CountdownPageProps {
  onCountdownComplete: () => void
  soundEnabled?: boolean
}

/**
 * Bongo Charades — Countdown (Artboard 8 / PDF Page 8, minimal).
 *
 * Deliberately shows ONLY the big golden 3 → 2 → 1 → GO! circle. All instructions
 * live on the Get Ready screen, and calibration finishes before this starts.
 *
 * If a phone is held in portrait, the countdown waits behind the "turn your phone"
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
    <div className="countdown-stage" data-testid="countdown">
      <div className="countdown-circle" aria-live="assertive">
        <span className="d" style={{ fontSize: step === 'GO!' ? 104 : 170, lineHeight: 1 }}>
          {step}
        </span>
      </div>
    </div>
  )
}
