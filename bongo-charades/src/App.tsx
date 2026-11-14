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
import { CalibrationPage } from './pages/CalibrationPage'
import { CountdownPage } from './pages/CountdownPage'
import { DebugPanel } from './components/layout/DebugPanel'
import type { CalibrationResult } from './hooks/useCalibration'
import { ForeheadReadyPage } from './pages/ForeheadReadyPage'
import { GameSetupPage } from './pages/GameSetupPage'
import { GameplayPage } from './pages/GameplayPage'
import { HomePage } from './pages/HomePage'
import { PlayModePage } from './pages/PlayModePage'
import {
  type PendingDestination,
  PendingScreenPage,
} from './pages/PendingScreenPage'
import { ResultsPage } from './pages/ResultsPage'
import { RoundTransitionPage } from './pages/RoundTransitionPage'
import { requestMotionPermission } from './services/motionPermission'
import { releaseLandscape, requestLandscape } from './services/orientation'
import type { Category, GamePrompt, GameplayAction, PlayMode, ScreenRoute } from './types'

/** Gameplay stages that are played sideways (landscape) */
const LANDSCAPE_GAME_ROUTES: ReadonlySet<ScreenRoute> = new Set([
  'forehead',
  'calibrate',
  'countdown',
  'gameplay',
])

/** Screens that only make sense while a game is in progress */
const GAME_ROUTES: ReadonlySet<ScreenRoute> = new Set([
  'forehead',
  'calibrate',
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

  /**
   * Start a game in either mode. Called directly from a tap, so we can also ask the
   * phone to switch to landscape (Android: fullscreen + lock; iPhone: not allowed,
   * the "turn your phone" screen handles it).
   */
  const startGame = (mode: PlayMode) => {
    const started = game.startGame({
      mode,
      teamNames: setup.activeTeamNames,
      categoryIds: selection.selectedCategoryIds,
      isFeelingLucky: selection.isFeelingLucky,
      promptLanguage: setup.promptLanguage,
      durationSeconds: setup.durationSeconds,
    })
    if (started) {
      void requestLandscape()
      setShowStandings(false)
      navigate('forehead')
    }
  }

  /*
   * Get Ready → calibration → countdown.
   * "I'm Ready" is a tap, so we use it to (a) ask iPhones for motion permission and
   * (b) retry the landscape lock in case the first attempt was refused. Calibration
   * starts only once the permission question has been answered.
   */
  const [motionAnswered, setMotionAnswered] = useState(false)
  const [tiltBaseline, setTiltBaseline] = useState(0)

  const handleReady = () => {
    setMotionAnswered(false)
    void requestMotionPermission().finally(() => setMotionAnswered(true))
    void requestLandscape()
    goInGame('calibrate')
  }

  const { beginCountdown } = game
  const handleCalibrated = useCallback(
    (result: CalibrationResult) => {
      setTiltBaseline(result.baseline ?? 0)
      beginCountdown()
      goInGame('countdown')
    },
    [beginCountdown, goInGame],
  )

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

  // Leaving the sideways stages (round over, results, exit) → give portrait back
  const isLandscapeStage = LANDSCAPE_GAME_ROUTES.has(nav.currentRoute)
  useEffect(() => {
    if (!isLandscapeStage) void releaseLandscape()
  }, [isLandscapeStage])

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
    void requestLandscape()
    setShowStandings(false)
    game.nextTeam()
    goInGame('forehead')
  }

  const handlePlayAgain = () => {
    void requestLandscape()
    setShowStandings(false)
    game.restart()
    goInGame('forehead')
  }

  const isQuickPlay = game.state.config?.mode === 'quick'

  const handleLeaveGame = (route: ScreenRoute) => {
    setShowStandings(false)
    game.exitGame()
    navigate(route)
  }

  // New flow: Home → Categories → Play Mode → (Quick Play | Teams setup)
  const handlePlayNow = () => {
    selection.deactivateFeelingLucky()
    nav.navigate('categories')
  }

  const handleFeelingLucky = () => {
    selection.activateFeelingLucky()
    nav.navigate('play-mode')
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
            onProceedToSetup={() => nav.navigate('play-mode')}
            onOpenRewards={handleOpenRewards}
            onOpenSettings={handleOpenSettings}
          />
        )

      case 'play-mode':
        return (
          <PlayModePage
            selectedCategories={selection.selectedCategories}
            isFeelingLucky={selection.isFeelingLucky}
            durationSeconds={setup.durationSeconds}
            promptLanguage={setup.promptLanguage}
            onDurationChange={setup.setDurationSeconds}
            onPromptLanguageChange={setup.setPromptLanguage}
            onQuickPlay={() => startGame('quick')}
            onTeams={() => nav.navigate('setup')}
            onBack={() => nav.navigate('categories')}
            blockedMessage={
              !selection.isFeelingLucky && selection.selectedCategories.length === 0
                ? 'Select at least one category first.'
                : hasPlayablePrompts
                  ? undefined
                  : 'No prompts are available for these categories yet. Please choose different categories.'
            }
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
            canAddTeam={setup.canAddTeam}
            canRemoveTeam={setup.canRemoveTeam}
            onAddTeam={setup.addTeam}
            onRemoveTeam={setup.removeTeam}
            onTeamNameChange={setup.updateTeamName}
            onPromptLanguageChange={setup.setPromptLanguage}
            onRemoveCategory={selection.removeCategory}
            onBackToCategories={() => nav.navigate('categories')}
            onBack={() => nav.navigate('play-mode')}
            backLabel="Play mode"
            onStartGame={() => startGame('teams')}
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
            isQuickPlay={isQuickPlay}
            currentTeamName={game.currentTeam.name}
            currentTeamIndex={game.state.currentTeamIndex}
            totalTeams={game.state.teams.length}
            onReady={handleReady}
            onBackToSetup={() => handleLeaveGame(isQuickPlay ? 'play-mode' : 'setup')}
            backLabel={isQuickPlay ? 'Play mode' : 'Setup'}
            onBackToHome={() => handleLeaveGame('home')}
          />
        )

      case 'calibrate':
        if (game.state.phase !== 'ready') return null
        return motionAnswered ? <CalibrationPage onCalibrated={handleCalibrated} /> : null

      case 'countdown':
        if (game.state.phase !== 'countdown') return null
        return <CountdownPage onCountdownComplete={handleCountdownComplete} />

      case 'gameplay': {
        const prompt = game.currentPrompt
        if (!prompt || !game.currentTeam || !game.state.config) return null
        return (
          <GameplayPage
            tiltBaseline={tiltBaseline}
            key={game.state.roundNumber}
            currentPrompt={prompt}
            currentCategory={getCategoryById(prompt.categoryId)}
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
            isQuickPlay={isQuickPlay}
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
      <DebugPanel />
    </ErrorBoundary>
  )
}

export default App
