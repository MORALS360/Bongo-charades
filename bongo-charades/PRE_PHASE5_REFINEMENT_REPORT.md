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

---

# Second refinement pass (2026-11-13)

Branch: `phase-4-polish` (continues from `b773f95`). Phase 5 still not started.

## 1. What was implemented
| # | Request | Implementation |
|---|---|---|
| 1 | Better automatic landscape | Lock is now attempted **twice**: on the start tap and again on **I'm Ready** (both taps), so a refused or lost lock is retried. The app is now **installable**: `manifest.webmanifest` uses `display: "fullscreen"`, with real app icons and an iOS home-screen icon. On Android the installed app locks landscape without the extra fullscreen step; this is the most reliable route. Fallback "Turn your phone sideways" screen unchanged; it now also covers calibration. New `?debug=1` diagnostics strip shows the lock result on a real phone. Full platform matrix in `docs/ORIENTATION.md`. |
| 2 | Tilt calibration and sensitivity | New flow: **Get Ready → I'm Ready → "Hold still…" calibration → 3-2-1-GO → play.** Calibration waits about 0.7 s for the phone to be lifted, then records the angle once it's held **still** (spread ≤ 6° for 0.6 s) and **roughly upright** (a phone lying flat in a hand is rejected). That angle becomes the player's **neutral**. It falls back to upright after 5 s, or skips straight to the countdown if there's no sensor (manual buttons take over). Gestures are measured **relative to neutral**. Readings are **smoothed**, and a tilt must be **held ~70 ms** (ignores single spikes). **Hysteresis**: fire at ±30°, re-arm only back inside ±12°. A **500 ms cooldown** applies, and **slow drift correction** follows posture while resting. Every number is in **`src/config/gameplay.ts`**. Calibration runs before the timer starts and never touches the score. |
| 3 | Faster feedback | `FEEDBACK_MS = 450` (in `src/config/gameplay.ts`). Same full-screen green/red design; the next prompt stays hidden until it ends; input is ignored during it. |
| 4 | Instructions on Get Ready | Get Ready now explains: hold sideways on your forehead, screen facing friends · green **Tilt down = Correct** · red **Tilt up = Pass** · "Tap Ready, then hold still for a moment." **Countdown shows only the big 3 / 2 / 1 / GO! circle.** Step pills and instruction tiles were removed. Gameplay shows no instructions. |
| 5 | Quick Play bubble removed | Gone from Get Ready. The space now holds the instructions, so nothing looks empty. Teams mode keeps a plain yellow text line "Team 1 of 3 · Wana Dar" (not a bubble), because whose turn it is matters. Duration, language and categories lines were removed from Get Ready (they're on the Play Mode/Setup screens). |
| 6 | Classic expansion | **Countries & Places → Countries** (countries only, 24 countries, many with Kiswahili names: Japani, Ufaransa, Marekani…). New **Famous Landmarks** (21, all continents; Kilimanjaro and the Pyramids moved here). New **Car Brands** (28 brands only, from everyday Toyota, Nissan and Isuzu to Ferrari and Bugatti. First requested as "Cars & Vehicles", then narrowed by the owner to brands only, so models like Land Cruiser and vehicle types like buses were dropped). New **Famous Brands** (27 across tech, fashion, luxury, food and drink, entertainment, retail; no overlap with car brands). New icons in the house SVG style. Classic now has 11 categories; 29 in total. |
| 7 | African Music & Artists | Renamed. 33 prompts across West, Southern, East (non-Tanzanian), Central and North Africa: genres (Afrobeats, Amapiano, Rhumba, Highlife, Raï), artists (Burna Boy, Wizkid, Davido, Tems, Rema, Ayra Starr, Tyla, Yemi Alade, Angélique Kidjo, Youssou N'Dour, Sauti Sol, Eddy Kenzo, Fally Ipupa, Koffi Olomide, Amr Diab, Cheb Khaled) and songs that travelled (Calm Down, Water, Last Last, Essence, Fall, Johnny, Jerusalema, Sitya Loss, Sura Yako, Vulindlela, Aïcha, Tamally Maak). An automated test blocks Tanzanian artists here. |
| 8–10 | Previous direction preserved | Mtaani/Vijiweni merge and Zilipendwa unchanged (tests check this). Group identities and language rules unchanged. The new screens use the existing tokens. |

## 2. Files changed (second pass)
**New:** `src/config/gameplay.ts`, `src/hooks/useCalibration.ts`, `src/pages/CalibrationPage.tsx`, `src/services/debug.ts`, `src/components/layout/DebugPanel.tsx`, `public/manifest.webmanifest`, `public/icon.svg`, `public/icons/*.png` (192, 512, maskable 512, apple-touch 180), `docs/ORIENTATION.md`.
**Changed:** `src/game/tilt.ts` (calibration + relative gestures), `src/hooks/useTiltControls.ts`, `src/pages/ForeheadReadyPage.tsx`, `src/pages/CountdownPage.tsx`, `src/pages/GameplayPage.tsx`, `src/App.tsx`, `src/services/orientation.ts`, `src/hooks/useNavigation.ts`, `src/types/index.ts`, `src/data/categories.ts`, `src/data/prompts.ts`, `scripts/content/build_prompts.py`, `src/components/illustrations/CategoryIcon.tsx`, `src/styles/design-tokens.css`, `index.html`, small text fixes in `GameSetupPage`, `CategoriesPage`, `PendingScreenPage`, tests (`tilt.test.ts`, `prompts.test.ts`, `promptDeck.test.ts`, `tests/e2e/full-game-flow.mjs`) and docs.
**Not touched:** your local `vite.config.ts` edit (left uncommitted, as you made it).

## 3. Tests
| Kind | Result |
|---|---|
| Unit tests (Vitest) | **66 / 66 pass**. New tests cover calibration (still hold accepted; lifting movement ignored; flat phone rejected; timeout fallback), the baseline-relative trigger, thresholds just below and above, hysteresis wobble, re-arm plus cooldown, noise spike ignored, sustained nod fires once, both landscape directions, the category restructure (countries only, landmarks moved, new categories ≥15, no brand duplicates, no Tanzanian artists in African Music & Artists, Mtaani/Zilipendwa intact). |
| Browser simulation (Playwright) | **41 / 41 pass, three runs in a row.** Adds: Get Ready instructions, Teams turn line, **Quick Play Get Ready has no bubble**, "Hold still…" calibration stage, **countdown contains only the number and no buttons** (checked at two steps), calibration captured from a still hold, small wobble ignored, deliberate tilt down/up after calibration, held tilt fires once, **feedback hidden at 350 ms, next prompt shown after 450 ms**, a second "I'm Ready" lock attempt on a phone. |
| Build / lint | ✅ / ✅ 0 warnings |

## 4. Remaining device-specific limitations
- **iPhone/iPad:** cannot be rotated by a website. The rotate screen is the only option, and Control Centre rotation lock must be off.
- **Android tablets (Chrome 136+):** lock refused by Chrome on purpose → rotate screen.
- **Android browser tab:** landscape requires fullscreen, so the browser bar hides during play. If the player swipes out of fullscreen, the next "I'm Ready" re-locks.
- **Tilt thresholds** are sensible starting values, not yet tuned on real phones. Use `?debug=1` and adjust `src/config/gameplay.ts`.
- **iPhone motion permission:** asked on "I'm Ready". Calibration waits for the answer. If denied, the manual buttons appear.
- **Offline play:** the app is installable, but there's no service worker yet (Phase 7).

## 5. Real-phone testing instructions
Start the dev server and your Cloudflare tunnel as before, then open `https://<tunnel>/?debug=1#home` (the debug strip shows lock and tilt numbers).
1. **Android Chrome:** Quick Play. The phone should go fullscreen and rotate automatically (debug: `lock: locked`). Finish the round; it should return to portrait.
2. **Android installed app:** Chrome menu → *Add to Home screen* / *Install app*, open it from the home screen, repeat test 1.
3. **iPhone:** Quick Play with the phone upright → "Turn your phone sideways" → rotate → Get Ready.
4. **Calibration:** tap I'm Ready, put the phone on your forehead and hold still. "Hold still…" should give way to 3-2-1 within about 1–2 s (debug: `calib still …°`). Try holding it slightly tilted back; small head movements should not answer.
5. **Gestures:** a clear nod down = green CORRECT, a clear tilt back = red PASS, each once. Holding the tilt must not repeat. Return to neutral, then the next gesture works.
6. **Speed:** feedback should feel quick (~0.45 s) and never overlap the next prompt.
7. **Tuning:** if gestures feel too stiff or too twitchy, note the `rel` values in the debug strip and adjust `correctTriggerDeg` / `passTriggerDeg` / `rearmDeg` in `src/config/gameplay.ts`.
8. **New categories:** play a round each of Countries, Famous Landmarks, Car Brands, Famous Brands and African Music & Artists.

## 6. Recommendation
Every acceptance criterion in the second brief is met in the browser. Criteria 1 and 2 (real landscape locking and calibrated tilt feel) can only be **confirmed on real phones**. Run tests 1–5 above, tune the config if needed, and then I recommend starting Phase 5.
