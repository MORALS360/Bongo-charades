import { ForeheadPositioningSvg } from '../components/illustrations/CategoryIcon'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'

interface ForeheadReadyPageProps {
  currentTeamName: string
  currentTeamIndex: number
  totalTeams: number
  durationSeconds: number
  promptLanguageLabel: string
  categoriesSummary: string
  onReady: () => void
  onBackToSetup: () => void
  onBackToHome: () => void
}

/**
 * Bongo Charades — Forehead Positioning Screen (Artboard 7 / PDF Page 7).
 *
 * Landscape instruction screen showing players how to position the phone horizontally
 * against the forehead with the screen facing friends.
 * Clicking "I'm Ready" triggers motion permission and starts the 3-2-1-GO! countdown.
 */
export function ForeheadReadyPage({
  currentTeamName,
  currentTeamIndex,
  totalTeams,
  durationSeconds,
  promptLanguageLabel,
  categoriesSummary,
  onReady,
  onBackToSetup,
  onBackToHome,
}: ForeheadReadyPageProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 844,
        minHeight: 350,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
        alignItems: 'center',
        padding: '16px 20px',
      }}
    >
      {/* Left: Player + Friends Forehead Illustration */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ForeheadPositioningSvg width={320} height={216} />
      </div>

      {/* Right: Instructions & Config Information */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Round Configuration Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255, 200, 58, 0.18)',
            border: '2px solid rgba(255, 200, 58, 0.35)',
            borderRadius: 999,
            padding: '4px 14px',
            fontSize: 13,
            fontWeight: 800,
            color: '#FFC83A',
            width: 'fit-content',
          }}
        >
          <span>
            🎯 Team {currentTeamIndex + 1}/{totalTeams}: {currentTeamName}
          </span>
          <span>•</span>
          <span>{durationSeconds}s</span>
          <span>•</span>
          <span>{promptLanguageLabel}</span>
        </div>

        <h1 className="d" style={{ fontSize: 38, lineHeight: '40px', margin: 0 }}>
          Get ready!
        </h1>

        <p style={{ fontSize: 17, fontWeight: 700, margin: '2px 0 6px', lineHeight: 1.35 }}>
          Place your phone against your forehead, with the screen facing your friends.
        </p>

        <p style={{ fontSize: 13, opacity: 0.85, margin: 0, fontWeight: 600 }}>
          Categories: {categoriesSummary}
        </p>

        <PrimaryButton
          size="lg"
          onClick={onReady}
          style={{ minHeight: 56, fontSize: 20, marginTop: 4 }}
        >
          I'm Ready
        </PrimaryButton>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <SecondaryButton
            onClick={onBackToSetup}
            style={{ minHeight: 44, fontSize: 14 }}
          >
            ← Back to Setup
          </SecondaryButton>
          <SecondaryButton
            onClick={onBackToHome}
            style={{ minHeight: 44, fontSize: 14 }}
          >
            Home
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}
