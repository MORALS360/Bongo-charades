import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'

interface RoundTransitionPageProps {
  completedTeamName: string
  completedTeamScore: number
  correctCount: number
  passedCount: number
  nextTeamName: string
  nextTeamIndex: number
  totalTeams: number
  onStartNextTurn: () => void
  onViewStandings: () => void
}

/**
 * Bongo Charades — Round Transition Screen.
 *
 * Shown between team turns in multi-team games:
 * - Congratulates the team that just finished
 * - Summarizes their round score (Correct vs Passed)
 * - Clearly introduces the next team up
 * - CTA button smoothly advances to the next team's forehead preparation
 */
export function RoundTransitionPage({
  completedTeamName,
  completedTeamScore,
  correctCount,
  passedCount,
  nextTeamName,
  nextTeamIndex,
  totalTeams,
  onStartNextTurn,
  onViewStandings,
}: RoundTransitionPageProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 440,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '24px 16px',
        gap: 16,
      }}
    >
      {/* Round Heading */}
      <div style={{ marginTop: 12 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: '#FFC83A',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          Round Finished!
        </span>
        <h1 className="d" style={{ fontSize: 36, lineHeight: '38px', margin: '4px 0 0' }}>
          Time's up!
        </h1>
        <p style={{ fontSize: 16, fontWeight: 700, margin: '6px 0 0', opacity: 0.9 }}>
          Great round, {completedTeamName}!
        </p>
      </div>

      {/* 160x160 Golden Radial Score Badge */}
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #FFE98A, #F5A623)',
          boxShadow: '0 0 0 12px rgba(255, 255, 255, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2A1B6B',
          margin: '12px auto',
        }}
      >
        <span className="d" style={{ fontSize: 72, lineHeight: '68px' }}>
          {completedTeamScore}
        </span>
        <b style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Points
        </b>
      </div>

      {/* Correct vs Passed Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          width: '100%',
          maxWidth: 320,
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.16)',
            borderRadius: 20,
            padding: 12,
          }}
        >
          <div className="d" style={{ fontSize: 32, color: '#9CF5EA' }}>
            {correctCount}
          </div>
          <b style={{ fontSize: 13 }}>Correct</b>
        </div>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.16)',
            borderRadius: 20,
            padding: 12,
          }}
        >
          <div className="d" style={{ fontSize: 32, color: '#FFB36B' }}>
            {passedCount}
          </div>
          <b style={{ fontSize: 13 }}>Passed</b>
        </div>
      </div>

      {/* Up Next Banner */}
      <div
        style={{
          width: '100%',
          maxWidth: 340,
          background: 'rgba(255, 200, 58, 0.15)',
          border: '2px solid rgba(255, 200, 58, 0.35)',
          borderRadius: 20,
          padding: '14px 16px',
          marginTop: 6,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 800, opacity: 0.85, textTransform: 'uppercase' }}>
          Team {nextTeamIndex + 1} of {totalTeams}
        </span>
        <div className="d" style={{ fontSize: 24, color: '#FFC83A', marginTop: 2 }}>
          Up next: {nextTeamName}
        </div>
        <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 600, opacity: 0.9 }}>
          Pass the phone to {nextTeamName} for their turn!
        </p>
      </div>

      {/* Actions */}
      <div
        style={{
          width: '100%',
          maxWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginTop: 8,
        }}
      >
        <PrimaryButton
          size="lg"
          onClick={onStartNextTurn}
          style={{ minHeight: 60, fontSize: 18 }}
        >
          Start {nextTeamName}'s Turn ▷
        </PrimaryButton>
        <SecondaryButton
          onClick={onViewStandings}
          style={{ minHeight: 48, fontSize: 15 }}
        >
          View Current Standings
        </SecondaryButton>
      </div>
    </div>
  )
}
