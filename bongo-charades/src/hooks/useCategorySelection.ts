import { useCallback, useMemo, useState } from 'react'
import { CATEGORIES, getCategoryById } from '../data/categories'
import type { Category, CategoryIconId } from '../types'

const DEFAULT_SELECTED_IDS: CategoryIconId[] = [
  'bongo-flava',
  'chakula-chetu',
  'movie-za-bongo',
]

const DEFAULT_RECENT_IDS: CategoryIconId[] = [
  'bongo-flava',
  'daladala-diaries',
]

export interface CategorySelectionController {
  selectedCategoryIds: CategoryIconId[]
  selectedCategories: Category[]
  recentlyPlayedCategories: Category[]
  isFeelingLucky: boolean
  toggleCategory: (category: Category) => void
  removeCategory: (category: Category) => void
  clearCategories: () => void
  selectAllCategories: () => void
  selectCategoryFromHome: (category: Category) => void
  activateFeelingLucky: () => void
  deactivateFeelingLucky: () => void
}

/**
 * Manages category selection, "Recently played" categories on Home,
 * and "Feeling lucky?" random-play state across Home, Categories, and Game Setup.
 */
export function useCategorySelection(): CategorySelectionController {
  const [selectedCategoryIds, setSelectedCategoryIds] =
    useState<CategoryIconId[]>(DEFAULT_SELECTED_IDS)
  const [recentlyPlayedIds, setRecentlyPlayedIds] =
    useState<CategoryIconId[]>(DEFAULT_RECENT_IDS)
  const [isFeelingLucky, setIsFeelingLucky] = useState(false)

  const recordRecent = useCallback((id: CategoryIconId) => {
    setRecentlyPlayedIds((prev) => {
      const filtered = prev.filter((item) => item !== id)
      return [id, ...filtered].slice(0, 2)
    })
  }, [])

  const toggleCategory = useCallback((category: Category) => {
    setIsFeelingLucky(false)
    setSelectedCategoryIds((prev) =>
      prev.includes(category.id)
        ? prev.filter((id) => id !== category.id)
        : [...prev, category.id],
    )
  }, [])

  const removeCategory = useCallback((category: Category) => {
    setSelectedCategoryIds((prev) => prev.filter((id) => id !== category.id))
  }, [])

  const clearCategories = useCallback(() => {
    setIsFeelingLucky(false)
    setSelectedCategoryIds([])
  }, [])

  const selectAllCategories = useCallback(() => {
    setIsFeelingLucky(false)
    setSelectedCategoryIds(CATEGORIES.map((c) => c.id))
  }, [])

  const selectCategoryFromHome = useCallback(
    (category: Category) => {
      setIsFeelingLucky(false)
      recordRecent(category.id)
      setSelectedCategoryIds((prev) =>
        prev.includes(category.id) ? prev : [...prev, category.id],
      )
    },
    [recordRecent],
  )

  const activateFeelingLucky = useCallback(() => {
    setIsFeelingLucky(true)
  }, [])

  const deactivateFeelingLucky = useCallback(() => {
    setIsFeelingLucky(false)
  }, [])

  const selectedCategories = useMemo(
    () => CATEGORIES.filter((cat) => selectedCategoryIds.includes(cat.id)),
    [selectedCategoryIds],
  )

  const recentlyPlayedCategories = useMemo(
    () =>
      recentlyPlayedIds
        .map((id) => getCategoryById(id))
        .filter((cat): cat is Category => Boolean(cat)),
    [recentlyPlayedIds],
  )

  return {
    selectedCategoryIds,
    selectedCategories,
    recentlyPlayedCategories,
    isFeelingLucky,
    toggleCategory,
    removeCategory,
    clearCategories,
    selectAllCategories,
    selectCategoryFromHome,
    activateFeelingLucky,
    deactivateFeelingLucky,
  }
}
