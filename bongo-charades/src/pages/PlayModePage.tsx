import { Panel } from '../components/ui/Panel'
import { RecentPromptsControl } from '../components/ui/RecentPromptsControl'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import type { Category, PromptLanguage, RoundDuration } from '../types'

interface PlayModePageProps {
  selectedCategories: Category[]
  isFeelingLucky: boolean
  durationSeconds: RoundDuration
  promptLanguage: PromptLanguage
  onDurationChange: (duration: RoundDuration) => void
  onPromptLanguageChange: (lang: PromptLanguage) => void
  onQuickPlay: () => void
  onTeams: () => void
  onBack: () => void
  /** If set, both modes are disabled and this message is shown */
  blockedMessage?: string
}

const DURATION_OPTIONS: { value: RoundDuration; label: string }[] = [
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
  { value: 90, label: '90s' },
  { value: 120, label: '120s' },
]

const PROMPT_LANG_OPTIONS: { value: PromptLanguage; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'sw', label: 'Kiswahili' },
  { value: 'mixed', label: 'Mixed' },
]

function QuickPlayArt() {
  return (
    <svg width="76" height="76" viewBox="0 0 64 64" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="32" cy="32" r="28" fill="url(#W)" />
      <path d="M36 8L18 36h12l-3 20 19-28H34z" fill="url(#O)" />
    </svg>
  )
}

function TeamsArt() {
  return (
    <svg width="76" height="76" viewBox="0 0 64 64" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="16" cy="38" r="11" fill="url(#O)" />
      <circle cx="48" cy="38" r="11" fill="url(#T)" />
      <circle cx="32" cy="26" r="13" fill="url(#Y)" />
      <rect x="6" y="50" width="52" height="8" rx="4" fill="url(#W)" />
    </svg>
  )
}

/**
 * Bongo Charades — Play Mode screen (new, pre-Phase 5).
 *
 * Flow: Home → Categories → **Play Mode** → (Quick Play → game) | (Teams → Team setup → game)
 *
 * - Quick Play: no teams, one shared score, straight into the game.
 * - Teams: continues to the existing Game Setup screen.
 * Round length and prompt language apply to both modes (and stay in sync with
 * the Game Setup screen, which shows the same settings).
 */
export function PlayModePage({
  selectedCategories,
  isFeelingLucky,
  durationSeconds,
  promptLanguage,
  onDurationChange,
  onPromptLanguageChange,
  onQuickPlay,
  onTeams,
  onBack,
  blockedMessage,
}: PlayModePageProps) {
  const summary = isFeelingLucky
    ? 'Feeling lucky — all categories'
    : selectedCategories.length === 0
      ? 'No categories selected'
      : selectedCategories.map((c) => c.name).join(' · ')
  const disabled = Boolean(blockedMessage)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button type="button" className="back-link" onClick={onBack} aria-label="Back to Categories">
        <span>←</span>
        <span>Categories</span>
      </button>

      <div>
        <h1 className="text-page-title">How do you want to play?</h1>
        <p className="play-mode__summary">{summary}</p>
      </div>

      {blockedMessage && <p className="inline-warning">{blockedMessage}</p>}

      <button
        type="button"
        className="mode-card mode-card--quick"
        onClick={onQuickPlay}
        disabled={disabled}
      >
        <span>
          <span className="d mode-card__title">Quick Play</span>
          <span className="mode-card__text">Jump straight in. No teams — one shared score.</span>
        </span>
        <QuickPlayArt />
      </button>

      <button
        type="button"
        className="mode-card mode-card--teams"
        onClick={onTeams}
        disabled={disabled}
      >
        <span>
          <span className="d mode-card__title">Teams</span>
          <span className="mode-card__text">Take turns, keep score and crown a winner.</span>
        </span>
        <TeamsArt />
      </button>

      <Panel>
        <b>Round length</b>
        <SegmentedControl
          ariaLabel="Round length"
          options={DURATION_OPTIONS}
          value={durationSeconds}
          onChange={onDurationChange}
        />
        <b style={{ display: 'block', marginTop: 14 }}>Prompt language</b>
        <SegmentedControl
          ariaLabel="Prompt language"
          options={PROMPT_LANG_OPTIONS}
          value={promptLanguage}
          onChange={onPromptLanguageChange}
        />
        <p style={{ fontSize: 13, fontWeight: 700, opacity: 0.9, margin: '10px 0 0' }}>
          Tanzanian categories stay mostly in Kiswahili — that's their flavour.
        </p>
        <RecentPromptsControl />
      </Panel>
    </div>
  )
}
