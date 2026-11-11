import { PlayTriangleIcon, SettingsGearIcon } from '../components/illustrations/UiIcons'
import { CategoryCard } from '../components/ui/CategoryCard'
import { FeaturedCard } from '../components/ui/FeaturedCard'
import { IconButton } from '../components/ui/IconButton'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SectionHeading } from '../components/ui/SectionHeading'
import type { Category } from '../types'

interface HomePageProps {
  recentlyPlayedCategories: Category[]
  onPlayNow: () => void
  onFeelingLucky: () => void
  onBrowseAllCategories: () => void
  onSelectRecentCategory: (category: Category) => void
  onOpenSettings: () => void
}

/**
 * Bongo Charades — Home Screen (Artboard 2 / PDF Page 2).
 *
 * Implements the exact composition, typography, spacing, and visual hierarchy
 * from the master Claude Design export.
 */
export function HomePage({
  recentlyPlayedCategories,
  onPlayNow,
  onFeelingLucky,
  onBrowseAllCategories,
  onSelectRecentCategory,
  onOpenSettings,
}: HomePageProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Top Brand Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span className="d" style={{ fontSize: 26 }}>
          <span style={{ color: '#FFC83A' }}>Bongo</span> Charades
        </span>
        <IconButton label="Settings" onClick={onOpenSettings}>
          <SettingsGearIcon />
        </IconButton>
      </div>

      {/* Hero Greeting */}
      <div>
        <h1 className="d" style={{ fontSize: 40, lineHeight: '42px' }}>
          Ready to play?
        </h1>
        <p style={{ margin: '6px 0 0', fontWeight: 700 }}>
          Your culture. Your people. Your game.
        </p>
      </div>

      {/* Primary Play Now CTA */}
      <PrimaryButton
        size="hero"
        icon={<PlayTriangleIcon />}
        onClick={onPlayNow}
      >
        Play Now
      </PrimaryButton>

      {/* Featured Random-Play Card ("Feeling lucky?") */}
      <FeaturedCard onClick={onFeelingLucky} />

      {/* Recently Played Section */}
      <SectionHeading
        title="Recently played"
        actionLabel="Browse all"
        onAction={onBrowseAllCategories}
        size="sm"
      />

      <div className="g">
        {recentlyPlayedCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            compact
            onSelect={onSelectRecentCategory}
          />
        ))}
      </div>
    </div>
  )
}
