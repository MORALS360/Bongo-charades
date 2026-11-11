import { RewardsGiftIcon, SettingsGearIcon } from '../components/illustrations/UiIcons'
import { CategoryCard } from '../components/ui/CategoryCard'
import { FeaturedCard } from '../components/ui/FeaturedCard'
import { IconButton } from '../components/ui/IconButton'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CATEGORY_SECTIONS } from '../data/categories'
import type { Category, CategoryIconId } from '../types'

interface CategoriesPageProps {
  selectedCategoryIds: CategoryIconId[]
  onToggleCategory: (category: Category) => void
  onFeelingLucky: () => void
  onProceedToSetup: () => void
  onOpenRewards: () => void
  onOpenSettings: () => void
}

/**
 * Bongo Charades — Categories Screen (Artboard 3 / PDF Page 3).
 *
 * Renders the page heading, Rewards & Settings header icons, Featured "Feeling lucky?"
 * random-play card, all 26 categories across the 3 approved cultural & classic sections,
 * and a floating "Continue to Setup" action when categories are selected.
 */
export function CategoriesPage({
  selectedCategoryIds,
  onToggleCategory,
  onFeelingLucky,
  onProceedToSetup,
  onOpenRewards,
  onOpenSettings,
}: CategoriesPageProps) {
  const selectedCount = selectedCategoryIds.length

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 className="d" style={{ fontSize: 36 }}>
          Categories
        </h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconButton label="Rewards" onClick={onOpenRewards}>
            <RewardsGiftIcon />
          </IconButton>
          <IconButton label="Settings" onClick={onOpenSettings}>
            <SettingsGearIcon />
          </IconButton>
        </div>
      </div>

      {/* Featured Random-Play Card ("Feeling lucky?") */}
      <div style={{ marginTop: 16 }}>
        <FeaturedCard onClick={onFeelingLucky} />
      </div>

      {/* Category Groups (Classic Charades, Bongo & Tanzanian Culture, East Africa & Beyond) */}
      {CATEGORY_SECTIONS.map((section) => (
        <section key={section.id} aria-label={section.defaultTitle}>
          <SectionHeading
            title={section.defaultTitle}
            marginTop={24}
            marginBottom={10}
          />
          <div className="g g--categories">
            {section.categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                selected={selectedCategoryIds.includes(category.id)}
                onSelect={onToggleCategory}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Floating Continue to Setup Action Bar when categories are selected */}
      {selectedCount > 0 && (
        <div className="categories-floating-bar" aria-live="polite">
          <PrimaryButton
            size="md"
            onClick={onProceedToSetup}
            style={{
              boxShadow: '0 8px 24px rgba(30, 15, 90, 0.45)',
              fontSize: 17,
              minHeight: 52,
            }}
          >
            Continue to Setup ({selectedCount}) ▷
          </PrimaryButton>
        </div>
      )}
    </div>
  )
}
