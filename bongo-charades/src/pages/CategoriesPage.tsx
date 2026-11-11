import { RewardsGiftIcon, SettingsGearIcon } from '../components/illustrations/UiIcons'
import { CategoryCard } from '../components/ui/CategoryCard'
import { FeaturedCard } from '../components/ui/FeaturedCard'
import { IconButton } from '../components/ui/IconButton'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CATEGORY_SECTIONS } from '../data/categories'
import type { Category, CategoryIconId } from '../types'

interface CategoriesPageProps {
  selectedCategoryIds: CategoryIconId[]
  onToggleCategory: (category: Category) => void
  onFeelingLucky: () => void
  onOpenRewards: () => void
  onOpenSettings: () => void
}

/**
 * Bongo Charades — Categories Screen (Artboard 3 / PDF Page 3).
 *
 * Renders the page heading, Rewards & Settings header icons, Featured "Feeling lucky?"
 * random-play card, and all 26 categories across the 3 approved cultural & classic sections.
 */
export function CategoriesPage({
  selectedCategoryIds,
  onToggleCategory,
  onFeelingLucky,
  onOpenRewards,
  onOpenSettings,
}: CategoriesPageProps) {
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
    </div>
  )
}
