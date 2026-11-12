# Bongo Charades — Application Architecture

## 1. Technical Stack & Guiding Principles
- **Framework**: React 19 + TypeScript (~7.0) + Vite 8.
- **Styling**: CSS variables and utility classes in `src/styles/design-tokens.css` plus inline styles (no Tailwind).
- **Testing**: Vitest for unit tests (`npm test`), and an optional Playwright browser script in `tests/e2e/`.
- **Local-First Architecture**: Zero mandatory backend for the initial release. All categories, prompts, user settings, recently played categories, and local game history are stored and run client-side (`localStorage` + static TypeScript data modules).
- **Strict Separation of Concerns**:
  - **UI Components** (`src/components/`) are pure and reusable.
  - **Screens / Pages** (`src/pages/`) assemble components for each stage of the user journey.
  - **Game Content** (`src/data/`) holds category metadata and prompt decks completely decoupled from React components.
  - **Game & Sensor Logic** (`src/hooks/`, `src/services/`) encapsulates countdowns, round timers, deck shuffling, device orientation (tilt detection), audio/haptics, and persistence.
  - **Localization** (`src/i18n/`) separates **App Interface Language** (`en` | `sw`) from **Game Prompt Language** (`en` | `sw` | `mixed`), while keeping category names untranslated.

---

## 2. Actual Directory Structure (verified 2026-11-11)

> The original plan listed `src/i18n/`, `src/state/`, `services/storage.ts` and others. These **do not exist yet**. The tree below is what is actually in the repo.

```text
bongo-charades/
├── design/reference/            # Claude Design master PDF + HTML export (visual source of truth)
├── public/fonts/                # Self-hosted Baloo 2 & Nunito Sans (+ OFL licence)
├── src/
│   ├── App.tsx                  # Screen routing + wires game-session actions to screens
│   ├── components/
│   │   ├── illustrations/       # SvgGradients, CategoryIcon (26 icons + dice + forehead), UiIcons
│   │   ├── ui/                  # PrimaryButton, SecondaryButton, CategoryCard, FeaturedCard, Panel, …
│   │   ├── layout/              # AppShell (portrait/landscape), BottomNav, ErrorBoundary
│   │   └── gameplay/            # TimerPill, FeedbackIcon, RotateDevicePrompt (+ ScorePill, TiltButton: unused since pre-Phase 5)
│   ├── data/
│   │   ├── categories.ts        # 26 categories, names never translated
│   │   ├── prompts.ts           # Prompt bank (GENERATED from scripts/content/build_prompts.py)
│   │   │                        #   + selectPromptVariants / getFilteredPrompts
│   │   └── prompts.test.ts      # Content validation (duplicates, language rules, counts)
│   ├── game/                    # ★ Pure game logic — no React, fully unit-tested
│   │   ├── gameSession.ts       # Game rules reducer: phases, scoring, team rotation, ranking
│   │   ├── promptDeck.ts        # Seeded shuffle, no-repeat deck
│   │   ├── tilt.ts              # Screen-facing angle maths + tilt state machine
│   │   └── *.test.ts            # Vitest unit tests
│   ├── hooks/
│   │   ├── useGameSession.ts    # React wrapper around gameSession reducer
│   │   ├── useGameSetup.ts      # Team list (2 default, add/remove up to 8), duration, language (localStorage)
│   │   ├── useIsPortraitPhone.ts # true when a touch device is held upright
│   │   ├── useCategorySelection.ts
│   │   ├── useNavigation.ts     # Hash routing (#home, #gameplay …), push vs replace
│   │   ├── useCountdown.ts      # 3-2-1-GO!
│   │   ├── useGameTimer.ts      # Drift-free round timer, pause support, hasExpired()
│   │   └── useTiltControls.ts   # deviceorientation listener → game/tilt.ts
│   ├── services/
│   │   ├── motionPermission.ts  # iOS motion permission + support check
│   │   ├── orientation.ts       # Fullscreen + landscape lock / release (where the platform allows)
│   │   └── soundEffects.ts      # Web Audio synthesized sounds
│   ├── pages/                   # Home, Categories, PlayMode, GameSetup, ForeheadReady, Countdown,
│   │                            # Gameplay, RoundTransition, Results, PendingScreen
│   ├── styles/design-tokens.css
│   └── types/index.ts
├── scripts/content/build_prompts.py  # Human-friendly prompt source → src/data/prompts.ts
├── docs/content/CONTENT_DIRECTION.md # Content rules, research ledger, review list
└── tests/e2e/full-game-flow.mjs # Playwright end-to-end browser simulation (optional, see file header)
```

---

## 2b. How a game works (data flow)

Think of `gameSession.ts` as the **referee**. The screens never change scores themselves. They only *tell the referee what happened*, and the referee decides what that means.

Two modes, one engine: `config.mode` is `'quick'` or `'teams'`. Quick Play is simply a game with **one participant**, so scoring, the deck, timers and feedback are shared, and only the screens around it differ (no setup, single-score results).

```
Play Mode ──Quick Play──┐
Game Setup ─Start Game──┴─startGame(config)──▶ phase "ready"   (#forehead)  + requestLandscape()
"I'm Ready" ──beginCountdown()──▶ phase "countdown"      (#countdown)
countdown done ──beginRound()───▶ phase "playing"        (#gameplay)
tap/tilt ──answer(action, promptId)──▶ score + next prompt   (ignored if not playing or wrong prompt)
timer 0 ──timeUp()──▶ "roundOver" (#transition)  or  "finished" (#results) if last team
"Start next turn" ──nextTeam()──▶ "ready" for the next team
"Play Again" ──restart()──▶ same teams/settings, scores reset
leave the game screens ──exitGame()──▶ "idle"
```

Rules worth knowing:
- **The URL follows the game, not the other way round.** In-game screens use `history.replaceState`, so the browser Back button leaves the game instead of rewinding it. Opening an in-game URL with no game running redirects to Setup.
- **Duplicate protection lives in three places:** the reducer only scores the prompt currently on screen; gameplay has a 400 ms answer lock; tilt needs a return to upright plus a 700 ms cooldown.
- **Each round's Gameplay screen is mounted fresh** (React `key={roundNumber}`), so timers can't leak between rounds.
- A game in progress is **not persisted**; refreshing mid-game ends it.
- **Orientation:** `requestLandscape()` runs inside the starting tap (fullscreen → `screen.orientation.lock('landscape')`, touch devices only). An effect in `App.tsx` calls `releaseLandscape()` whenever the route leaves forehead/countdown/gameplay. On a phone held upright, those three screens render `RotateDevicePrompt`: the countdown restarts and the round timer and tilt pause.
- **Answer feedback:** `GameplayPage` scores immediately, then shows only the full-screen feedback for `FEEDBACK_MS` (800 ms); all input is ignored until it ends.
- In development builds the current game state is exposed as `window.__bongoGame` for browser tests.

---

## 3. Core Technical Subsystems

### A. Device Orientation & Tilt Detection (`game/tilt.ts` + `useTiltControls`)
1. **Permission**: `requestMotionPermission()` (`services/motionPermission.ts`) is called directly inside the **"I'm Ready"** tap, which iOS 13+ requires. Android and desktop don't ask. Tilt events are only delivered on **https** pages.
2. **Angle**: we compute how far the *screen* faces up or down: `elevation = asin(cos β · cos γ)`. +90° = screen to ceiling, 0° = upright (forehead position), −90° = screen to floor. It's the same in either landscape direction, with no ±90° jump.
3. **State machine** (`processTiltReading`):
   - Starts in *waiting for upright*, so a phone that is already tilted when the round starts never fires.
   - |elevation| < dead-zone (20°) → armed.
   - elevation ≤ −35° → **Correct**; ≥ +35° → **Pass** (medium sensitivity), then waits for upright again plus a 700 ms cooldown.
4. **Single listener**: attached while a round is active, removed on cleanup. The latest callback is kept in a ref, so prompt changes don't re-attach it.
5. **Fallback**: Pass ↑ / Correct ↓ buttons are always on screen.
6. **Status**: unit-tested and browser-simulated; **real-device verification pending**.

### B. Orientation & Viewport Handling (`AppShell`)
- Portrait screens (`Home`, `Categories`, `Game Setup`, `Results`, `Settings`) render in a mobile-first vertical layout (`max-width: 440px` centred on desktop, 3-column category grid on tablet `600–1023px`).
- Landscape screens (`Forehead Positioning`, `Countdown`, `Gameplay`) render in a horizontal layout:
  - Starting a game requests fullscreen + landscape lock (works on Android browsers; iPhone/iPad Safari don't allow it). Touch devices held upright see a full-screen "Turn your phone sideways" prompt on the gameplay stages. Lock and fullscreen are released when gameplay ends.
  - The between-team transition screen and Results are portrait layouts.

### C. Backend & Database Strategy
- **Phase 1 (Current)**: 100% client-side. No Firebase or external database is introduced. This keeps hosting free, offline-capable, fast, and zero-maintenance.
- **Future Phases**: Data access is isolated behind `src/services/` so that if remote prompt updates, cloud history sync, or multiplayer rooms are desired later, a lightweight backend (such as Supabase or Firebase) can be plugged in without rewriting UI components.
