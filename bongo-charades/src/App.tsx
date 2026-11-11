import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { useCategorySelection } from './hooks/useCategorySelection'
import { useGameSetup } from './hooks/useGameSetup'
import { useNavigation } from './hooks/useNavigation'
import { CategoriesPage } from './pages/CategoriesPage'
import { ForeheadReadyPage } from './pages/ForeheadReadyPage'
import { GameSetupPage } from './pages/GameSetupPage'
import { HomePage } from './pages/HomePage'
import {
  type PendingDestination,
  PendingScreenPage,
} from './pages/PendingScreenPage'
import type { Category } from './types'

export function App() {
  const nav = useNavigation('home')
  const selection = useCategorySelection()
  const setup = useGameSetup()
  const [pendingDest, setPendingDest] = useState<PendingDestination>('settings')

  const handlePlayNow = () => {
    selection.deactivateFeelingLucky()
    nav.navigate('setup')
  }

  const handleFeelingLucky = () => {
    selection.activateFeelingLucky()
    nav.navigate('setup')
  }

  const handleSelectRecentCategory = (category: Category) => {
    selection.selectCategoryFromHome(category)
    nav.navigate('categories')
  }

  const handleOpenSettings = () => {
    setPendingDest('settings')
    nav.navigate('settings')
  }

  const handleOpenRewards = () => {
    setPendingDest('rewards')
    nav.navigate('settings')
  }

  const categoriesSummaryText = selection.isFeelingLucky
    ? 'Feeling lucky? (All 26 categories)'
    : selection.selectedCategories.length > 0
      ? selection.selectedCategories.map((c) => c.name).join(', ')
      : 'None selected'

  const renderScreen = () => {
    switch (nav.currentRoute) {
      case 'home':
        return (
          <HomePage
            recentlyPlayedCategories={selection.recentlyPlayedCategories}
            onPlayNow={handlePlayNow}
            onFeelingLucky={handleFeelingLucky}
            onBrowseAllCategories={() => nav.navigate('categories')}
            onSelectRecentCategory={handleSelectRecentCategory}
            onOpenSettings={handleOpenSettings}
          />
        )

      case 'categories':
        return (
          <CategoriesPage
            selectedCategoryIds={selection.selectedCategoryIds}
            onToggleCategory={selection.toggleCategory}
            onFeelingLucky={handleFeelingLucky}
            onProceedToSetup={() => nav.navigate('setup')}
            onOpenRewards={handleOpenRewards}
            onOpenSettings={handleOpenSettings}
          />
        )

      case 'setup':
        return (
          <GameSetupPage
            selectedCategories={selection.selectedCategories}
            isFeelingLucky={selection.isFeelingLucky}
            durationSeconds={setup.durationSeconds}
            teams={setup.teams}
            teamNames={setup.teamNames}
            activeTeamNames={setup.activeTeamNames}
            promptLanguage={setup.promptLanguage}
            promptLanguageLabel={setup.promptLanguageLabel}
            isTeamNamesValid={setup.isTeamNamesValid}
            emptyTeamIndices={setup.emptyTeamIndices}
            onDurationChange={setup.setDurationSeconds}
            onTeamsChange={setup.setTeams}
            onTeamNameChange={setup.updateTeamName}
            onPromptLanguageChange={setup.setPromptLanguage}
            onRemoveCategory={selection.removeCategory}
            onBackToCategories={() => nav.navigate('categories')}
            onStartGame={() => nav.navigate('forehead')}
            onResetDefaults={setup.resetToDefaults}
          />
        )

      case 'forehead':
        return (
          <ForeheadReadyPage
            currentTeamName={setup.activeTeamNames[0] ?? 'Team 1'}
            durationSeconds={setup.durationSeconds}
            promptLanguageLabel={setup.promptLanguageLabel}
            categoriesSummary={categoriesSummaryText}
            onBackToSetup={() => nav.navigate('setup')}
            onBackToHome={() => nav.navigate('home')}
          />
        )

      case 'create':
        return (
          <PendingScreenPage
            destination="create"
            selectedCategories={selection.selectedCategories}
            isFeelingLucky={selection.isFeelingLucky}
            onBackToHome={() => nav.navigate('home')}
            onBackToCategories={() => nav.navigate('categories')}
          />
        )

      case 'history':
        return (
          <PendingScreenPage
            destination="history"
            selectedCategories={selection.selectedCategories}
            isFeelingLucky={selection.isFeelingLucky}
            onBackToHome={() => nav.navigate('home')}
            onBackToCategories={() => nav.navigate('categories')}
          />
        )

      default:
        return (
          <PendingScreenPage
            destination={pendingDest}
            selectedCategories={selection.selectedCategories}
            isFeelingLucky={selection.isFeelingLucky}
            onBackToHome={() => nav.navigate('home')}
            onBackToCategories={() => nav.navigate('categories')}
          />
        )
    }
  }

  return (
    <ErrorBoundary>
      <AppShell
        orientation={nav.isLandscape ? 'landscape' : 'portrait'}
        activeNavTab={nav.activeNavTab}
        onSelectNavTab={nav.selectNavTab}
        showBottomNav={nav.showBottomNav}
      >
        {renderScreen()}
      </AppShell>
    </ErrorBoundary>
  )
}

export default App
