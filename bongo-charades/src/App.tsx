import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { getCategoryById } from './data/categories'
import { getFilteredPrompts } from './data/prompts'
import { useCategorySelection } from './hooks/useCategorySelection'
import { useGameSession } from './hooks/useGameSession'
import { useGameSetup } from './hooks/useGameSetup'
import { useNavigation } from './hooks/useNavigation'
import { CategoriesPage } from './pages/CategoriesPage'
import { CountdownPage } from './pages/CountdownPage'
import { ForeheadReadyPage } from './pages/ForeheadReadyPage'
import { GameSetupPage } from './pages/GameSetupPage'
import { GameplayPage } from './pages/GameplayPage'
import { HomePage } from './pages/HomePage'
import {
  type PendingDestination,
  PendingScreenPage,
} from './pages/PendingScreenPage'
import { ResultsPage } from './pages/ResultsPage'
import { RoundTransitionPage } from './pages/RoundTransitionPage'
import { requestMotionPermission } from './services/motionPermission'
import type { Category, GamePrompt, GameplayAction, ScreenRoute } from './types'

/** Screens that only make sense while a game is in progress */
const GAME_ROUTES: ReadonlySet<ScreenRoute> = new Set([
  'forehead',
  'countdown',
  'gameplay',
  'transition',
  'results',
])

export function App() {
  const nav = useNavigation('home')
  const selection = useCategorySelection()
  const setup = useGameSetup()
  const game = useGameSession()
  const [pendingDest, setPendingDest] = useState<PendingDestination>('settings')
  const [showStandings, setShowStandings] = useState(false)

  /* ------------------------------------------------------------------
   * Game flow wiring
   * Each in-game button calls ONE game-session function and then shows the
   * matching screen. In-game screens use `replace` so the browser Back button
   * leaves the game instead of rewinding a countdown.
   * ------------------------------------------------------------------ */
  const { navigate } = nav
  const goInGame = useCallback(
    (route: ScreenRoute) => navigate(route, { replace: true }),
    [navigate],
  )

  // Can the current setup actually produce prompts? (handles empty categories)
  const hasPlayablePrompts = useMemo(
    () =>
      getFilteredPrompts(
        selection.selectedCategoryIds,
        selection.isFeelingLucky,
        setup.promptLanguage,
      ).length > 0,
    [selection.selectedCategoryIds, selection.isFeelingLucky, setup.promptLanguage],
  )

  const handleStartGame = () => {
    const started = game.startGame({
      teamNames: setup.activeTeamNames,
      categoryIds: selection.selectedCategoryIds,
      isFeelingLucky: selection.isFeelingLucky,
      promptLanguage: setup.promptLanguage,
      durationSeconds: setup.durationSeconds,
    })
    if (started) {
      setShowStandings(false)
      navigate('forehead')
    }
  }

  const handleReady = () => {
    // Must be called directly inside the tap so iPhones show the motion permission prompt.
    // We don't wait for the answer: manual Correct/Pass buttons always work as a fallback.
    void requestMotionPermission()
    game.beginCountdown()
    goInGame('countdown')
  }

  const { beginRound, answer, timeUp } = game
  const handleCountdownComplete = useCallback(() => {
    beginRound()
    goInGame('gameplay')
  }, [beginRound, goInGame])

  const handleAnswer = useCallback(
    (action: GameplayAction, prompt: GamePrompt) => answer(action, prompt.id),
    [answer],
  )

  // The reducer decides whether this was the last team; the effect below
  // then shows either the transition screen or the final results.
  const handleRoundTimeUp = timeUp

  // Keep the screen in step with the game phase after a round ends
  useEffect(() => {
    if (nav.currentRoute !== 'gameplay') return
    if (game.state.phase === 'roundOver') goInGame('transition')
    if (game.state.phase === 'finished') goInGame('results')
  }, [game.state.phase, nav.currentRoute, goInGame])

  // Guard: if someone opens an in-game screen with no game running (e.g. page
  // refresh or a bookmarked #gameplay link), send them back to Game Setup.
  // And if they leave the game screens (Back button, bottom nav), end the game.
  const { isActive, exitGame } = game
  useEffect(() => {
    const onGameRoute = GAME_ROUTES.has(nav.currentRoute)
    if (onGameRoute && !isActive) navigate('setup', { replace: true })
    if (!onGameRoute && isActive) exitGame()
  }, [nav.currentRoute, isActive, navigate, exitGame])

  const handleNextTeam = () => {
    setShowStandings(false)
    game.nextTeam()
    goInGame('forehead')
  }

  const handlePlayAgain = () => {
    setShowStandings(false)
    game.restart()
    goInGame('forehead')
  }

  const handleLeaveGame = (route: ScreenRoute) => {
    setShowStandings(false)
    game.exitGame()
    navigate(route)
  }

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
            onStartGame={handleStartGame}
            onResetDefaults={setup.resetToDefaults}
            startBlockedMessage={
              hasPlayablePrompts
                ? undefined
                : 'No prompts are available for these categories yet. Please choose different categories.'
            }
          />
        )

      case 'forehead':
        if (!game.currentTeam || game.state.phase !== 'ready') return null
        return (
          <ForeheadReadyPage
            currentTeamName={game.currentTeam.name}
            currentTeamIndex={game.state.currentTeamIndex}
            totalTeams={game.state.teams.length}
            durationSeconds={setup.durationSeconds}
            promptLanguageLabel={setup.promptLanguageLabel}
            categoriesSummary={categoriesSummaryText}
            onReady={handleReady}
            onBackToSetup={() => handleLeaveGame('setup')}
            onBackToHome={() => handleLeaveGame('home')}
          />
        )

      case 'countdown':
        if (game.state.phase !== 'countdown') return null
        return <CountdownPage onCountdownComplete={handleCountdownComplete} />

      case 'gameplay': {
        const prompt = game.currentPrompt
        if (!prompt || !game.currentTeam || !game.state.config) return null
        return (
          <GameplayPage
            key={game.state.roundNumber}
            currentPrompt={prompt}
            currentCategory={getCategoryById(prompt.categoryId)}
            currentTeamName={game.currentTeam.name}
            currentScore={game.currentTeam.score}
            roundDurationSeconds={game.state.config.durationSeconds}
            onAnswer={handleAnswer}
            onRoundTimeUp={handleRoundTimeUp}
          />
        )
      }

      case 'transition': {
        if (game.state.phase !== 'roundOver' || !game.currentTeam || !game.upcomingTeam) return null
        if (showStandings) {
          return (
            <ResultsPage
              mode="standings"
              teamScores={game.state.teams.map((t) => ({ ...t, teamName: t.name }))}
              onBackToGame={() => setShowStandings(false)}
              onPlayAgain={handlePlayAgain}
              onBackToCategories={() => handleLeaveGame('categories')}
              onReturnHome={() => handleLeaveGame('home')}
            />
          )
        }
        return (
          <RoundTransitionPage
            completedTeamName={game.currentTeam.name}
            completedTeamScore={game.currentTeam.score}
            correctCount={game.roundSummary.correctCount}
            passedCount={game.roundSummary.passedCount}
            nextTeamName={game.upcomingTeam.name}
            nextTeamIndex={game.state.currentTeamIndex + 1}
            totalTeams={game.state.teams.length}
            onStartNextTurn={handleNextTeam}
            onViewStandings={() => setShowStandings(true)}
          />
        )
      }

      case 'results':
        if (game.state.phase !== 'finished') return null
        return (
          <ResultsPage
            teamScores={game.state.teams.map((t) => ({ ...t, teamName: t.name }))}
            onPlayAgain={handlePlayAgain}
            onBackToCategories={() => handleLeaveGame('categories')}
            onReturnHome={() => handleLeaveGame('home')}
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
