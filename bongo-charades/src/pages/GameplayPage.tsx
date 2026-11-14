import { useCallback, useEffect, useRef, useState } from 'react'
import type { Category, GamePrompt, GameplayAction, TiltSensitivity } from '../types'
import { TimerPill } from '../components/gameplay/TimerPill'
import { FeedbackIcon } from '../components/gameplay/FeedbackIcon'
import { RotateDevicePrompt } from '../components/gameplay/RotateDevicePrompt'
import { useGameTimer } from '../hooks/useGameTimer'
import { useTiltControls } from '../hooks/useTiltControls'
import { useIsPortraitPhone } from '../hooks/useIsPortraitPhone'
import { playCorrectSound, playPassSound } from '../services/soundEffects'
import { FEEDBACK_MS, SENSOR_GRACE_MS } from '../config/gameplay'

interface GameplayPageProps {
  currentPrompt: GamePrompt
  currentCategory?: Category
  roundDurationSeconds: number
  onAnswer: (action: GameplayAction, prompt: GamePrompt) => void
  onRoundTimeUp: () => void
  /** Player's calibrated neutral tilt angle (degrees); 0 = upright */
  tiltBaseline?: number
  soundEnabled?: boolean
  tiltSensitivity?: TiltSensitivity
}

function getPromptFontSize(text: string): { fontSize: number; lineHeight: string } {
  const len = text.length
  if (len <= 14) return { fontSize: 88, lineHeight: '92px' }
  if (len <= 22) return { fontSize: 68, lineHeight: '72px' }
  if (len <= 32) return { fontSize: 52, lineHeight: '56px' }
  return { fontSize: 40, lineHeight: '44px' }
}

/**
 * Bongo Charades — Active Gameplay Screen (Artboard 9 / PDF Page 9, refined).
 *
 * The prompt screen is deliberately clean: timer, category label and the prompt.
 * The tilt instructions are shown on the countdown stage instead.
 *
 * Answer flow (same for Quick Play and Teams):
 *   tilt / tap → score once → FULL-SCREEN green (Correct) or red (Pass) for FEEDBACK_MS
 *   (src/config/gameplay.ts, currently 450 ms),
 *   with the next prompt hidden → next prompt appears.
 *
 * Fallback controls: if the phone sends no motion data (desktop, motion permission
 * denied, unsupported browser), small Pass / Correct buttons appear in the bottom
 * corners. Keyboard: ↓ / Enter = Correct, ↑ = Pass.
 *
 * Turning the phone to portrait pauses the round behind a "turn your phone" screen.
 */
export function GameplayPage({
  currentPrompt,
  currentCategory,
  roundDurationSeconds,
  onAnswer,
  onRoundTimeUp,
  tiltBaseline = 0,
  soundEnabled = true,
  tiltSensitivity = 'medium',
}: GameplayPageProps) {
  const isPortraitPhone = useIsPortraitPhone()
  const [feedback, setFeedback] = useState<GameplayAction | null>(null)
  const feedbackActiveRef = useRef(false)
  const feedbackTimerRef = useRef<number | null>(null)

  const { secondsRemaining, isTimeUp, hasExpired } = useGameTimer({
    durationSeconds: roundDurationSeconds,
    active: true,
    paused: isPortraitPhone,
    onTimeUp: onRoundTimeUp,
    soundEnabled,
  })

  useEffect(
    () => () => {
      if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current)
    },
    [],
  )

  const handleAction = useCallback(
    (action: GameplayAction) => {
      // Ignore input after time is up, while feedback is showing, or while paused
      if (hasExpired() || feedbackActiveRef.current || isPortraitPhone) return

      feedbackActiveRef.current = true
      setFeedback(action)
      if (soundEnabled) {
        if (action === 'correct') playCorrectSound()
        else playPassSound()
      }

      // Score immediately (exactly once — the game session also rejects repeats)
      onAnswer(action, currentPrompt)

      feedbackTimerRef.current = window.setTimeout(() => {
        feedbackActiveRef.current = false
        setFeedback(null)
      }, FEEDBACK_MS)
    },
    [hasExpired, isPortraitPhone, soundEnabled, onAnswer, currentPrompt],
  )

  const { sensorActive } = useTiltControls({
    enabled: !isTimeUp && !isPortraitPhone,
    onAction: handleAction,
    baseline: tiltBaseline,
    sensitivity: tiltSensitivity,
  })

  // Show manual buttons only if no motion data arrives
  const [graceOver, setGraceOver] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setGraceOver(true), SENSOR_GRACE_MS)
    return () => window.clearTimeout(t)
  }, [])
  const showManualControls = graceOver && !sensorActive

  // Keyboard controls (accessibility / desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault()
        handleAction('correct')
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        handleAction('pass')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleAction])

  if (isPortraitPhone) {
    return <RotateDevicePrompt message="Round paused. Turn your phone sideways to keep playing." />
  }

  if (feedback) {
    return (
      <div
        className={`answer-feedback answer-feedback--${feedback}`}
        role="status"
        aria-live="assertive"
      >
        <FeedbackIcon kind={feedback} size={128} />
        <span className="d answer-feedback__word">{feedback === 'correct' ? 'Correct' : 'Pass'}</span>
      </div>
    )
  }

  const fontStyle = getPromptFontSize(currentPrompt.text)

  return (
    <div className="gameplay-stage">
      <div style={{ position: 'absolute', left: 20, top: 14, zIndex: 10 }}>
        <TimerPill secondsRemaining={secondsRemaining} />
      </div>

      <div className="gameplay-stage__prompt" aria-live="polite">
        <span className="gameplay-stage__category">
          {currentCategory ? currentCategory.name : 'All Categories'}
        </span>
        <h1
          className="d"
          style={{
            fontSize: fontStyle.fontSize,
            lineHeight: fontStyle.lineHeight,
            margin: 0,
            wordBreak: 'break-word',
            textShadow: '0 4px 16px rgba(30, 15, 90, 0.4)',
          }}
        >
          {currentPrompt.text}
        </h1>
        {currentPrompt.hint && <span className="gameplay-stage__hint">{currentPrompt.hint}</span>}
      </div>

      {showManualControls && (
        <>
          <button
            type="button"
            className="manual-answer manual-answer--pass"
            onClick={() => handleAction('pass')}
            aria-label="Pass"
          >
            Pass
          </button>
          <button
            type="button"
            className="manual-answer manual-answer--correct"
            onClick={() => handleAction('correct')}
            aria-label="Correct"
          >
            Correct
          </button>
        </>
      )}
    </div>
  )
}
