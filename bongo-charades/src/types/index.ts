/**
 * Bongo Charades — Shared TypeScript Types & Interfaces
 *
 * Architectural rules enforced by these types:
 * 1. AppLanguage ('en' | 'sw') is strictly separate from PromptLanguage ('en' | 'sw' | 'mixed').
 * 2. Category names are never translated; they retain their original Swahili/Tanzanian/English expressions.
 * 3. Tilt DOWN = 'correct', Tilt UP = 'pass'.
 */

/** Application UI chrome language (English by default, switchable to Kiswahili) */
export type AppLanguage = 'en' | 'sw'

/** Game prompt deck language filter (independent of AppLanguage) */
export type PromptLanguage = 'en' | 'sw' | 'mixed'

/**
 * Visual & thematic category groupings from the design system:
 * - 'c1': Classic Charades (#7060E3)
 * - 'c2': Bongo & Tanzanian Culture (#8A55E8)
 * - 'c3': East Africa & Beyond (#4F6BE0)
 */
export type CategoryGroup = 'c1' | 'c2' | 'c3'

/** Identifiers for all 26 custom 64x64 category SVG illustrations */
export type CategoryIconId =
  // Group 1: Classic Charades (c1)
  | 'animals'
  | 'movies-tv'
  | 'music-artists'
  | 'sports'
  | 'countries-places'
  | 'everyday-things'
  | 'act-it-out'
  | 'food-drinks'
  // Group 2: Bongo & Tanzanian Culture (c2)
  | 'hii-dar-yetu'
  | 'daladala-diaries'
  | 'bongo-flava'
  | 'mtaani'
  | 'vijiweni'
  | 'chakula-chetu'
  | 'watu-maarufu'
  | 'movie-za-bongo'
  | 'mpira-mashabiki'
  | 'chuo-life'
  | 'mapenzi-mahusiano'
  | 'shughuli-za-familia'
  // Group 3: East Africa & Beyond (c3)
  | 'east-african-vibes'
  | 'african-icons'
  | 'african-music'
  | 'african-cities'
  | 'pop-culture'
  | 'throwback-hits'

/** Category definition. Note: `name` is NEVER translated when AppLanguage changes. */
export interface Category {
  id: CategoryIconId
  /** Original display name (e.g., "Bongo Flava", "Daladala Diaries", "Animals") */
  name: string
  group: CategoryGroup
  icon: CategoryIconId
}

/** Category section grouping for the Categories screen */
export interface CategorySection {
  id: CategoryGroup
  titleKey: 'classicCharades' | 'bongoCulture' | 'eastAfricaBeyond'
  defaultTitle: string
  categories: Category[]
}

/** Individual charades word or phrase prompt */
export interface GamePrompt {
  id: string
  text: string
  categoryId: CategoryIconId
  language: PromptLanguage
}

/** Supported round durations in seconds */
export type RoundDuration = 30 | 60 | 90 | 120

/** Supported number of teams */
export type TeamCount = 2 | 3 | 4

/** Tilt sensor sensitivity setting */
export type TiltSensitivity = 'low' | 'medium' | 'high'

/**
 * Gameplay action triggered by physical tilt or manual fallback buttons:
 * - Tilt DOWN = 'correct'
 * - Tilt UP = 'pass'
 */
export type GameplayAction = 'correct' | 'pass'

/** User-configurable application settings (persisted in localStorage) */
export interface AppSettings {
  appLanguage: AppLanguage
  soundEnabled: boolean
  hapticFeedback: boolean
  showTiltHints: boolean
  tiltSensitivity: TiltSensitivity
}

/** Per-round game configuration selected on the Game Setup screen */
export interface GameSetupConfig {
  selectedCategoryIds: CategoryIconId[]
  isFeelingLucky: boolean
  durationSeconds: RoundDuration
  teams: TeamCount
  teamNames: string[]
  promptLanguage: PromptLanguage
}

/** Record of a single prompt outcome during a round */
export interface PlayedPromptRecord {
  prompt: GamePrompt
  outcome: GameplayAction
}

/** Summary of a completed round for the Results screen & local History */
export interface RoundResult {
  id: string
  playedAtIso: string
  categoryIds: CategoryIconId[]
  isFeelingLucky: boolean
  durationSeconds: RoundDuration
  teamName: string
  correctCount: number
  passedCount: number
  records: PlayedPromptRecord[]
}

/** Bottom navigation bar tab identifiers */
export type BottomNavTab = 'home' | 'categories' | 'create' | 'history'

/** Top-level application screen routes */
export type ScreenRoute =
  | 'home'
  | 'categories'
  | 'setup'
  | 'forehead'
  | 'countdown'
  | 'gameplay'
  | 'transition'
  | 'results'
  | 'settings'
  | 'create'
  | 'history'
  | 'design-system'
