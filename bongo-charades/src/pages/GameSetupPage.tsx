import { Panel } from '../components/ui/Panel'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { CategoryChip } from '../components/ui/CategoryChip'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import type {
  Category,
  PromptLanguage,
  RoundDuration,
  TeamCount,
} from '../types'

interface GameSetupPageProps {
  selectedCategories: Category[]
  isFeelingLucky: boolean
  durationSeconds: RoundDuration
  teams: TeamCount
  teamNames: string[]
  activeTeamNames: string[]
  promptLanguage: PromptLanguage
  promptLanguageLabel: string
  isTeamNamesValid: boolean
  emptyTeamIndices: number[]
  onDurationChange: (duration: RoundDuration) => void
  onTeamsChange: (teams: TeamCount) => void
  onTeamNameChange: (index: number, name: string) => void
  onPromptLanguageChange: (lang: PromptLanguage) => void
  onRemoveCategory: (category: Category) => void
  onBackToCategories: () => void
  onStartGame: () => void
  onResetDefaults?: () => void
  /** If set, Start Game is disabled and this message is shown (e.g. no prompts available) */
  startBlockedMessage?: string
}

const DURATION_OPTIONS: { value: RoundDuration; label: string }[] = [
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
  { value: 90, label: '90s' },
  { value: 120, label: '120s' },
]

const TEAM_OPTIONS: { value: TeamCount; label: string }[] = [
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
]

const PROMPT_LANG_OPTIONS: { value: PromptLanguage; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'sw', label: 'Kiswahili' },
  { value: 'mixed', label: 'Mixed' },
]

/**
 * Bongo Charades — Game Setup Screen (Artboard 4 / PDF Page 4).
 *
 * Provides complete game configuration:
 * - Review and remove selected categories (+ add more)
 * - Team count & editable team names with validation
 * - Round duration (30s, 60s default, 90s, 120s)
 * - Prompt language (English, Kiswahili, Mixed default)
 * - Configuration summary and prominent Start Game action
 */
export function GameSetupPage({
  selectedCategories,
  isFeelingLucky,
  durationSeconds,
  teams,
  teamNames,
  activeTeamNames,
  promptLanguage,
  promptLanguageLabel,
  isTeamNamesValid,
  emptyTeamIndices,
  onDurationChange,
  onTeamsChange,
  onTeamNameChange,
  onPromptLanguageChange,
  onRemoveCategory,
  onBackToCategories,
  onStartGame,
  onResetDefaults,
  startBlockedMessage,
}: GameSetupPageProps) {
  const hasCategories = isFeelingLucky || selectedCategories.length > 0
  const canStartGame = hasCategories && isTeamNamesValid && !startBlockedMessage

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header with Navigation and Title */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <button
          type="button"
          onClick={onBackToCategories}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 800,
            fontSize: 15,
            color: '#FFC83A',
            padding: '4px 0',
          }}
          aria-label="Back to Categories"
        >
          <span>←</span>
          <span>Categories</span>
        </button>

        {onResetDefaults && (
          <button
            type="button"
            onClick={onResetDefaults}
            style={{
              fontSize: 13,
              fontWeight: 700,
              opacity: 0.8,
              textDecoration: 'underline',
            }}
          >
            Reset defaults
          </button>
        )}
      </div>

      <h1 className="d" style={{ fontSize: 36, lineHeight: '38px', margin: 0 }}>
        Game setup
      </h1>

      {/* A. Selected Categories Panel */}
      <Panel>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <b>Categories</b>
            {!isFeelingLucky && selectedCategories.length > 0 && (
              <span style={{ fontSize: 13, opacity: 0.85, fontWeight: 700 }}>
                ({selectedCategories.length})
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onBackToCategories}
            style={{
              color: '#FFC83A',
              fontWeight: 800,
              fontSize: 14,
              padding: '2px 0',
            }}
          >
            {isFeelingLucky ? 'Choose specific' : '+ Add more'}
          </button>
        </div>

        {isFeelingLucky ? (
          <div
            style={{
              marginTop: 10,
              padding: '10px 14px',
              borderRadius: 16,
              background: 'rgba(255, 200, 58, 0.18)',
              border: '2px solid rgba(255, 200, 58, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <div>
              <span className="d" style={{ fontSize: 18, color: '#FFC83A' }}>
                🎲 Feeling lucky?
              </span>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: 13,
                  fontWeight: 700,
                  opacity: 0.9,
                }}
              >
                Playing random words across all 26 categories.
              </p>
            </div>
          </div>
        ) : selectedCategories.length > 0 ? (
          <div
            style={{
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
              marginTop: 10,
            }}
          >
            {selectedCategories.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                onRemove={onRemoveCategory}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              marginTop: 10,
              padding: '14px 12px',
              borderRadius: 16,
              background: 'rgba(255, 154, 154, 0.15)',
              border: '2px solid rgba(255, 154, 154, 0.35)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: '0 0 10px',
                fontSize: 14,
                fontWeight: 800,
                color: '#FFB3B3',
              }}
            >
              No categories selected.
            </p>
            <PrimaryButton
              size="md"
              onClick={onBackToCategories}
              style={{ minHeight: 44, fontSize: 16 }}
            >
              Select Categories
            </PrimaryButton>
          </div>
        )}
      </Panel>

      {/* B. Teams Setup Panel */}
      <Panel>
        <b>Teams</b>
        <SegmentedControl
          ariaLabel="Number of teams"
          options={TEAM_OPTIONS}
          value={teams}
          onChange={onTeamsChange}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginTop: 12,
          }}
        >
          {Array.from({ length: teams }).map((_, index) => {
            const hasError = emptyTeamIndices.includes(index)
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div className="team-input-row">
                  <span className="team-badge">Team {index + 1}</span>
                  <input
                    type="text"
                    value={teamNames[index] ?? ''}
                    maxLength={30}
                    placeholder={`Team ${index + 1} name`}
                    className={`team-input ${hasError ? 'team-input--error' : ''}`.trim()}
                    onChange={(e) => onTeamNameChange(index, e.target.value)}
                    aria-label={`Name for Team ${index + 1}`}
                    aria-invalid={hasError}
                  />
                </div>
                {hasError && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#FF9A9A',
                      paddingLeft: 64,
                    }}
                  >
                    Please enter a name for Team {index + 1}.
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </Panel>

      {/* C. Duration Panel */}
      <Panel>
        <b>Duration</b>
        <SegmentedControl
          ariaLabel="Round duration"
          options={DURATION_OPTIONS}
          value={durationSeconds}
          onChange={onDurationChange}
        />
      </Panel>

      {/* D. Prompt Language Panel */}
      <Panel>
        <b>Prompt language</b>
        <SegmentedControl
          ariaLabel="Prompt language"
          options={PROMPT_LANG_OPTIONS}
          value={promptLanguage}
          onChange={onPromptLanguageChange}
        />
        <p style={{ fontSize: 13, margin: '10px 0 0', opacity: 0.9 }}>
          Category names keep their original Tanzanian language.
        </p>
      </Panel>

      {/* E. Game Summary Panel */}
      <Panel>
        <b>Configuration summary</b>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            marginTop: 8,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.8 }}>Categories:</span>
            <span style={{ color: '#FFC83A', textAlign: 'right' }}>
              {isFeelingLucky
                ? '🎲 Feeling lucky? (All 26)'
                : `${selectedCategories.length} selected`}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.8 }}>Teams:</span>
            <span style={{ textAlign: 'right' }}>
              {activeTeamNames.join(' vs ')}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.8 }}>Turn duration:</span>
            <span style={{ textAlign: 'right' }}>{durationSeconds} seconds</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.8 }}>Prompt language:</span>
            <span style={{ textAlign: 'right' }}>{promptLanguageLabel}</span>
          </div>
        </div>
      </Panel>

      {/* Start Game Action */}
      <div style={{ marginTop: 6, paddingBottom: 24 }}>
        {!canStartGame && (
          <p
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: '#FFC83A',
              textAlign: 'center',
              margin: '0 0 8px',
            }}
          >
            {!hasCategories
              ? 'Select at least one category to start.'
              : !isTeamNamesValid
                ? 'Please enter a name for all active teams.'
                : startBlockedMessage}
          </p>
        )}
        <PrimaryButton
          size="lg"
          disabled={!canStartGame}
          onClick={onStartGame}
          style={{
            minHeight: 64,
            fontSize: 22,
            opacity: canStartGame ? 1 : 0.5,
            cursor: canStartGame ? 'pointer' : 'not-allowed',
          }}
        >
          Start Game
        </PrimaryButton>
      </div>
    </div>
  )
}
