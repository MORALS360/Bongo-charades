# Bongo Charades — Application Architecture

## 1. Technical Stack & Guiding Principles
- **Framework**: React 19 + TypeScript (~7.0) + Vite 8.
- **Styling**: CSS variables and utility classes in `src/styles/design-tokens.css` plus inline styles (no Tailwind).
- **Testing**: Vitest for unit tests (`npm test`), and an optional Playwright browser script in `tests/e2e/`.
- **Local-First Architecture**: Zero mandatory backend for the initial release. All categories, prompts, user settings, recently played categories, recently played prompt ideas and local game history are stored and run client-side (`localStorage` + static TypeScript data modules).
- **Strict Separation of Concerns**:
  - **UI Components** (`src/components/`) are pure and reusable.
  - **Screens / Pages** (`src/pages/`) assemble components for each stage of the user journey.
  - **Game Content** (`src/data/`) holds category metadata and prompt decks completely decoupled from React components.
  - **Game & Sensor Logic** (`src/hooks/`, `src/services/`) encapsulates countdowns, round timers, deck shuffling, device orientation (tilt detection), audio/haptics, and persistence.
  - **Localization** (`src/i18n/`) separates **App Interface Language** (`en` | `sw`) from **Game Prompt Language** (`en` | `sw` | `mixed`), while keeping category names untranslated.

---

## 2. Actual Directory Structure (verified 2026-11-14, Phase 5)

> The original plan listed `src/i18n/`, `src/state/`, `services/storage.ts` and others. These **do not exist yet**. The tree below is what is actually in the repo.

```text
bongo-charades/
├── design/reference/            # Claude Design master PDF + HTML export (visual source of truth)
├── public/fonts/                # Self-hosted Baloo 2 & Nunito Sans (+ OFL licence)
├── src/
│   ├── App.tsx                  # Screen routing + wires game-session actions to screens
│   ├── components/
│   │   ├── illustrations/       # SvgGradients, CategoryIcon (26 icons + dice + forehead), UiIcons
│   │   ├── ui/                  # PrimaryButton, SecondaryButton, CategoryCard, FeaturedCard, Panel,
│   │   │                        #   RecentPromptsControl ("Forget" recently played prompts), …
│   │   ├── layout/              # AppShell (portrait/landscape), BottomNav, ErrorBoundary
│   │   └── gameplay/            # TimerPill, FeedbackIcon, RotateDevicePrompt (+ ScorePill, TiltButton: unused since pre-Phase 5)
│   ├── config/
│   │   ├── gameplay.ts          # ★ ALL tuning numbers: feedback time, tilt thresholds, calibration
│   │   └── dealing.ts           # ★ Dealing numbers: history size (600), balance rules, lookahead
│   ├── data/
│   │   ├── categories.ts        # 29 categories, names never translated
│   │   ├── promptBank.ts        # GENERATED prompt bank (4,179 prompts), one array per category. Never edit by hand
│   │   ├── prompts.ts           # PROMPTS + selectPromptVariants / getFilteredPrompts
│   │   └── prompts.test.ts      # Content validation (counts, duplicates, hints, metadata, language rules)
│   ├── game/                    # ★ Pure game logic — no React, fully unit-tested
│   │   ├── gameSession.ts       # Game rules reducer: phases, scoring, team rotation, ranking
│   │   ├── promptDeck.ts        # Seeded Fisher–Yates shuffle, no-repeat deck shared by all teams
│   │   ├── dealing.ts           # Deal order: fresh before recently played, balanced (no clumps)
│   │   ├── playHistory.ts       # Recently played ideas, saved on the phone (localStorage)
│   │   ├── tilt.ts              # Screen-facing angle maths, calibration, relative gesture tracker
│   │   └── *.test.ts            # Vitest unit tests
│   ├── hooks/
│   │   ├── useGameSession.ts    # React wrapper around gameSession reducer
│   │   ├── useGameSetup.ts      # Team list (2 default, add/remove up to 8), duration, language (localStorage)
│   │   ├── useIsPortraitPhone.ts # true when a touch device is held upright
│   │   ├── useCategorySelection.ts
│   │   ├── useNavigation.ts     # Hash routing (#home, #gameplay …), push vs replace
│   │   ├── useCountdown.ts      # 3-2-1-GO!
│   │   ├── useGameTimer.ts      # Drift-free round timer, pause support, hasExpired()
│   │   ├── useCalibration.ts    # "Hold still…" stage → player's neutral angle
│   │   └── useTiltControls.ts   # deviceorientation listener → game/tilt.ts (relative to baseline)
│   ├── services/
│   │   ├── motionPermission.ts  # iOS motion permission + support check
│   │   ├── orientation.ts       # Fullscreen + landscape lock / release (see docs/ORIENTATION.md)
│   │   ├── debug.ts             # ?debug=1 diagnostics data (DebugPanel shows it)
│   │   └── soundEffects.ts      # Web Audio synthesized sounds
│   ├── pages/                   # Home, Categories, PlayMode, GameSetup, ForeheadReady, Calibration, Countdown,
│   │                            # Gameplay, RoundTransition, Results, PendingScreen
│   ├── styles/design-tokens.css
│   └── types/index.ts
├── scripts/content/
│   ├── check_candidates.py      # Checks the curated lists; writes curation tables + owner tick-lists
│   └── build_prompts.py         # Curated lists → src/data/promptBank.ts
├── docs/content/
│   ├── research/curation/<group>/<category>.txt  # ★ THE editable source of all prompts (29 files)
│   ├── research/SOURCES.md      # Source registry (57 sources)
│   ├── PHASE_5_*.md             # Strategy, research report, content audit
│   └── CONTENT_DIRECTION.md     # Earlier content rules (pre-Phase 5)
└── tests/e2e/full-game-flow.mjs # Playwright end-to-end browser simulation (optional, see file header)
```

---

## 2b. How a game works (data flow)

Think of `gameSession.ts` as the **referee**. The screens never change scores themselves. They only *tell the referee what happened*, and the referee decides what that means.

Two modes, one engine: `config.mode` is `'quick'` or `'teams'`. Quick Play is simply a game with **one participant**, so scoring, the deck, timers and feedback are shared, and only the screens around it differ (no setup, single-score results).

```
Play Mode ──Quick Play──┐
Game Setup ─Start Game──┴─startGame(config)──▶ phase "ready"   (#forehead)  + requestLandscape()
"I'm Ready" ── (#calibrate: "Hold still…", phase stays "ready") ── calibrated ──
             ──beginCountdown()──▶ phase "countdown"      (#countdown)
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

## 2c. Prompt content and dealing (Phase 5)

**Where prompts come from.** The curated lists in `docs/content/research/curation/` are the only source. `scripts/content/build_prompts.py` turns them into `src/data/promptBank.ts`, with one array per category (a single 4,000-item array made TypeScript fail with "union type too complex"). Each prompt has:
- a stable content-based `id`, such as `anim-lion-en` or `bf-pawa`;
- `text`, `categoryId`, `language`;
- optionally `concept` (links translation pairs) and `hint`;
- `difficulty`, `kind`, `shelf`;
- optionally `era`, `longTitle`, `needsReview`.

Sources and confidence stay in the research files and are not shipped.

**How a game's pile is built** (`game/dealing.ts`, numbers in `config/dealing.ts`):
1. `getFilteredPrompts` picks one language version per idea for the chosen categories.
2. `dealOrder` does a Fisher–Yates shuffle with a fresh seed.
3. Ideas found in the phone's history (`game/playHistory.ts`, key `bongo-charades:recent-prompts:v1`, last 600 ideas) go to the bottom, oldest first. Nothing is removed, so small categories never run dry.
4. `balanceOrder` breaks up clumps. When the next card would break a rule, it looks up to 20 cards ahead for one that fits:
   - the same artist within 6 prompts;
   - 3 of a minority kind in a row;
   - 3 from one decade in a row;
   - 3 hard prompts in a row;
   - 3 from one category in a row, when several categories are chosen.
5. All teams play from this one pile (`gameSession` reducer). After it is used up, it is reshuffled and balanced again, and never starts with the last card shown.

`useGameSession` loads the history when a game starts or restarts, and records every prompt the moment it appears on screen. Storage failures are ignored: the game then simply plays without history.

---

## 3. Core Technical Subsystems

### A. Device Orientation, Calibration & Tilt Detection (`game/tilt.ts`, `config/gameplay.ts`)
1. **Permission**: `requestMotionPermission()` is called inside the **"I'm Ready"** tap (required on iPhone). Calibration starts once that question is answered. Sensors only work on **https** pages.
2. **Angle**: `elevation = asin(cos β · cos γ)`: +90° screen to ceiling, 0° upright, −90° screen to floor. It's the same in either landscape direction, with no ±90° jump.
3. **Calibration** (`#calibrate`, before the countdown): after a 0.7 s settle delay, wait until readings stay within 6° for 0.6 s **and** are within 35° of upright. Their average becomes the player's **baseline**. Timeout after 5 s → baseline 0. No sensor data within 1.5 s → skip (manual fallback). Calibration never touches the timer or the score; it runs again for each team's turn.
4. **Gesture tracker** (`processTiltReading`): smoothed elevation (EMA) − baseline = relative angle.
   - relative ≤ −30° held 70 ms → **Correct**; ≥ +30° held 70 ms → **Pass** (medium preset).
   - Then waits until |relative| < 12° (**hysteresis**) plus a 500 ms cooldown before re-arming.
   - While resting at neutral, the baseline follows slow posture drift (1% per reading).
5. **Single listener** per round, with the callback held in a ref.
6. **Fallback**: small Pass/Correct buttons appear only if no motion data arrives; keyboard ↓/Enter, ↑.
7. **Tuning**: all values live in `src/config/gameplay.ts`; `?debug=1` shows live angles on the phone.

### B. Orientation & Viewport Handling (`AppShell`)
- Portrait screens (`Home`, `Categories`, `Game Setup`, `Results`, `Settings`) render in a mobile-first vertical layout (`max-width: 440px` centred on desktop, 3-column category grid on tablet `600–1023px`).
- Landscape screens (`Forehead Positioning`, `Countdown`, `Gameplay`) render in a horizontal layout:
  - Starting a game requests fullscreen + landscape lock (works on Android browsers; iPhone/iPad Safari don't allow it). Touch devices held upright see a full-screen "Turn your phone sideways" prompt on the gameplay stages. Lock and fullscreen are released when gameplay ends.
  - The between-team transition screen and Results are portrait layouts.

### C. Backend & Database Strategy
- **Phase 1 (Current)**: 100% client-side. No Firebase or external database is introduced. This keeps hosting free, offline-capable, fast, and zero-maintenance.
- **Future Phases**: Data access is isolated behind `src/services/` so that if remote prompt updates, cloud history sync, or multiplayer rooms are desired later, a lightweight backend (such as Supabase or Firebase) can be plugged in without rewriting UI components.
