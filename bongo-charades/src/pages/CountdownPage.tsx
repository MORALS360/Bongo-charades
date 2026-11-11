import { useCountdown, type CountdownStep } from '../hooks/useCountdown'

interface CountdownPageProps {
  onCountdownComplete: () => void
  soundEnabled?: boolean
}

const STEPS: CountdownStep[] = [3, 2, 1, 'GO!']

/**
 * Bongo Charades — Countdown Screen (Artboard 8 / PDF Page 8).
 *
 * Landscape countdown stage with:
 * - 270x270 radial golden circle with pulsing numbers
 * - 4 progression step pills (3, 2, 1, GO!)
 * - Web Audio API synthesized sound cues
 */
export function CountdownPage({
  onCountdownComplete,
  soundEnabled = true,
}: CountdownPageProps) {
  const { step } = useCountdown({
    active: true,
    onComplete: onCountdownComplete,
    soundEnabled,
  })

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 844,
        height: '100%',
        minHeight: 350,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 36,
        padding: '20px 16px',
        flexWrap: 'wrap',
      }}
    >
      {/* 270x270 Golden Radial Countdown Circle */}
      <div
        style={{
          width: 270,
          height: 270,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #FFE98A, #F5A623)',
          boxShadow: '0 0 0 16px rgba(255, 255, 255, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.15s ease',
          animation: 'countdown-pulse 0.9s ease-out infinite',
        }}
      >
        <span
          className="d"
          style={{
            fontSize: step === 'GO!' ? 104 : 180,
            lineHeight: 1,
            color: '#2A1B6B',
            userSelect: 'none',
          }}
        >
          {step}
        </span>
      </div>

      {/* Step Pills: 3, 2, 1, GO! */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {STEPS.map((s) => {
          const isActive = s === step
          return (
            <span
              key={String(s)}
              className="d"
              style={{
                minWidth: 64,
                height: 64,
                padding: '0 12px',
                borderRadius: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                background: isActive ? '#FFC83A' : 'rgba(255, 255, 255, 0.2)',
                color: isActive ? '#2A1B6B' : '#fff',
                boxShadow: isActive ? '0 4px 12px rgba(255, 200, 58, 0.45)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {s}
            </span>
          )
        })}
      </div>
    </div>
  )
}
