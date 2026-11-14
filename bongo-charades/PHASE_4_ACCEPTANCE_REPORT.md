# Bongo Charades — Phase 4 Acceptance Report

**Date:** 2026-11-11
**Branch:** `phase-4-audit` (based on `main` @ `4cd77e4 "phase 4"`)
**Reviewer:** Claude (Cowork), for project owner review
**Verdict:** Phase 4 gameplay engine is **connected and working end-to-end in the browser**. Tilt controls are implemented and pass simulated tests, but they are **not accepted until they've been tested on a real phone** (see §5).

---

## 1. What I found at the start of the audit

| Finding | Impact |
|---|---|
| The production build (`npm run build`) **failed** with 2 TypeScript errors | The app could not be deployed |
| The Phase 4 screens (Countdown, Gameplay, Round Transition, Results) and hooks existed but were **never connected** in `App.tsx` | "I'm Ready" did nothing; `#gameplay` / `#results` showed the Settings placeholder |
| No game-session state existed (no per-team scores, no current team, no rounds) | Scoring and team rotation were impossible |
| Forehead screen showed `Team NaN/` | Missing props |
| `usePromptDeck` returned the *previous* prompt and changed state inside a state updater (React may run that twice) | Possible wrong prompts and repeats |
| Tilt maths treated 0° as "resting", but a phone held sideways on the forehead reads about ±90° | Likely to fire Correct/Pass by itself on a real phone |
| Tilt listener re-attached every time the prompt changed, which reset the "return to upright first" rule | One long tilt could score twice |
| Tilt cooldown compared milliseconds with degrees | Logic bug |
| A Correct/Pass tap could still count up to 200 ms after the timer reached 0 | Late answers accepted |
| `getFilteredPrompts` could fall back to prompts from **unselected** categories | Wrong-category prompts |
| Results screen gave tied teams different medals (🥇/🥈) | Incorrect ranking display |

## 2. What I changed (plain-language summary)

1. **One "brain" for the game: `src/game/gameSession.ts`.**
   This is a *reducer*: a plain function that takes the current game and an event (for example "Correct", "time's up" or "next team") and returns the updated game. All the game rules live here: scoring, rotating teams, deciding when the game is over, and ignoring duplicate or late answers. It contains no screen code, so it can be tested automatically. `useGameSession` is the small React hook that hands it to the screens.
2. **Connected the existing screens** in `App.tsx`: Setup → Forehead → 3-2-1-GO → Gameplay → Round transition → (next team…) → Results → Play Again / Home.
   The screens themselves were **not redesigned**. Only the props they needed were added.
3. **Rebuilt the prompt deck as pure functions** (`src/game/promptDeck.ts`). It works like a deck of cards: shuffle once, deal one card at a time, and reshuffle only after every card has been used, so nothing repeats before then. It uses a "seeded" shuffle so the logic is predictable in tests.
4. **Fixed the tilt maths** (`src/game/tilt.ts`). The app now asks one simple question: *which way is the screen facing?* Screen towards the floor = Correct, towards the ceiling = Pass, straight ahead = resting. This works whichever way the phone is turned sideways and avoids the ±90° jump.
5. **Timer guard:** answers are rejected as soon as the real deadline passes, even before the next display tick.
6. **Double-tap guard:** answers are locked for 400 ms after each one. On top of that, the game session ignores an answer unless it matches the prompt currently on screen.
7. **Results:** tied teams now share a rank and a medal. "View Current Standings" on the transition screen opens a mid-game scoreboard with a "Back to Game" button.
8. **Navigation safety:** the browser **Back** button during a game takes you to Game Setup and ends the game, instead of rewinding the countdown. Opening `#gameplay` with no game running sends you to Setup.
9. **Empty categories:** if a selection has no prompts, **Start Game** is disabled and a friendly message appears. Prompts from unselected categories are never used.
10. **Tests added:** Vitest unit tests (`npm test`) and an end-to-end browser script (`tests/e2e/full-game-flow.mjs`).

Removed: `src/hooks/usePromptDeck.ts`, replaced by `src/game/promptDeck.ts` and the game session.
The prompt **content** in `src/data/prompts.ts` was **not** changed. Only the filtering function was fixed.

## 3. How things were verified

| Method | What it proves | What it does NOT prove |
|---|---|---|
| **Automated unit tests**: 33 tests in `src/game/*.test.ts`, run with `npm test` | Game rules, scoring, rotation, deck, prompt filtering, tilt maths with simulated angles | Anything visual or on real hardware |
| **Browser simulation**: Playwright + Chromium, fake clock, 31 checks in `tests/e2e/full-game-flow.mjs`, plus a duration check for 30/60/90/120 s | The full game flow works in a real browser engine, including simulated tilt events and phone-sized landscape/portrait viewports | Real sensor behaviour, real phone browsers (Safari/Chrome mobile), sound output, touch feel |
| **Physical device tests** | — | **Not performed.** I cannot hold a phone. See §5 |

Other checks: `npm run build` ✅ (no errors) · `npm run lint` (oxlint) ✅ 0 warnings · no console errors during the browser flow ✅.
Screens were compared against PDF pages 5, 7, 8 and 9. Layout, colours and components match the design.

## 4. Acceptance checklist

Legend: **PASS** = implemented and verified · **PARTIAL** = implemented, not fully verified · **FAIL** = missing or broken · **DEVICE TEST REQUIRED** = needs a real phone.
"Verified by": U = unit test, B = browser simulation, R = code review.

### A. Main gameplay screen
| Requirement | Status | Verified by | Notes |
|---|---|---|---|
| Landscape-first layout (not a rotated portrait screen) | PASS | B | Checked at 844×390 and 667×375 |
| Large readable prompt | PASS | B | Font size shrinks automatically for long prompts |
| Countdown timer | PASS | B | |
| Active team name | PASS | B | |
| Current score | PASS | B | |
| Correct / Pass indicators | PASS | B | Buttons with tilt hints, plus a green/orange flash on each answer |
| Minimal distractions | PASS | B, R | |
| Rotate-phone instruction | PASS (browser) / DEVICE TEST REQUIRED | B | Appears on narrow portrait screens during gameplay. Real rotation behaviour needs a phone |

### B. Positioning and countdown
| Requirement | Status | Verified by | Notes |
|---|---|---|---|
| Forehead positioning instruction | PASS | B | Shows "Team X/Y: name", duration and language |
| Ready button | PASS | B | |
| 3 → 2 → 1 → GO! | PASS | B | |
| Round timer starts after the countdown | PASS | B | |

### C. Device motion
| Requirement | Status | Verified by | Notes |
|---|---|---|---|
| Tilt down = Correct | DEVICE TEST REQUIRED | U, B (simulated) | Maths and logic pass. Real-phone feel is not verified |
| Tilt up = Pass | DEVICE TEST REQUIRED | U, B (simulated) | |
| iOS/Safari permission handling | DEVICE TEST REQUIRED | R | Requested inside the "I'm Ready" tap |
| Motion capability checks | PARTIAL | R | Supported/unsupported is detected. No on-screen message when sensors are missing or denied (manual buttons always remain) |
| Suitable thresholds | DEVICE TEST REQUIRED | U | 35° to trigger, back within 20° of upright to re-arm (medium setting) |
| Cooldown / no duplicate answers | PASS (logic) | U, B | 700 ms tilt cooldown, must return upright first, 400 ms answer lock |
| No duplicate event listeners | PASS | R | One listener while a round is active; removed on cleanup; not re-attached when the prompt changes |
| Manual Correct / Pass fallback | PASS | B | Always visible |
| No claim of forehead detection | PASS | R | |

### D. Timer
| Requirement | Status | Verified by | Notes |
|---|---|---|---|
| 30 / 60 / 90 / 120 s | PASS | B | Each duration started at the right value and ended on time |
| Stops accurately at zero | PASS | B | Based on the real clock, so it doesn't drift |
| No answers after time expires | PASS | U, B, R | Checked in both the screen and the game session |

### E. Prompt engine
| Requirement | Status | Verified by | Notes |
|---|---|---|---|
| Only selected categories | PASS | U, B | |
| English / Kiswahili / Mixed respected | PASS | U | English = en + mixed; Kiswahili = sw + mixed; Mixed = all |
| No repeats until exhausted | PASS | U | Also across teams within one game |
| Shuffled | PASS | U | |
| Empty categories handled gracefully | PASS | U, R | Start is disabled with a message. Can't happen with the current data (all 26 categories have prompts) |
| Never empty/undefined prompts | PASS | U, B | Blank or duplicate entries are filtered out |

### F. Scoring
| Requirement | Status | Verified by |
|---|---|---|
| Correct = 1 point | PASS | U, B |
| Pass = 0 points | PASS | U, B |
| Independent score per team | PASS | U, B |
| Duplicate point awards prevented | PASS | U, B (rapid double-tap test) |
| Accurate score display | PASS | B |

### G. Team rotation
| Requirement | Status | Verified by |
|---|---|---|
| Multiple teams (2–4), one round each | PASS | U, B (3-team game) |
| Round-end screen shows the team's score | PASS | B |
| Identifies the next team | PASS | B |
| Transition screen, next team can start | PASS | B |

### H. Final results
| Requirement | Status | Verified by |
|---|---|---|
| All team names and total scores | PASS | B |
| Rankings | PASS | U, B |
| Winner announcement | PASS | B |
| Tie handling (shared rank, tie message, 0–0 message) | PASS | U, B |
| Play Again (same teams and settings, scores reset) | PASS | U, B |
| Return Home | PASS | B |

### I. State management
| Scenario | Status | Verified by |
|---|---|---|
| Start game, countdown, active round, Correct, Pass, time-up, transition, results, restart, Return Home | PASS | U, B |
| No stale timers (each round's screen is rebuilt fresh) | PASS | B, R |
| Correct team gets the points | PASS | U, B |
| Browser Back / direct link to a game screen | PASS | B |

### Other
| Item | Status | Notes |
|---|---|---|
| Production build | PASS | `tsc -b && vite build` |
| Lint | PASS | 0 warnings |
| Real-phone layouts (safe areas/notches, iOS Safari address bar) | DEVICE TEST REQUIRED | |
| Sound effects | PARTIAL | Code runs without errors. Not listened to |
| PWA (manifest, service worker, install, offline) | Not started | Not part of Phase 4. Planned for Phase 7 |

## 5. Physical device test checklist (for you to run)

**Important:** phone browsers only send tilt data to **secure (https://) pages**. Opening `http://192.168.x.x:5173` from your phone will show the game, but tilt will not work. Options:
- deploy a preview build to a free HTTPS host (for example Netlify or Vercel drag-and-drop of the `dist/` folder), or
- I can add Vite's official `@vitejs/plugin-basic-ssl` plugin so `npm run dev -- --host` serves https on your Wi-Fi. Your phone will show a certificate warning you have to accept.

Then test on **at least one iPhone (Safari) and one Android phone (Chrome)**:
1. Tap "I'm Ready". On iPhone, a "Motion & Orientation access" prompt should appear. Allow it.
2. Hold the phone sideways on your forehead, screen facing friends. **Nothing should fire while you hold still.**
3. Nod down → Correct (+1, green flash). Tilt head back → Pass (orange flash).
4. Hold the tilt for 2–3 seconds → only **one** answer.
5. Repeat with the phone turned the other way round (camera on the other side).
6. Try with motion access **denied** → the manual buttons must still work.
7. Note whether 35° feels too sensitive or too stiff (adjustable in `src/game/tilt.ts`).
8. Check that the rotate-phone message appears in portrait and disappears in landscape.
9. Check that sounds play after the first tap (iOS mutes the page until you interact).
Report the results and I'll mark each tilt item PASS or FAIL.

## 6. Known limitations (honest list, not blockers for Phase 4)
- Refreshing the page mid-game ends the game (you go back to Setup). The game is not saved.
- The round timer keeps running while the rotate-phone message is showing, or if the app is in the background (for example an incoming call). This is a Phase 6 polish item.
- There's no pause or quit button on the gameplay screen (the design has none). The browser Back button exits the game.
- Settings (sound on/off, tilt sensitivity, tilt hints) aren't adjustable yet. The Settings screen is still a placeholder; it uses defaults.
- Duplicate team names are allowed.
- The app doesn't try `screen.orientation.lock('landscape')`. That mostly only works for installed PWAs (Phase 7).
- **Content observations, deferred to Phase 5 and not changed here:** many prompts are word-for-word EN/SW duplicates ("Simba"/"Lion"); "Kenge" is listed as crocodile but means monitor lizard; some category content is thin.

## 7. Recommendation
Phase 4 can be accepted **conditionally**: everything except real-device tilt behaviour is implemented and verified. I recommend running the §5 device checklist (≈10 minutes) before or at the start of Phase 5. I have **not** started Phase 5 and will wait for your approval.
