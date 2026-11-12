# Bongo Charades — Pre-Phase 5 Refinement Report

**Date:** 2026-11-12 · **Branch:** `phase-4-polish` (from `phase-4-audit` @ `200d9ed`) · **Phase 5:** not started

## 1. What was implemented

| # | Request | What was built |
|---|---|---|
| 1 | Automatic landscape | Starting a game (Start Game, Quick Play, Start next team, Play Again) asks for **fullscreen + `screen.orientation.lock('landscape')`** on touch devices. Leaving the sideways stages (round over, results, exit) **unlocks and exits fullscreen**. When the phone is upright and can't be rotated automatically (iPhone, or a refused lock), a **"Turn your phone sideways"** screen replaces the Ready screen and countdown. During a round it **pauses the timer** and tilt. |
| 2 | Quick Play + Teams | New **Play Mode** screen after Categories. **Quick Play:** no teams, one shared score, straight to the game, single-score results. **Teams:** the existing Game Setup. Teams now start at **2 and can be added or removed (up to 8)**. Both modes use the **same game engine**: Quick Play is a game with one participant, so no gameplay code is duplicated. |
| 3 | Instructions before the round | The countdown stage now shows big tiles, **↓ TILT DOWN = CORRECT** (green) and **↑ TILT UP = PASS** (red), beside the 3-2-1-GO countdown, before every round. |
| 3 | Clean prompt screen | Gameplay shows only the **timer, category label and prompt** (plus a small artist hint for songs). The permanent Pass/Correct buttons, score pill and team badge were removed. **Fallback:** small Pass/Correct buttons appear *only* if no motion data arrives within 1.5 s (desktop, permission denied, unsupported). **Keyboard:** ↓/Enter = Correct, ↑ = Pass. |
| 4 | Full-screen feedback | A tilt or tap immediately shows a **full-screen green ✓ CORRECT** or **red ⏩ PASS** for **800 ms**. The next prompt is not rendered underneath, and all input is ignored until the feedback ends. |
| 5 | Categories | **Vijiweni removed** and its best prompts merged into **Mtaani**. **Zilipendwa added** (24 Tanzanian throwback songs, 1970s → ~2015, artist shown as a hint) with a new vintage-radio illustration in the existing SVG style. |
| 6–7 | Content identity and language | The whole bank was re-sorted by group identity and rewritten for playability: 268 → **389 distinct prompt ideas** (470 entries, because 81 Classic and East-Africa ideas have both an English and a Kiswahili version and only one is dealt per game). The growth mostly comes from translation pairs plus the new Zilipendwa category; the deeper research expansion is still Phase 5. Classic is now universal and English-led with matching Kiswahili pairs. Bongo is Kiswahili-led. East Africa & Beyond is Africa-wide. See `docs/content/CONTENT_DIRECTION.md`. |
| 8 | Visual consistency | Root cause: on phones, the background gradient stretched over the full scroll height, so long screens faded to pale lavender. It's now **pinned to the screen** on every page. Panels use the same deep-purple tint, card border and drop shadow as Home's cards instead of thin white. The Play Mode cards reuse the Home "Feeling lucky" gradient and the category-card purple. No new colours: feedback green and red come from the design's existing `#G`/`#R` illustration gradients. |

## 2. Files changed
**New:** `src/pages/PlayModePage.tsx`, `src/services/orientation.ts`, `src/hooks/useIsPortraitPhone.ts`, `src/components/gameplay/RotateDevicePrompt.tsx`, `src/components/gameplay/FeedbackIcon.tsx`, `src/data/prompts.test.ts`, `scripts/content/build_prompts.py`, `docs/content/CONTENT_DIRECTION.md`, this report.
**Changed:** `src/App.tsx`, `src/game/gameSession.ts` (+ tests), `src/game/promptDeck.test.ts`, `src/game/tilt.test.ts`, `src/hooks/useGameSession.ts`, `src/hooks/useGameSetup.ts`, `src/hooks/useGameTimer.ts` (pause support), `src/hooks/useNavigation.ts`, `src/pages/GameplayPage.tsx`, `CountdownPage.tsx`, `ForeheadReadyPage.tsx`, `ResultsPage.tsx`, `GameSetupPage.tsx`, `CategoriesPage.tsx`, `src/data/prompts.ts`, `src/data/categories.ts`, `src/types/index.ts`, `src/components/illustrations/CategoryIcon.tsx`, `src/styles/design-tokens.css`, `vite.config.ts`, `tests/e2e/full-game-flow.mjs`, `PRODUCT_BRIEF.md`, `ARCHITECTURE.md`, `DESIGN_HANDOFF.md`, `DEVELOPMENT_ROADMAP.md`, `PROJECT_STATUS.md`.
**Now unused but kept:** `TiltButton.tsx` and `ScorePill.tsx` (design-system components that may return in Settings/Phase 6).

## 3. Platform limitations (automatic landscape)
| Platform | What happens |
|---|---|
| **Android Chrome / Samsung Internet** | Fullscreen + landscape lock should rotate the phone automatically. The lock only works in fullscreen, and the user can swipe out of fullscreen, which also releases the lock. |
| **iPhone (Safari and every iPhone browser)** | **A website cannot rotate or lock the screen, and iPhones don't allow fullscreen for web pages.** The app shows "Turn your phone sideways" and continues as soon as the player rotates. If the phone's **rotation lock** (Control Centre) is on, the player has to turn it off; the app can't detect it. |
| **iPad Safari** | Lock isn't supported; same fallback as iPhone. |
| **Installed PWA (Phase 7)** | Android installed PWAs can lock without fullscreen. Configuring a manifest is Phase 7 work. |
| **Desktop** | No fullscreen or lock is attempted. Desktop browsers are never shown the rotate screen. |

Tilt detection isn't affected by rotation. The maths uses which way the screen faces, so it doesn't depend on screen orientation (unit-tested for both landscape directions).

## 4. Test results
| Kind | Result |
|---|---|
| Unit tests (Vitest): game rules, Quick Play, 2–8 teams, deck, language selection, tilt, content validation | **53 / 53 pass** |
| Browser simulation (Playwright, fake clock, `tests/e2e/full-game-flow.mjs`) | **33 / 33 pass** (run 3× in a row). Covers both modes end-to-end, adding a team, instruction stage, clean prompt screen, green/red feedback timing (prompt hidden at 100 ms and 600 ms, shown after 800 ms), an input during feedback ignored, one tilt = one answer, manual fallback appears only without sensor data, late answer rejected, tie handling, Quick Play results, simulated phone: fullscreen + lock requested, rotate screen when upright, **timer paused for 10 s while upright**, unlock at results |
| Production build (`tsc -b && vite build`) | ✅ |
| Lint (oxlint) | ✅ 0 warnings |
| Visual comparison (screenshots of Home, Categories scrolled, Play Mode, Setup, Forehead, Instructions, Gameplay, Feedback, Transition, Results) | ✅ consistent purple background and card styling throughout |

The simulated orientation test replaces the browser's lock and fullscreen functions with recorders, because a desktop test browser can't physically rotate. It proves *when* the app asks; it does not prove that a phone obeys.

## 5. Real-device tests you still need to do
Use your Cloudflare tunnel (https). `vite.config.ts` now accepts **any** `*.trycloudflare.com` address, so a new tunnel URL won't need a config edit.
1. **Android Chrome:** tap Quick Play → the phone should go fullscreen and rotate to landscape by itself. Finish the game → it should return to portrait and leave fullscreen.
2. **iPhone Safari:** tap Quick Play with the phone upright → "Turn your phone sideways" → rotate → Ready screen appears. (Rotation lock in Control Centre must be off.)
3. Mid-round, turn the phone upright → "Round paused", the timer stops → rotate back, and it continues.
4. Tilt down → full green CORRECT; tilt up → full red PASS; the next prompt appears only afterwards; holding the tilt gives one answer only.
5. Deny motion permission on iPhone → small Pass/Correct buttons appear after about 1.5 s.
6. Teams with 4–6 teams on a real phone: names readable on the results screen.
7. Read through the new prompts with friends, especially the `needsReview` list in `docs/content/CONTENT_DIRECTION.md` §6.

## 6. Recommendation
The refinement stage is **implemented and verified in the browser**. I recommend starting Phase 5 **after** device tests 1–5 pass, mainly to confirm Android auto-rotation and the iPhone fallback, and after you've skimmed the review list in the content doc. Nothing in Phase 5 depends on new app code, so device testing and Phase 5 research could also run side by side if you prefer.
