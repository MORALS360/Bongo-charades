import { rankTeams } from '../game/gameSession'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'

export interface TeamScoreRecord {
  teamName: string
  score: number
  correctCount: number
  passedCount: number
}

interface ResultsPageProps {
  teamScores: TeamScoreRecord[]
  onPlayAgain: () => void
  onBackToCategories: () => void
  onReturnHome: () => void
  /**
   * 'final' (default) = end-of-game results.
   * 'standings' = mid-game scoreboard opened from the round-transition screen;
   * shows a single "Back to Game" button instead of Play Again / exit actions.
   */
  mode?: 'final' | 'standings'
  onBackToGame?: () => void
}

/**
 * Bongo Charades — Results & Winner Screen (Artboard 5 / PDF Page 5).
 *
 * Full match summary featuring:
 * - Confetti dots background styling
 * - 200x200 golden radial score circle displaying the winning score
 * - Winner announcement & tie-breaking handling
 * - Ranked leaderboard from highest to lowest score
 * - Play Again (restarts with same config) & Return Home CTAs
 */
export function ResultsPage({
  teamScores,
  onPlayAgain,
  onBackToCategories,
  onReturnHome,
  mode = 'final',
  onBackToGame,
}: ResultsPageProps) {
  const isStandings = mode === 'standings'
  // Sort teams by score (highest first). Tied teams share the same rank (1, 1, 3…).
  const ranked = rankTeams(teamScores.map((t) => ({ ...t, name: t.teamName })))
  const sorted = ranked.map((t) => ({ ...t, teamName: t.name }))
  const topScore = sorted[0]?.score ?? 0

  // Detect ties for 1st place
  const winners = sorted.filter((t) => t.score === topScore)
  const isTie = winners.length > 1 && topScore > 0

  let winnerText = ''
  if (topScore === 0) {
    winnerText = 'Good effort all teams!'
  } else if (isTie) {
    winnerText = isStandings
      ? `🤝 ${winners.map((w) => w.teamName).join(' & ')} are tied for the lead`
      : `🤝 It's a Tie between ${winners.map((w) => w.teamName).join(' & ')}!`
  } else {
    winnerText = isStandings
      ? `🔥 ${sorted[0].teamName} is in the lead`
      : `🏆 ${sorted[0].teamName} Wins!`
  }
  if (isStandings && topScore === 0) winnerText = 'No points yet — all to play for!'

  // Calculate totals
  const totalCorrect = teamScores.reduce((sum, t) => sum + t.correctCount, 0)
  const totalPassed = teamScores.reduce((sum, t) => sum + t.passedCount, 0)

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
        padding: '24px 16px 40px',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Confetti Dots (Matching Artboard 5) */}
      <span
        style={{
          position: 'absolute',
          left: 20,
          top: 30,
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: '#FFC83A',
          opacity: 0.85,
        }}
      />
      <span
        style={{
          position: 'absolute',
          right: 30,
          top: 40,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#FF9A9A',
          opacity: 0.85,
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: 40,
          top: 140,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#9CF5EA',
          opacity: 0.85,
        }}
      />
      <span
        style={{
          position: 'absolute',
          right: 40,
          top: 160,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#FFC83A',
          opacity: 0.85,
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: 140,
          top: 15,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#FFB3E6',
          opacity: 0.85,
        }}
      />
      <span
        style={{
          position: 'absolute',
          right: 20,
          top: 240,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#9CD3FF',
          opacity: 0.85,
        }}
      />

      {/* Screen Title */}
      <h1 className="d" style={{ fontSize: 40, margin: '16px 0 0', textAlign: 'center' }}>
        {isStandings ? 'Standings' : "Time's up!"}
      </h1>

      {/* 200x200 Golden Radial Score Circle (Artboard 5) */}
      <div
        style={{
          margin: '18px auto',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #FFE98A, #F5A623)',
          boxShadow: '0 0 0 14px rgba(255, 255, 255, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2A1B6B',
          textAlign: 'center',
        }}
      >
        <span className="d" style={{ fontSize: 92, lineHeight: '86px' }}>
          {topScore}
        </span>
        <b style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {isStandings ? 'Top score' : 'Final score'}
        </b>
      </div>

      {/* Winner Announcement Message */}
      <p
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: '#FFC83A',
          margin: '0 0 16px',
          textAlign: 'center',
        }}
      >
        {winnerText}
      </p>

      {/* Correct vs Passed Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          width: '100%',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.16)',
            borderRadius: 24,
            padding: '14px 12px',
            textAlign: 'center',
          }}
        >
          <div className="d" style={{ fontSize: 36, color: '#9CF5EA' }}>
            {totalCorrect}
          </div>
          <b style={{ fontSize: 13 }}>Total Correct</b>
        </div>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.16)',
            borderRadius: 24,
            padding: '14px 12px',
            textAlign: 'center',
          }}
        >
          <div className="d" style={{ fontSize: 36, color: '#FFB36B' }}>
            {totalPassed}
          </div>
          <b style={{ fontSize: 13 }}>Total Passed</b>
        </div>
      </div>

      {/* Team Leaderboard */}
      <div
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 24,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <b style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Match Standings
          </b>
          <span style={{ fontSize: 12, opacity: 0.8, fontWeight: 700 }}>
            {sorted.length} Teams
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map((team, idx) => {
            const isWinner = team.score === topScore && topScore > 0
            const medals = ['🥇', '🥈', '🥉']
            return (
              <div
                key={`${idx}-${team.teamName}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 16,
                  background: isWinner
                    ? 'rgba(255, 200, 58, 0.22)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: isWinner
                    ? '2px solid rgba(255, 200, 58, 0.45)'
                    : '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{medals[team.rank - 1] ?? `${team.rank}th`}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{team.teamName}</div>
                    <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 700 }}>
                      ✓ {team.correctCount} correct • ✕ {team.passedCount} passed
                    </div>
                  </div>
                </div>

                <div
                  className="d"
                  style={{
                    fontSize: 26,
                    color: isWinner ? '#FFC83A' : '#fff',
                  }}
                >
                  {team.score}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {isStandings ? (
          <PrimaryButton
            size="lg"
            onClick={onBackToGame}
            style={{ minHeight: 60, fontSize: 20 }}
          >
            Back to Game
          </PrimaryButton>
        ) : (
          <>
        <PrimaryButton
          size="lg"
          onClick={onPlayAgain}
          style={{ minHeight: 60, fontSize: 20 }}
        >
          Play Again
        </PrimaryButton>
        <SecondaryButton
          onClick={onBackToCategories}
          style={{ minHeight: 52, fontSize: 16 }}
        >
          Back to Categories
        </SecondaryButton>
        <button
          type="button"
          onClick={onReturnHome}
          style={{
            background: 'transparent',
            border: 0,
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            opacity: 0.8,
            padding: 8,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Return Home
        </button>
          </>
        )}
      </div>
    </div>
  )
}
