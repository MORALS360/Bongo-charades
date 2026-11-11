import type { Category } from '../../types'
import { CategoryIcon } from '../illustrations/CategoryIcon'

interface CategoryChipProps {
  category: Category
  onClick?: (category: Category) => void
  onRemove?: (category: Category) => void
}

/**
 * Yellow pill chip displaying a 32x32 mini category illustration,
 * its untranslated category name, and an optional remove action.
 * Used on the Game Setup screen and summary views.
 */
export function CategoryChip({ category, onClick, onRemove }: CategoryChipProps) {
  const content = (
    <>
      <CategoryIcon icon={category.icon} size={32} />
      <span>{category.name}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${category.name}`}
          className="category-chip__remove"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(category)
          }}
        >
          ×
        </button>
      )}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        className="category-chip"
        onClick={() => onClick(category)}
      >
        {content}
      </button>
    )
  }

  return <span className="category-chip">{content}</span>
}
