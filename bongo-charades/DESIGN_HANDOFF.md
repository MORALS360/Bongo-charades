# Bongo Charades — Design Handoff & Specification

This document records the exact visual tokens, typography, layout rules, components, and SVG illustrations extracted from the master design exports:
- [Bongo Charades — Design System & Screens.pdf](file:///Users/collinsgodwins/Documents/Development/bongo-charades/design/reference/Bongo%20Charades%20%E2%80%94%20Design%20System%20&%20Screens.pdf)
- [Bongo Charades — Design System & Screens.html](file:///Users/collinsgodwins/Documents/Development/bongo-charades/design/reference/Bongo%20Charades%20%E2%80%94%20Design%20System%20&%20Screens.html)

---

## 1. Colour Palette & Gradients

### Core UI Tokens
| Token Name | Value | Usage |
| :--- | :--- | :--- |
| **Background Gradient** | `linear-gradient(165deg, #5A49DB 0%, #7F66EE 55%, #B493F6 100%)` | Main screen background across all portrait and landscape views |
| **Card — Classic (`c1`)** | `#7060E3` | Classic Charades category cards |
| **Card — Culture (`c2`)** | `#8A55E8` | Bongo & Tanzanian Culture category cards |
| **Card — East Africa (`c3`)** | `#4F6BE0` | East Africa & Beyond category cards |
| **Primary Yellow** | `#FFC83A` | Primary buttons, active segmented pills, selected card border (`3px`), highlights |
| **Primary Button Shadow** | `#C98F0A` | `0 4px 0 #C98F0A` bottom lip on primary yellow buttons |
| **Featured Orange** | `#F59A23` | Featured card gradient end (`linear-gradient(135deg, #FFC83A, #F59A23)`), Pass button (`#F59A23`) |
| **Correct Teal** | `#14B8A6` | Gameplay manual `Correct ↓` button background |
| **Night (Dark Text)** | `#2A1B6B` | Text & icons on yellow/orange/teal surfaces |
| **Nav Bar** | `#3E2FA8` | Bottom navigation bar background |
| **Panel Surface (`pl`)** | `rgba(255, 255, 255, 0.16)` | Settings and Game Setup translucent panels |
| **Segment Inactive** | `rgba(255, 255, 255, 0.18)` | Inactive segmented control buttons |
| **Icon Circle (`ic`)** | `rgba(255, 255, 255, 0.20)` | Top-right circular icon buttons (`44x44px`) |
| **HUD Pill Surface** | `rgba(30, 15, 90, 0.55)` | Landscape `TimerPill` and `ScorePill` background |
| **Card Border** | `rgba(255, 255, 255, 0.22)` | Default `2px solid` border on category cards |
| **Card Shadow** | `rgba(30, 15, 90, 0.35)` | `0 5px 0 rgba(30, 15, 90, 0.35)` flat offset shadow |

### SVG Illustration Radial Gradients (`cx="0.35" cy="0.3" r="0.85"`)
Every custom SVG illustration shares 9 global radial gradients:
- **`#Y` (Yellow-Gold)**: `#FFE98A` → `#F5A623`
- **`#O` (Orange)**: `#FFB36B` → `#E8590C`
- **`#R` (Red-Coral)**: `#FF9A9A` → `#D62839`
- **`#B` (Blue)**: `#9CD3FF` → `#2563EB`
- **`#G` (Green)**: `#B5F0A0` → `#1E9E4A`
- **`#W` (White-Lavender)**: `#FFFFFF` → `#CFC8F0`
- **`#K` (Deep Night)**: `#6A5BB5` → `#1E1250`
- **`#M` (Magenta-Pink)**: `#FFB3E6` → `#C026D3`
- **`#T` (Teal-Mint)**: `#9CF5EA` → `#0E9F90`

---

## 2. Typography

- **Display Font**: `"Baloo 2"`, weight `800` (loaded via Google Fonts / bundled `@font-face`).
- **Body Font**: `"Nunito Sans"`, weights `400`, `700`, `800`.

### Type Scale
| Element | Font Family | Size / Line-Height | Weight |
| :--- | :--- | :--- | :--- |
| **Hero / Display Title** | Baloo 2 | `40px / 42px` (or `36px / 38px`) | `800` |
| **Section Heading** | Baloo 2 | `24px / 28px` (Home sub-section `22px`) | `800` |
| **Category Card Label (`.n`)** | Nunito Sans | `15px / 17px` (`min-height: 34px`) | `800` |
| **Body Copy** | Nunito Sans | `16px / 24px` | `400` / `700` |
| **HUD Timer & Score** | Baloo 2 | `34px` | `800` |
| **Game Prompt** | Baloo 2 | `88px / 90px` (scales down to `min 56px` for long phrases) | `800` |
| **Countdown / Score Badge** | Baloo 2 | `190px` (Countdown) / `96px` (Final Score) | `800` |

---

## 3. Shape, Spacing & Responsive Breakpoints

- **Border Radius**:
  - Cards (`.c`, FeaturedCard) & Panels (`.pl`): `24px`
  - Primary Buttons (`.y`), Segmented Controls (`.sg button`), HUD Pills: `999px` (pill)
  - Tilt Fallback Buttons: `20px`
  - Bottom Navigation Bar: `28px 28px 0 0` (top corners rounded, `height: 84px`), nav items `18px`
- **Spacing Scale**: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`.
- **Responsive Breakpoints**:
  - **Mobile (`< 600px`)**: Full-bleed viewport, 2-column category grid (`gap: 12px`).
  - **Tablet (`600px – 1023px`)**: 3-column category card grid.
  - **Desktop (`1024px+`)**: Centred `440px` app container for portrait screens.
  - **Gameplay Screens (Forehead Positioning, Countdown, Gameplay)**: Designed for `orientation: landscape` (`844x390` reference viewport).

---

## 4. Inventory of Designed Screens (9 Artboards)

1. **Artboard 1 — Design System (`1000×640`)**: Visual specification of colours, typography, shapes, and components.
2. **Artboard 2 — Home (`390×844`, Portrait)**:
   - Brand header (`Bongo` in `#FFC83A` + `Charades` in white) + Settings icon button (`ic`).
   - Hero greeting: `"Ready to play?"` + `"Your culture. Your people. Your game."`
   - Primary CTA: `"Play Now ▷"` (`min-height: 72px`, `font-size: 26px`).
   - Featured card: `"Feeling lucky?"` with dual-dice SVG illustration (`92×92`).
   - `"Recently played"` section with `"Browse all"` link and 2 compact category cards (`height: 132px`, `64×64` icons: *Bongo Flava*, *Daladala Diaries*).
   - `BottomNav` with `Home` active.
3. **Artboard 3 — Categories (`390×844`, Portrait, Scrollable)**:
   - Header: `"Categories"` + Rewards (gift icon) button + Settings button.
   - `"Feeling lucky?"` featured card.
   - 3 category groups (*Classic Charades*, *Bongo & Tanzanian Culture*, *East Africa & Beyond*) with 26 total `CategoryCard` buttons (`height: 152px`, `76×76` SVG illustrations).
   - Selected state shown on *Bongo Flava*, *Chakula Chetu*, and *Movie za Bongo* (`border: 3px solid #FFC83A`).
   - `BottomNav` with `Categories` active.
4. **Artboard 4 — Game Setup (`390×844`, Portrait)**:
   - Title: `"Game setup"`.
   - **Categories panel**: Displays selected category pills (`#FFC83A` background, `32×32` mini SVG icon + category name).
   - **Duration panel**: Segmented control (`30s`, `60s` [active], `90s`, `120s`).
   - **Teams panel**: Segmented control (`2` [active], `3`, `4`).
   - **Prompt language panel**: Segmented control (`English`, `Kiswahili`, `Mixed` [active]).
   - Bottom pinned `"Start Game"` primary button (`min-height: 64px`).
5. **Artboard 5 — Results (`390×844`, Portrait)**:
   - Decorative confetti dots (6 coloured circles positioned around the top half).
   - Title: `"Time's up!"`.
   - Large glowing yellow-orange circular badge (`200×200`, `14px` translucent ring) showing `"12"` and `"Final score"`.
   - Subtitle: `"Great round, Wana Dar!"`.
   - 2-column stat panels: `12 Correct` (`#9CF5EA` number) and `3 Passed` (`#FFB36B` number).
   - Bottom action stack: `"Play Again"` (Primary Yellow button) and `"Back to Categories"` (outlined pill button).
6. **Artboard 6 — Settings (`390×844`, Portrait)**:
   - Title: `"Settings"`.
   - **App language panel**: Segmented control (`English` [active], `Kiswahili`) + helper note `"Category names keep their original language."`
   - **Sound toggle panel**: Checkbox row (`28×28px`, `accent-color: #FFC83A`).
   - **Haptic feedback toggle panel**: Checkbox row.
   - **Show tilt hints toggle panel**: Checkbox row.
   - **Tilt sensitivity panel**: Segmented control (`Low`, `Medium` [active], `High`).
   - `BottomNav` included at bottom.
7. **Artboard 7 — Forehead Positioning (`844×390`, Landscape)**:
   - 2-column layout (`padding: 24px 40px`, `gap: 24px`).
   - Left: Custom `340×230` SVG illustration of a player holding the phone horizontally on their forehead facing three colourful friends below.
   - Right: `"Get ready!"`, instruction text `"Place your phone against your forehead, with the screen facing your friends."`, and `"I'm Ready"` primary button (`min-height: 64px`, `font-size: 24px`).
8. **Artboard 8 — Countdown (`844×390`, Landscape)**:
   - Centred flex layout (`gap: 40px`).
   - Left: Large `270×270` radial-gradient circle (`16px` outer ring) displaying the current countdown number (`3` at `190px`).
   - Right: 4 step pills (`3`, `2`, `1`, `GO!`), with the active step highlighted in `#FFC83A`.
9. **Artboard 9 — Gameplay (`844×390`, Landscape)**:
   - Top-left `TimerPill` (`0:42`) and top-right `ScorePill` (`Score 7`).
   - Top-center Category label (`Daladala Diaries` in `#FFC83A`).
   - Centre: Giant `Baloo 2` prompt (`Konda wa Daladala`, `88px/90px`, centred with `0 80px` horizontal padding).
   - Bottom-left manual/hint button: `Pass ↑ / Tilt up` (`#F59A23`).
   - Bottom-right manual/hint button: `Correct ↓ / Tilt down` (`#14B8A6`).

---

## 5. Missing Designs / Undesigned Navigation Targets Noted in Audit
- **`Create` Tab (in BottomNav)**: Present in the bottom navigation bar across screens, but does not have a dedicated artboard in the PDF/HTML export.
- **`History` Tab (in BottomNav)**: Present in the bottom navigation bar (note: Artboard 6 Settings shows `History` highlighted in the BottomNav, likely an export artifact), and does not have a dedicated History artboard.
- **`Rewards` Gift Button (on Categories header)**: Top-right gift box icon button next to Settings on the Categories screen has no dedicated modal/screen in the export.
- **Word List / Prompt Review on Results**: Results shows aggregate `Correct` and `Passed` counts (`12` and `3`); whether tapping those panels or scrolling reveals the individual words played can be decided during implementation.


---

## Addendum — Pre-Phase 5 refinement (2026-11-12)

New and changed screens. They reuse existing tokens; no new colour system.

| Element | Spec |
|---|---|
| **Play Mode screen** (new, portrait) | Back link (yellow), page title 36px "How do you want to play?", category summary. **Quick Play** card = Featured gradient (`#FFC83A → #F59A23`, night text). **Teams** card = `c2` purple `#8A55E8` + card border/shadow. Both 132px min height, radius 24. "Round length" + "Prompt language" segmented controls in a panel. |
| **Teams list** (Game Setup) | Segmented 2/3/4 replaced by a list: 2 teams default, `+ Add team` (dashed pill), `×` remove (44px icon circle style) when more than 2. Max 8. |
| **Instructions + countdown** | 230px golden countdown circle + column: "HOW TO ANSWER" label (yellow, uppercase), green tile "↓ Tilt down / CORRECT", red tile "↑ Tilt up / PASS", 3-2-1-GO pills (46px). |
| **Gameplay** | Timer pill top-left; yellow category label; prompt 88px Baloo 2 (scales down); optional hint line 18px. No score pill, no tilt buttons. Fallback pills (44px, HUD surface, red/green outline) only without motion data. |
| **Answer feedback** | Full screen. Correct = `radial-gradient(#3CCF6E → #1E9E4A)` (design `#G` family). Pass = `radial-gradient(#F2545F → #D62839)` (design `#R` family). White ringed icon 128px + Baloo 2 96px uppercase word. 800 ms. |
| **Rotate prompt** | Full-screen app gradient, animated phone (rotates −90°), yellow arrow, "Turn your phone sideways". |
| **Zilipendwa icon** | Vintage radio in the 64×64 style: `#O` body, `#K` speaker, `#W` grille/dial, `#Y` knob and antenna. |
| **Consistency fixes** | On phones/tablets the app gradient is pinned to the viewport, so long screens don't fade to lavender. Panels (`.pl`) use a deep-purple tint `rgba(62,47,168,0.32)` (from the nav-bar colour) + card border + card shadow instead of plain 16% white, matching Home's cards. |
