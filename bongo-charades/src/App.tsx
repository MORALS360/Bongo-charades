import { useState } from 'react'
import { ScorePill } from './components/gameplay/ScorePill'
import { TiltButton } from './components/gameplay/TiltButton'
import { TimerPill } from './components/gameplay/TimerPill'
import { ForeheadPositioningSvg } from './components/illustrations/CategoryIcon'
import {
  PlayTriangleIcon,
  RewardsGiftIcon,
  SettingsGearIcon,
} from './components/illustrations/UiIcons'
import { AppShell } from './components/layout/AppShell'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { CategoryCard } from './components/ui/CategoryCard'
import { CategoryChip } from './components/ui/CategoryChip'
import { FeaturedCard } from './components/ui/FeaturedCard'
import { IconButton } from './components/ui/IconButton'
import { Panel } from './components/ui/Panel'
import { PrimaryButton } from './components/ui/PrimaryButton'
import { SecondaryButton } from './components/ui/SecondaryButton'
import { SectionHeading } from './components/ui/SectionHeading'
import { SegmentedControl } from './components/ui/SegmentedControl'
import { ToggleRow } from './components/ui/ToggleRow'
import { CATEGORIES, CATEGORY_SECTIONS } from './data/categories'
import { useNavigation } from './hooks/useNavigation'
import type {
  AppLanguage,
  Category,
  CategoryIconId,
  PromptLanguage,
  RoundDuration,
  TeamCount,
  TiltSensitivity,
} from './types'

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

const APP_LANG_OPTIONS: { value: AppLanguage; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'sw', label: 'Kiswahili' },
]

const SENSITIVITY_OPTIONS: { value: TiltSensitivity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

/**
 * Phase 1 Application Foundation:
 * Interactive showcase & verification environment for all Bongo Charades
 * design tokens, reusable UI primitives, 26 category illustrations,
 * portrait app shell, and landscape gameplay stage.
 */
export function App() {
  const nav = useNavigation('home')

  // Interactive states for testing the Phase 1 reusable components
  const [selectedIds, setSelectedIds] = useState<CategoryIconId[]>([
    'bongo-flava',
    'movie-za-bongo',
    'chakula-chetu',
  ])
  const [duration, setDuration] = useState<RoundDuration>(60)
  const [teams, setTeams] = useState<TeamCount>(2)
  const [promptLang, setPromptLang] = useState<PromptLanguage>('mixed')
  const [appLang, setAppLang] = useState<AppLanguage>('en')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [hapticEnabled, setHapticEnabled] = useState(true)
  const [showTiltHints, setShowTiltHints] = useState(true)
  const [sensitivity, setSensitivity] = useState<TiltSensitivity>('medium')
  const [demoScore, setDemoScore] = useState(7)

  const toggleCategory = (category: Category) => {
    setSelectedIds((prev) =>
      prev.includes(category.id)
        ? prev.filter((id) => id !== category.id)
        : [...prev, category.id],
    )
  }

  const selectedCategories = CATEGORIES.filter((c) => selectedIds.includes(c.id))

  return (
    <ErrorBoundary>
      <AppShell
        orientation={nav.isLandscape ? 'landscape' : 'portrait'}
        activeNavTab={nav.activeNavTab}
        onSelectNavTab={nav.selectNavTab}
        showBottomNav={!nav.isLandscape}
      >
        {nav.isLandscape ? (
          /* Landscape Stage Foundation Preview (844x390 reference) */
          <div
            style={{
              width: '100%',
              height: '100%',
              minHeight: 350,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'absolute', left: 0, top: 0 }}>
              <TimerPill secondsRemaining={42} />
            </div>
            <div style={{ position: 'absolute', right: 0, top: 0 }}>
              <ScorePill score={demoScore} />
            </div>

            <div
              style={{
                fontWeight: 800,
                color: '#FFC83A',
                marginBottom: 8,
              }}
            >
              Daladala Diaries
            </div>

            <h1 className="text-game-prompt" style={{ padding: '0 40px' }}>
              Konda wa Daladala
            </h1>

            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
              }}
            >
              <TiltButton
                action="pass"
                showTiltHint={showTiltHints}
                onTrigger={() => setDemoScore((s) => Math.max(0, s))}
              />
            </div>

            <div style={{ position: 'absolute', bottom: 8 }}>
              <SecondaryButton
                fullWidth={false}
                style={{ minHeight: 44, fontSize: 14, padding: '0 18px' }}
                onClick={() => nav.navigate('home')}
              >
                Exit Landscape Preview
              </SecondaryButton>
            </div>

            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
              }}
            >
              <TiltButton
                action="correct"
                showTiltHint={showTiltHints}
                onTrigger={() => setDemoScore((s) => s + 1)}
              />
            </div>
          </div>
        ) : (
          /* Portrait Foundation & Component Showcase */
          <>
            {/* Brand Header */}
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className="d" style={{ fontSize: 26 }}>
                <span style={{ color: '#FFC83A' }}>Bongo</span> Charades
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <IconButton
                  label="Rewards"
                  onClick={() => nav.navigate('categories')}
                >
                  <RewardsGiftIcon />
                </IconButton>
                <IconButton
                  label="Settings"
                  onClick={() => nav.navigate('settings')}
                >
                  <SettingsGearIcon />
                </IconButton>
              </div>
            </header>

            {/* Hero Greeting */}
            <div>
              <h1 className="text-hero-title">Ready to play?</h1>
              <p style={{ margin: '6px 0 0', fontWeight: 700 }}>
                Your culture. Your people. Your game.
              </p>
            </div>

            {/* Primary Hero CTA */}
            <PrimaryButton
              size="hero"
              icon={<PlayTriangleIcon />}
              onClick={() => nav.navigate('gameplay')}
            >
              Play Now
            </PrimaryButton>

            {/* Featured Card ("Feeling lucky?") */}
            <FeaturedCard onClick={() => nav.navigate('gameplay')} />

            {/* Selected Category Chips & Setup Controls Foundation */}
            <SectionHeading
              title="Foundation Controls"
              actionLabel="Test Landscape ▷"
              onAction={() => nav.navigate('gameplay')}
              size="sm"
              marginTop={8}
            />

            <Panel title="Selected Categories">
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                  marginTop: 8,
                }}
              >
                {selectedCategories.map((cat) => (
                  <CategoryChip
                    key={cat.id}
                    category={cat}
                    onClick={toggleCategory}
                  />
                ))}
              </div>
            </Panel>

            <Panel title="Duration">
              <SegmentedControl
                ariaLabel="Round duration"
                options={DURATION_OPTIONS}
                value={duration}
                onChange={setDuration}
              />
            </Panel>

            <Panel title="Teams">
              <SegmentedControl
                ariaLabel="Number of teams"
                options={TEAM_OPTIONS}
                value={teams}
                onChange={setTeams}
              />
            </Panel>

            <Panel title="Prompt language">
              <SegmentedControl
                ariaLabel="Prompt language"
                options={PROMPT_LANG_OPTIONS}
                value={promptLang}
                onChange={setPromptLang}
              />
            </Panel>

            <Panel title="App language">
              <SegmentedControl
                ariaLabel="App interface language"
                options={APP_LANG_OPTIONS}
                value={appLang}
                onChange={setAppLang}
              />
              <p style={{ fontSize: 13, margin: '10px 0 0' }}>
                Category names keep their original language.
              </p>
            </Panel>

            <ToggleRow
              label="Sound"
              checked={soundEnabled}
              onChange={setSoundEnabled}
            />
            <ToggleRow
              label="Haptic feedback"
              checked={hapticEnabled}
              onChange={setHapticEnabled}
            />
            <ToggleRow
              label="Show tilt hints"
              checked={showTiltHints}
              onChange={setShowTiltHints}
            />

            <Panel title="Tilt sensitivity">
              <SegmentedControl
                ariaLabel="Tilt sensitivity"
                options={SENSITIVITY_OPTIONS}
                value={sensitivity}
                onChange={setSensitivity}
              />
            </Panel>

            <Panel title="Forehead Illustration Preview">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 8,
                }}
              >
                <ForeheadPositioningSvg width={280} height={190} />
              </div>
            </Panel>

            {/* All 26 Approved Categories across the 3 Design System Groups */}
            {CATEGORY_SECTIONS.map((section) => (
              <section key={section.id}>
                <SectionHeading
                  title={section.defaultTitle}
                  marginTop={16}
                  marginBottom={10}
                />
                <div className="g g--categories">
                  {section.categories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      selected={selectedIds.includes(category.id)}
                      onSelect={toggleCategory}
                    />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </AppShell>
    </ErrorBoundary>
  )
}

export default App
