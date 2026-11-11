import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { useCategorySelection } from './hooks/useCategorySelection'
import { useNavigation } from './hooks/useNavigation'
import { CategoriesPage } from './pages/CategoriesPage'
import { HomePage } from './pages/HomePage'
import {
  type PendingDestination,
  PendingScreenPage,
} from './pages/PendingScreenPage'
import type { Category } from './types'

export function App() {
  const nav = useNavigation('home')
  const selection = useCategorySelection()
  const [pendingDest, setPendingDest] = useState<PendingDestination>('setup')

  const handlePlayNow = () => {
    selection.deactivateFeelingLucky()
    setPendingDest('setup')
    nav.navigate('setup')
  }

  const handleFeelingLucky = () => {
    selection.activateFeelingLucky()
    setPendingDest('setup')
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
            onOpenRewards={handleOpenRewards}
            onOpenSettings={handleOpenSettings}
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
