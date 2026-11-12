import type { Category, CategoryIconId, CategorySection } from '../types'

/**
 * All 26 approved Bongo Charades categories across the 3 design system groups.
 * IMPORTANT: Category `name` values must NEVER be translated when AppLanguage changes.
 */
export const CATEGORIES: Category[] = [
  // Group 1: Classic Charades (c1 — #7060E3)
  { id: 'animals', name: 'Animals', group: 'c1', icon: 'animals' },
  { id: 'movies-tv', name: 'Movies & TV', group: 'c1', icon: 'movies-tv' },
  { id: 'music-artists', name: 'Music & Artists', group: 'c1', icon: 'music-artists' },
  { id: 'sports', name: 'Sports', group: 'c1', icon: 'sports' },
  { id: 'countries-places', name: 'Countries & Places', group: 'c1', icon: 'countries-places' },
  { id: 'everyday-things', name: 'Everyday Things', group: 'c1', icon: 'everyday-things' },
  { id: 'act-it-out', name: 'Act It Out', group: 'c1', icon: 'act-it-out' },
  { id: 'food-drinks', name: 'Food & Drinks', group: 'c1', icon: 'food-drinks' },

  // Group 2: Bongo & Tanzanian Culture (c2 — #8A55E8)
  { id: 'hii-dar-yetu', name: 'Hii Dar Yetu', group: 'c2', icon: 'hii-dar-yetu' },
  { id: 'daladala-diaries', name: 'Daladala Diaries', group: 'c2', icon: 'daladala-diaries' },
  { id: 'bongo-flava', name: 'Bongo Flava', group: 'c2', icon: 'bongo-flava' },
  { id: 'mtaani', name: 'Mtaani', group: 'c2', icon: 'mtaani' },
  { id: 'zilipendwa', name: 'Zilipendwa', group: 'c2', icon: 'zilipendwa' },
  { id: 'chakula-chetu', name: 'Chakula Chetu', group: 'c2', icon: 'chakula-chetu' },
  { id: 'watu-maarufu', name: 'Watu Maarufu', group: 'c2', icon: 'watu-maarufu' },
  { id: 'movie-za-bongo', name: 'Movie za Bongo', group: 'c2', icon: 'movie-za-bongo' },
  { id: 'mpira-mashabiki', name: 'Mpira & Mashabiki', group: 'c2', icon: 'mpira-mashabiki' },
  { id: 'chuo-life', name: 'Chuo Life', group: 'c2', icon: 'chuo-life' },
  { id: 'mapenzi-mahusiano', name: 'Mapenzi & Mahusiano', group: 'c2', icon: 'mapenzi-mahusiano' },
  {
    id: 'shughuli-za-familia',
    name: 'Shughuli za Familia',
    group: 'c2',
    icon: 'shughuli-za-familia',
  },

  // Group 3: East Africa & Beyond (c3 — #4F6BE0)
  {
    id: 'east-african-vibes',
    name: 'East African Vibes',
    group: 'c3',
    icon: 'east-african-vibes',
  },
  { id: 'african-icons', name: 'African Icons', group: 'c3', icon: 'african-icons' },
  { id: 'african-music', name: 'African Music', group: 'c3', icon: 'african-music' },
  { id: 'african-cities', name: 'African Cities', group: 'c3', icon: 'african-cities' },
  { id: 'pop-culture', name: 'Pop Culture', group: 'c3', icon: 'pop-culture' },
  { id: 'throwback-hits', name: 'Throwback Hits', group: 'c3', icon: 'throwback-hits' },
]

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    id: 'c1',
    titleKey: 'classicCharades',
    defaultTitle: 'Classic Charades',
    categories: CATEGORIES.filter((c) => c.group === 'c1'),
  },
  {
    id: 'c2',
    titleKey: 'bongoCulture',
    defaultTitle: 'Bongo & Tanzanian Culture',
    categories: CATEGORIES.filter((c) => c.group === 'c2'),
  },
  {
    id: 'c3',
    titleKey: 'eastAfricaBeyond',
    defaultTitle: 'East Africa & Beyond',
    categories: CATEGORIES.filter((c) => c.group === 'c3'),
  },
]

const CATEGORY_MAP = new Map<CategoryIconId, Category>(
  CATEGORIES.map((category) => [category.id, category]),
)

export function getCategoryById(id: CategoryIconId): Category | undefined {
  return CATEGORY_MAP.get(id)
}
