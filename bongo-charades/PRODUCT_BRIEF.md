# Bongo Charades — Product Brief

## 1. Product Vision & Identity
**Bongo Charades** is a mobile-first party game inspired by classic forehead charades, built around a vibrant Tanzanian ("Bongo") and East African cultural identity.

- **Core Experience**: One player holds a phone horizontally against their forehead with the screen facing their friends. Friends act out, describe, or sing clues while the player guesses as many prompts as possible before the countdown timer expires.
- **Cultural Personality**: While accessible to players everywhere through Classic Charades categories, the heart of the game celebrates Tanzanian everyday life, music (*Bongo Flava*), cinema (*Movie za Bongo*), street culture (*Mtaani*, *Vijiweni*, *Daladala Diaries*), food (*Chakula Chetu*), and broader East African and pan-African culture.
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

### Group 1: Classic Charades (`c1` — `#7060E3`)
1. **Animals**
2. **Movies & TV**
3. **Music & Artists**
4. **Sports**
5. **Countries & Places**
6. **Everyday Things**
7. **Act It Out**
8. **Food & Drinks**

### Group 2: Bongo & Tanzanian Culture (`c2` — `#8A55E8`)
9. **Hii Dar Yetu**
10. **Daladala Diaries**
11. **Bongo Flava**
12. **Mtaani**
13. **Vijiweni**
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
23. **African Music**
24. **African Cities**
25. **Pop Culture**
26. **Throwback Hits**

### Special Mode: Feeling Lucky
- **"Feeling lucky?"** featured card on both Home and Categories screens selects random words across all categories.

---

## 4. Core User Journey & Gameplay Loop

1. **Home / Discovery**: Launch straight into `"Play Now"`, `"Feeling lucky?"`, or `"Recently played"` categories, or browse all categories via the Bottom Navigation (`Home`, `Categories`, `Create`, `History`) and top-right `Settings`.
2. **Category Selection**: Select one or more categories (indicated by a `3px` `#FFC83A` yellow border) and proceed to Game Setup.
3. **Game Setup**:
   - Review selected category chips (with mini category illustrations).
   - Choose round **Duration**: `30s`, `60s` (default), `90s`, or `120s`.
   - Choose **Teams**: `2` (default), `3`, or `4`.
   - Choose **Prompt language**: `English`, `Kiswahili`, or `Mixed` (default).
4. **Forehead Positioning (Landscape)**:
   - Prompt the player (`"Get ready! Place your phone against your forehead, with the screen facing your friends."`) and wait for explicit `"I'm Ready"` tap (which also triggers device motion/orientation permission on iOS/mobile browsers).
5. **Countdown (Landscape)**:
   - Animated/stepped `3` → `2` → `1` → `GO!` countdown.
6. **Active Gameplay (Landscape)**:
   - High-contrast, distraction-free screen with `TimerPill` (top-left), `ScorePill` (top-right), active Category label (top-center), and large `Baloo 2` prompt text (`88px`, min `56px`).
   - **Tilt Controls**: Tilt **DOWN** = Correct; Tilt **UP** = Pass.
   - **Manual Fallback**: Always-accessible on-screen `Pass ↑ (Tilt up)` and `Correct ↓ (Tilt down)` buttons.
7. **Results (Portrait)**:
   - Displays `"Time's up!"`, Final Score badge, encouraging message (e.g., `"Great round, Wana Dar!"`), `Correct` and `Passed` counts, plus `"Play Again"` and `"Back to Categories"` actions.
