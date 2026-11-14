import { CategoryChip } from '../components/ui/CategoryChip'
import { Panel } from '../components/ui/Panel'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'
import type { Category } from '../types'

export type PendingDestination =
  | 'setup'
  | 'settings'
  | 'rewards'
  | 'create'
  | 'history'

interface PendingScreenPageProps {
  destination: PendingDestination
  selectedCategories: Category[]
  isFeelingLucky: boolean
  onBackToHome: () => void
  onBackToCategories: () => void
}

const DESTINATION_DETAILS: Record<
  PendingDestination,
  { title: string; phaseNote: string; description: string }
> = {
  setup: {
    title: 'Game setup',
    phaseNote: 'Scheduled for Phase 3',
    description:
      'Your category selection is connected and ready. Round duration, teams, and prompt language configuration will be implemented in the next phase.',
  },
  settings: {
    title: 'Settings',
    phaseNote: 'Scheduled for Phase 3',
    description:
      'App language (English / Kiswahili), sound, haptic feedback, tilt hints, and tilt sensitivity controls will be implemented in the next phase.',
  },
  rewards: {
    title: 'Rewards',
    phaseNote: 'Future Enhancement',
    description:
      'Party achievements and cultural pack rewards are not yet implemented in this phase.',
  },
  create: {
    title: 'Create',
    phaseNote: 'Scheduled for Later Phase',
    description:
      'Custom category and prompt creation is not yet implemented in this phase.',
  },
  history: {
    title: 'History',
    phaseNote: 'Scheduled for Later Phase',
    description:
      'Past game rounds and scores history is not yet implemented in this phase.',
  },
}

/**
 * Transparent status screen for navigation targets that belong to later phases,
 * ensuring all buttons on Home and Categories respond honestly without fake functionality.
 */
export function PendingScreenPage({
  destination,
  selectedCategories,
  isFeelingLucky,
  onBackToHome,
  onBackToCategories,
}: PendingScreenPageProps) {
  const info = DESTINATION_DETAILS[destination]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h1 className="d" style={{ fontSize: 36 }}>
        {info.title}
      </h1>

      <Panel title={info.phaseNote}>
        <p style={{ margin: '8px 0 0', fontWeight: 700, fontSize: 15 }}>
          {info.description}
        </p>
      </Panel>

      {destination === 'setup' && (
        <Panel title={isFeelingLucky ? 'Selected Mode' : 'Selected Categories'}>
          {isFeelingLucky ? (
            <p style={{ margin: '8px 0 0', fontWeight: 800, color: '#FFC83A' }}>
              🎲 Feeling lucky? — Random words across all categories.
            </p>
          ) : selectedCategories.length > 0 ? (
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                marginTop: 8,
              }}
            >
              {selectedCategories.map((cat) => (
                <CategoryChip key={cat.id} category={cat} />
              ))}
            </div>
          ) : (
            <p style={{ margin: '8px 0 0', fontSize: 14 }}>
              No categories selected yet. Choose one or more categories to play!
            </p>
          )}
        </Panel>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        <PrimaryButton onClick={onBackToCategories}>
          Browse Categories
        </PrimaryButton>
        <SecondaryButton onClick={onBackToHome}>Back to Home</SecondaryButton>
      </div>
    </div>
  )
}
