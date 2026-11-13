# Bongo Charades — Automatic Landscape: How It Works and Where It Can't

**Updated:** 2026-11-13 · Code: `src/services/orientation.ts`, `public/manifest.webmanifest`

## What the app does
1. **Start Game / Quick Play / Start next team / Play Again** (all taps): request fullscreen, then `screen.orientation.lock('landscape')`. This is touch devices only.
2. **I'm Ready** (also a tap): tries again, in case the first attempt was refused or the player left fullscreen.
3. **Leaving the sideways stages** (round over, results, exit): `unlock()` and leave the fullscreen we entered, so portrait screens behave normally.
4. **If the phone is still upright** on Get Ready, calibration, countdown or gameplay: a full-screen "Turn your phone sideways" screen appears. The countdown restarts, and the round timer and tilt pause until the phone is turned.

## What each platform allows (researched 2026-11-13)
| Platform | Automatic landscape? | Notes |
|---|---|---|
| **Android phone: Chrome, Samsung Internet, Firefox 144+** | ✅ Yes, in fullscreen | The spec requires fullscreen before `lock()`, so the browser bar disappears during play. Swiping out of fullscreen releases the lock, and "I'm Ready" re-locks it. |
| **Android phone: installed app (Add to Home screen)** | ✅ Yes, most reliable | The manifest uses `display: "fullscreen"`, so the installed app is already fullscreen. |
| **Android tablet: Chrome 136+** | ❌ Refused by design | Chrome now rejects `lock()` on non-phone devices (tablets sometimes reported success without rotating). The rotate screen is shown instead. |
| **iPhone: Safari and every iPhone browser** | ❌ Not possible | WebKit doesn't support `lock()`, and iPhones don't allow fullscreen for web pages. Players rotate by hand, guided by the rotate screen. **The phone's Portrait Orientation Lock (Control Centre) must be OFF**, and a web page can't detect or change it. |
| **iPad** | ❌ Not possible | Same as iPhone. |
| **Desktop** | Not needed | No fullscreen or lock is attempted, and the rotate screen is never shown. |

We deliberately don't fake landscape with CSS rotation while the phone is upright: tilt detection, text direction and system UI would all be wrong.

## Diagnosing on a real phone
Open the game with **`?debug=1`** before the `#`, e.g. `https://xyz.trycloudflare.com/?debug=1#home`. A strip at the bottom shows:
- `lock:`: `locked` / `failed` / `unsupported` / `skipped`
- live elevation, calibrated baseline, relative angle, tracker state, calibration result and last action.

## Sources
- W3C Screen Orientation spec (Working Draft, Aug 2026): `lock()` is restricted to fullscreen documents; installed web apps are a common pre-lock condition. https://www.w3.org/TR/screen-orientation/
- Chromium blink-dev PSA "Restrict orientation lock behavior to android phones" (2025-02-28, M136). https://groups.google.com/a/chromium.org/g/blink-dev/c/Hjo6zse3tvg
- Support tables: https://caniuse.com/wf-screen-orientation-lock · https://web-platform-dx.github.io/web-features-explorer/features/screen-orientation-lock/
- WebKit bug 257695 (ScreenOrientation lock support; behind a disabled flag). https://bugs.webkit.org/show_bug.cgi?id=257695
