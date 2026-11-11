import { useCallback, useEffect, useState } from 'react'
import type { Category, GamePrompt, GameplayAction } from '../types'
import { TimerPill } from '../components/gameplay/TimerPill'
import { ScorePill } from '../components/gameplay/ScorePill'
import { TiltButton } from '../components/gameplay/TiltButton'
import { useGameTimer } from '../hooks/useGameTimer'
import { useTiltControls } from '../hooks/useTiltControls'
import { playCorrectSound, playPassSound } from '../services/soundEffects'

interface GameplayPageProps {
  currentPrompt: GamePrompt
  currentCategory?: Category
  currentTeamName: string
  currentScore: number
  roundDurationSeconds: number
  onAnswer: (action: GameplayAction, prompt: GamePrompt) => void
  onRoundTimeUp: () => void
  soundEnabled?: boolean
  showTiltHints?: boolean
  tiltSensitivity?: 'low' | 'medium' | 'high'
}

function getPromptFontSize(text: string): { fontSize: number; lineHeight: string } {
  const len = text.length
  if (len <= 14) return { fontSize: 84, lineHeight: '88px' }
  if (len <= 22) return { fontSize: 64, lineHeight: '68px' }
  if (len <= 32) return { fontSize: 48, lineHeight: '52px' }
  return { fontSize: 38, lineHeight: '42px' }
}

/**
 * Bongo Charades — Active Gameplay Screen (Artboard 9 / PDF Page 9).
 *
 * Designed exclusively for landscape forehead play:
 * - Top-left: TimerPill (countdown to 0:00)
 * - Top-right: ScorePill (live round score)
 * - Top-center: Team badge + Category name
 * - Center: Large responsive Baloo 2 prompt
 * - Bottom-left: Manual Pass fallback button
 * - Bottom-right: Manual Correct fallback button
 * - Brief visual flash feedback on answer (+1 green / PASS orange)
 * - Mobile portrait rotation prompt overlay
 */
export function GameplayPage({
  currentPrompt,
  currentCategory,
  currentTeamName,
  currentScore,
  roundDurationSeconds,
  onAnswer,
  onRoundTimeUp,
  soundEnabled = true,
  showTiltHints = true,
  tiltSensitivity = 'medium',
}: GameplayPageProps) {
  const [feedback, setFeedback] = useState<'correct' | 'pass' | null>(null)
  const [isPortraitWarning, setIsPortraitWarning] = useState<boolean>(false)

  // Countdown round timer
  const { secondsRemaining, isTimeUp } = useGameTimer({
    durationSeconds: roundDurationSeconds,
    active: true,
    onTimeUp: onRoundTimeUp,
    soundEnabled,
  })

  // Handle player answer (triggered by tilt or manual button)
  const handleAction = useCallback(
    (action: GameplayAction) => {
      // Guard: strictly ignore answers if time is up
      if (isTimeUp || secondsRemaining <= 0) {
        return
      }

      if (action === 'correct') {
        if (soundEnabled) playCorrectSound()
        setFeedback('correct')
      } else {
        if (soundEnabled) playPassSound()
        setFeedback('pass')
      }

      onAnswer(action, currentPrompt)

      // Dismiss feedback overlay after 350ms
      const timer = setTimeout(() => {
        setFeedback(null)
      }, 350)
      return () => clearTimeout(timer)
    },
    [isTimeUp, secondsRemaining, soundEnabled, onAnswer, currentPrompt],
  )

  // Physical motion / orientation controls hook
  useTiltControls({
    enabled: !isTimeUp && secondsRemaining > 0,
    onAction: handleAction,
    sensitivity: tiltSensitivity,
  })

  // Detect if on mobile device held in portrait orientation
  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window === 'undefined') return
      const isNarrowMobile = window.innerWidth < 640
      const isHeightGreater = window.innerHeight > window.innerWidth
      setIsPortraitWarning(isNarrowMobile && isHeightGreater)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)
    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  const fontStyle = getPromptFontSize(currentPrompt.text)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 844,
        height: '100%',
        minHeight: 360,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Visual Feedback Overlay (Green on Correct / Orange on Pass) */}
      {feedback && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              feedback === 'correct'
                ? 'rgba(20, 184, 166, 0.45)'
                : 'rgba(245, 154, 35, 0.45)',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            animation: 'flash-fade 0.35s ease-out forwards',
          }}
        >
          <span
            className="d"
            style={{
              fontSize: 72,
              color: '#fff',
              textShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            {feedback === 'correct' ? '✓ CORRECT +1' : 'PASS'}
          </span>
        </div>
      )}

      {/* Top Left: TimerPill */}
      <div style={{ position: 'absolute', left: 20, top: 14, zIndex: 10 }}>
        <TimerPill secondsRemaining={secondsRemaining} />
      </div>

      {/* Top Right: ScorePill */}
      <div style={{ position: 'absolute', right: 20, top: 14, zIndex: 10 }}>
        <ScorePill score={currentScore} />
      </div>

      {/* Top Center: Team Name & Category Title */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: '#FFC83A',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          🎯 {currentTeamName}
        </span>
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: '#FFFFFF',
            opacity: 0.9,
          }}
        >
          {currentCategory ? currentCategory.name : 'All Categories'}
        </span>
      </div>

      {/* Center: Large Prompt Display */}
      <div
        style={{
          padding: '70px 100px 80px',
          textAlign: 'center',
          maxWidth: '100%',
        }}
      >
        <h1
          className="d"
          style={{
            fontSize: fontStyle.fontSize,
            lineHeight: fontStyle.lineHeight,
            margin: 0,
            wordBreak: 'break-word',
            color: '#FFFFFF',
            textShadow: '0 4px 16px rgba(30, 15, 90, 0.4)',
          }}
        >
          {currentPrompt.text}
        </h1>
      </div>

      {/* Bottom Left: Pass Button */}
      <div style={{ position: 'absolute', left: 20, bottom: 16, zIndex: 10 }}>
        <TiltButton
          action="pass"
          onTrigger={handleAction}
          showTiltHint={showTiltHints}
          passLabel="Pass ↑"
          tiltUpHint="Tilt up"
        />
      </div>

      {/* Bottom Right: Correct Button */}
      <div style={{ position: 'absolute', right: 20, bottom: 16, zIndex: 10 }}>
        <TiltButton
          action="correct"
          onTrigger={handleAction}
          showTiltHint={showTiltHints}
          correctLabel="Correct ↓"
          tiltDownHint="Tilt down"
        />
      </div>

      {/* Mobile Portrait Orientation Prompt Overlay */}
      {isPortraitWarning && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(26, 17, 71, 0.96)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            textAlign: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 54,
              animation: 'rotate-device 2s ease-in-out infinite',
            }}
          >
            📱⟲
          </div>
          <h2 className="d" style={{ fontSize: 28, margin: 0 }}>
            Rotate to Landscape
          </h2>
          <p style={{ fontSize: 16, fontWeight: 700, margin: 0, opacity: 0.9 }}>
            Bongo Charades is played with your phone held horizontally against your forehead.
          </p>
          <button
            type="button"
            onClick={() => setIsPortraitWarning(false)}
            style={{
              marginTop: 12,
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: 999,
              padding: '8px 20px',
              fontSize: 14,
              color: '#fff',
            }}
          >
            Dismiss hint
          </button>
        </div>
      )}
    </div>
  )
}
