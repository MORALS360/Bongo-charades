import { RotateDevicePrompt } from '../components/gameplay/RotateDevicePrompt'
import { useCalibration, type CalibrationResult } from '../hooks/useCalibration'
import { useIsPortraitPhone } from '../hooks/useIsPortraitPhone'

interface CalibrationPageProps {
  onCalibrated: (result: CalibrationResult) => void
}

/**
 * Calibration stage — between "I'm Ready" and the 3-2-1 countdown.
 *
 * The player has just lifted the phone to their forehead. We wait until it's held
 * still, record that angle as their personal "neutral", then start the countdown.
 * Usually this takes about a second. The screen faces the friends, so it stays
 * simple: a calm pulsing ring and "Hold still…".
 */
export function CalibrationPage({ onCalibrated }: CalibrationPageProps) {
  const isPortraitPhone = useIsPortraitPhone()
  useCalibration(!isPortraitPhone, onCalibrated)

  if (isPortraitPhone) return <RotateDevicePrompt />

  return (
    <div className="calibration-stage" role="status" aria-live="polite">
      <div className="calibration-ring" aria-hidden="true">
        <div className="calibration-ring__dot" />
      </div>
      <h1 className="d calibration-stage__title">Hold still…</h1>
    </div>
  )
}
