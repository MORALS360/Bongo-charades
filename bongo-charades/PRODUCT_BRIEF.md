# Bongo Charades — Product Brief

## 1. Product Vision & Identity
**Bongo Charades** is a mobile-first party game inspired by classic forehead charades, built around a vibrant Tanzanian ("Bongo") and East African cultural identity.

- **Core Experience**: One player holds a phone horizontally against their forehead with the screen facing their friends. Friends act out, describe, or sing clues while the player guesses as many prompts as possible before the countdown timer expires.
- **Cultural Personality**: While accessible to players everywhere through Classic Charades categories, the heart of the game celebrates Tanzanian everyday life, music (*Bongo Flava*), cinema (*Movie za Bongo*), street culture (*Mtaani*, *Daladala Diaries*), throwback music (*Zilipendwa*), food (*Chakula Chetu*), and broader East African and pan-African culture.
- **Feel & Polish**: A lively, tactile, modern mobile game—bold typography, rich purple gradients, warm yellow/orange accents, playful custom SVG illustrations, sound effects, and haptic feedback.

---

## 2. Language & Localization Principles
The architecture strictly separates **App Interface Language** from **Game Prompt Language**:

1. **App Interface Language (Default: English)**
   - Controls all UI chrome: Home screen, Navigation, Buttons, Settings, Game Setup labels, Instructions, Scores, Results, and Notifications.
   - Supports switching between **English** and **Kiswahili** in Settings.
2. **Category Names (Never Translated)**
   - Category titles preserve their original English, Kiswahili, or Tanzanian expressions regardless of the selected App Interface Language (e.g., *Bongo Flava*, *Daladala Diaries*, *Hii Dar Yetu*, *Chakula Chetu*, *Animals*, *Movies & TV*).
3. **Game Prompt Language (Configurable per Round)**
   - Selected on the Game Setup screen (`English`, `Kiswahili`, or `Mixed`).
   - Prompts may naturally use English, Kiswahili, Tanzanian slang, or authentic combinations depending on the category and filter.

---

## 3. Category Taxonomy (26 Approved Categories in 3 Groups)

> **Content identity per group (owner decision, 2026-11-12)** — Classic Charades = universal, English-led with Kiswahili translations of the same idea · Bongo & Tanzanian Culture = Tanzanian, Kiswahili-led · East Africa & Beyond = Africa-wide and international, English-led. Full rules: `docs/content/CONTENT_DIRECTION.md`.

### Group 1: Classic Charades (`c1` — `#7060E3`)
1. **Animals**
2. **Movies & TV**
3. **Music & Artists**
4. **Sports**
5. **Countries** (countries only)
5a. **Famous Landmarks** (new 2026-11-13)
5b. **Car Brands** (new 2026-11-13)
5c. **Famous Brands** (new 2026-11-13)
6. **Everyday Things**
7. **Act It Out**
8. **Food & Drinks**

### Group 2: Bongo & Tanzanian Culture (`c2` — `#8A55E8`)
9. **Hii Dar Yetu**
10. **Daladala Diaries**
11. **Bongo Flava**
12. **Mtaani**
13. **Zilipendwa** — Tanzanian throwback music (replaced *Vijiweni* on 2026-11-12; Vijiweni's content merged into *Mtaani*)
14. **Chakula Chetu**
15. **Watu Maarufu**
16. **Movie za Bongo**
17. **Mpira & Mashabiki**
18. **Chuo Life**
19. **Mapenzi & Mahusiano**
20. **Shughuli za Familia**

### Group 3: East Africa & Beyond (`c3` — `#4F6BE0`)
21. **East African Vibes**
22. **African Icons**
23. **African Music & Artists** (renamed 2026-11-13; Africa-wide, not Tanzanian)
24. **African Cities**
25. **Pop Culture**
26. **Throwback Hits**

### Special Mode: Feeling Lucky
- **"Feeling lucky?"** featured card on both Home and Categories screens selects random words across all categories.

---

## 4. Core User Journey & Gameplay Loop

1. **Home / Discovery**: Launch straight into `"Play Now"`, `"Feeling lucky?"`, or `"Recently played"` categories, or browse all categories via the Bottom Navigation (`Home`, `Categories`, `Create`, `History`) and top-right `Settings`.
2. **Category Selection**: Select one or more categories (indicated by a `3px` `#FFC83A` yellow border) and tap **Continue**.
3. **Play Mode** (new): choose round length and prompt language, then
   - **Quick Play**: no teams, one shared score, straight into the game; or
   - **Teams**: continue to Game Setup.
4. **Game Setup (Teams only)**:
   - Review selected category chips (with mini category illustrations).
   - Teams: **2 by default**, players can **+ Add team** (up to 8) or remove teams, with editable names.
   - Duration and prompt language (same settings as the Play Mode screen).
5. **Get Ready (Landscape)** — all instructions live here: hold sideways on the forehead · Tilt DOWN = Correct · Tilt UP = Pass · hold still. Teams mode shows "Team X of Y · name"; Quick Play shows no badge.
   Then **"Hold still…" calibration** (≈1 s) records the player's neutral angle.
   Forehead Positioning details:
   - Starting a game asks the phone to switch to landscape (Android: fullscreen + orientation lock; iPhone can't be rotated by a website, so a "Turn your phone sideways" screen waits until the player rotates).
   - Prompt the player (`"Get ready! Place your phone against your forehead…"`) and wait for `"I'm Ready"` (which also requests motion permission on iPhone).
6. **Countdown (Landscape)**: only the big `3 → 2 → 1 → GO!` circle.
7. **Active Gameplay (Landscape)**:
   - Clean screen: timer, category label and the large prompt (plus a small hint line such as the artist for song titles). No permanent instruction buttons.
   - Tilt DOWN = Correct; tilt UP = Pass → full-screen green/red feedback for ~0.45 s, then the next prompt.
   - Fallback: small Pass / Correct buttons appear only if the phone sends no motion data; keyboard ↓/Enter and ↑ also work.
   - Turning the phone upright pauses the round.
8. **Results (Portrait)**:
   - Displays `"Time's up!"`, Final Score badge, encouraging message (e.g., `"Great round, Wana Dar!"`), `Correct` and `Passed` counts, plus `"Play Again"` and `"Back to Categories"` actions.
   - Teams: a round-transition screen between teams, then final standings with ranks, winner and ties.
   - Quick Play: single-score results (the original Artboard 5 layout).
   - Leaving gameplay releases the landscape lock so portrait screens return to normal.
