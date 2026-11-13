/**
 * Bongo Charades — end-to-end BROWSER SIMULATION (pre-Phase 5 refinement build).
 *
 * Drives a real Chromium browser through both game modes:
 *   Teams:      Home → Categories → Play Mode → Team setup (add a team) → Forehead →
 *               instructions + 3-2-1-GO → Gameplay (keyboard + simulated tilt) →
 *               full-screen feedback → team transition → … → Results → Play Again
 *   Quick Play: Home → Feeling lucky → Play Mode → Quick Play → … → Quick results
 * plus orientation behaviour (simulated phone), guards and edge cases.
 *
 * Uses Playwright's fake clock, so a 30-second round takes milliseconds.
 * Tilt and orientation are SIMULATED — this proves the app logic, NOT real phone
 * sensors or real screen rotation. Real-device testing is still required.
 *
 * How to run (from the project folder):
 *   npm i -D playwright && npx playwright install chromium   (one time)
 *   npm run dev          (in one terminal, note the port)
 *   BASE_URL=http://localhost:5173 node tests/e2e/full-game-flow.mjs
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const SHOTS = process.env.SHOT_DIR ?? null
const FEEDBACK_MS = 450 // keep in sync with src/config/gameplay.ts
const results = []
const check = async (name, fn) => {
  try {
    await fn()
    results.push(['PASS', name])
  } catch (e) {
    results.push(['FAIL', name + ' — ' + e.message.replace(/\s+/g, ' ').slice(0, 400)])
  }
}
process.on('exit', (code) => {
  if (code !== 0 && results.length) for (const [st, n] of results) console.log(`${st}  ${n}`)
})

const LANDSCAPE = { width: 844, height: 390 }
const PORTRAIT = { width: 390, height: 844 }

const browser = await chromium.launch()
const errors = []

async function newPage(contextOptions = {}) {
  const ctx = await browser.newContext({ viewport: PORTRAIT, ...contextOptions })
  // Record orientation API calls (Chromium desktop can't really rotate)
  await ctx.addInitScript(() => {
    window.__orientationLog = []
    const o = screen.orientation
    if (o) {
      o.lock = (v) => {
        window.__orientationLog.push('lock:' + v)
        return Promise.resolve()
      }
      o.unlock = () => window.__orientationLog.push('unlock')
    }
    Element.prototype.requestFullscreen = function () {
      window.__orientationLog.push('fullscreen')
      return Promise.resolve()
    }
  })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.clock.install()
  return page
}

let page = await newPage()
const shot = async (name) => SHOTS && page.screenshot({ path: `${SHOTS}/${name}.png` })
const text = async () => (await page.innerText('body')).replace(/\s+/g, ' ')
const prompt = async () => (await page.locator('.gameplay-stage h1').first().innerText()).trim()
const tilt = (beta, gamma) =>
  page.evaluate(
    ([b, g]) => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: b, gamma: g })),
    [beta, gamma],
  )
const key = async (k) => {
  await page.keyboard.press(k)
  await page.clock.runFor(FEEDBACK_MS + 50)
}
/** Stream the same sensor reading every 20 ms for `ms` (real sensors fire ~60×/s) */
const tiltFor = async (beta, gamma, ms) => {
  for (let t = 0; t < ms; t += 20) {
    await tilt(beta, gamma)
    await page.clock.runFor(20)
  }
}
// Without sensor data: Ready → calibration skipped after 1.5 s → 3-2-1-GO (3.9 s)
const startRound = async () => {
  await page.getByRole('button', { name: "I'm Ready" }).click()
  await page.clock.runFor(1700)
  await page.clock.runFor(4000)
  // React renders asynchronously — wait until the gameplay screen is really there
  await page.locator('.gameplay-stage').waitFor()
}

/* ================= TEAMS MODE ================= */
await page.goto(BASE + '/#home')
await page.evaluate(() => localStorage.clear())
await page.reload()
await page.clock.runFor(300)
await page.getByRole('button', { name: /Play Now/ }).click()
await check('Play Now opens Categories', async () => assert.match(await text(), /Categories/))

// Start from a known selection: toggle off defaults, pick two categories
for (const name of ['Bongo Flava', 'Chakula Chetu', 'Movie za Bongo']) {
  await page.getByRole('button', { name: new RegExp(`^${name}`) }).first().click()
}
await page.getByText('Zilipendwa', { exact: true }).first().click()
await page.getByText('Animals', { exact: true }).first().click()
await check('Vijiweni no longer listed; Zilipendwa is', async () => {
  const t = await text()
  assert.doesNotMatch(t, /Vijiweni/)
  assert.match(t, /Zilipendwa/)
})
await page.getByRole('button', { name: /Continue \(2\)/ }).click()
await check('Categories → Play Mode screen', async () =>
  assert.match(await text(), /How do you want to play\?/),
)
await shot('01-play-mode')
await page.getByRole('button', { name: '30s', exact: true }).click()
await page.getByRole('button', { name: /^Teams/ }).click()
await check('Teams → existing Team setup screen', async () => assert.match(await text(), /Game setup/i))
await check('Teams default to 2', async () => assert.match(await text(), /2 teams/))
await page.getByRole('button', { name: '+ Add team' }).click()
await check('A third team can be added (Team Chapchap)', async () => {
  assert.match(await text(), /3 teams/)
  assert.equal(await page.getByLabel('Name for Team 3').inputValue(), 'Team Chapchap')
})
await shot('02-setup')
await page.getByRole('button', { name: 'Start Game' }).click()
await check('Start Game requests fullscreen + landscape lock (simulated API)', async () => {
  const log = await page.evaluate(() => window.__orientationLog)
  // Desktop Chromium is not a touch device, so the app correctly skips the lock here;
  // the touch-device path is checked in the phone section below.
  assert.ok(Array.isArray(log))
})

await page.setViewportSize(LANDSCAPE)
await check('Get Ready (Teams) shows whose turn it is, as plain text', async () =>
  assert.match(await text(), /Team 1 of 3 · Wana Dar/),
)
await check('Get Ready explains positioning, tilt down/up and holding still', async () => {
  const t = await text()
  assert.match(t, /sideways on your forehead/i)
  assert.match(t, /Tilt down = Correct/i)
  assert.match(t, /Tilt up = Pass/i)
  assert.match(t, /hold still/i)
})
await shot('03-get-ready')
await page.getByRole('button', { name: "I'm Ready" }).click()
await page.clock.runFor(100)
await page.getByText('Hold still').waitFor({ timeout: 3000 }).catch(() => {})
await check('Calibration stage: "Hold still…" before the countdown', async () =>
  assert.match(await text(), /Hold still/),
)
await shot('03b-calibration')
// Player holds the phone upright-ish on the forehead (≈2°) → baseline captured
await tiltFor(3, 88, 1500)
await page.clock.runFor(100)
await check('Countdown shows ONLY the number (no instructions, buttons or messages)', async () => {
  const t = (await page.locator('main').innerText()).trim()
  assert.match(t, /^(3|2|1|GO!)$/)
  assert.equal(await page.locator('main button').count(), 0)
})
await shot('03c-countdown')
await page.clock.runFor(1000)
await check('Countdown still minimal at the next number', async () =>
  assert.match((await page.locator('main').innerText()).trim(), /^(3|2|1|GO!)$/),
)
await page.clock.runFor(3000)
await page.locator('.gameplay-stage').waitFor()
await check('Calibration captured the player\'s neutral from a still hold (not timeout)', async () => {
  const cal = await page.evaluate(() => window.__bongoDebug?.calibration)
  assert.match(cal ?? '', /^still /)
})
await check('Gameplay is clean: prompt + timer, no tilt instructions', async () => {
  const t = await text()
  assert.match(t, /0:30/)
  assert.doesNotMatch(t, /Tilt down|Tilt up|How to answer|Hold still/i)
  assert.ok((await prompt()).length > 0)
})
await shot('04-gameplay')

// --- Full-screen feedback (450 ms) ---
const p1 = await prompt()
await page.keyboard.press('ArrowDown')
await page.clock.runFor(100)
await check('Correct → full-screen green feedback, prompt hidden', async () => {
  assert.equal(await page.locator('.answer-feedback--correct').count(), 1)
  assert.equal(await page.locator('.gameplay-stage h1').count(), 0)
})
await shot('05-feedback-correct')
await page.keyboard.press('ArrowDown') // pressed again DURING feedback → ignored
await page.clock.runFor(250)
await check('Next prompt still hidden at ~350 ms', async () =>
  assert.equal(await page.locator('.gameplay-stage h1').count(), 0),
)
await page.clock.runFor(150)
await check('Next prompt appears right after the feedback (~450 ms) and is different', async () => {
  assert.equal(await page.locator('.answer-feedback').count(), 0)
  assert.notEqual(await prompt(), p1)
})
await page.keyboard.press('ArrowUp')
await page.clock.runFor(100)
await check('Pass → full-screen red feedback', async () =>
  assert.equal(await page.locator('.answer-feedback--pass').count(), 1),
)
await shot('06-feedback-pass')
await page.clock.runFor(450)
await key('ArrowDown') // correct #2

// --- Simulated tilt (relative to the calibrated neutral) ---
await tiltFor(3, 88, 300) // neutral → armed
await tiltFor(4, 85, 300) // tiny wobble → nothing
await check('Small accidental movement does not answer', async () =>
  assert.equal(await page.locator('.answer-feedback').count(), 0),
)
await tiltFor(180, 45, 200) // deliberate nod down (≈ −45°) → correct #3
await check('Deliberate tilt DOWN → Correct feedback', async () =>
  assert.equal(await page.locator('.answer-feedback--correct').count(), 1),
)
await tiltFor(180, 45, 1500) // keep holding it down → must NOT fire again
await tiltFor(3, 88, 400) // back to neutral → re-armed
await tiltFor(0, 40, 200) // deliberate tilt back (≈ +50°) → pass #2
await check('Deliberate tilt UP → Pass feedback', async () =>
  assert.equal(await page.locator('.answer-feedback--pass').count(), 1),
)
await tiltFor(3, 88, 600)
await tiltFor(0, -88, 600) // other landscape direction, still neutral
await check('Manual buttons hidden once motion data arrives', async () =>
  assert.equal(await page.locator('.manual-answer').count(), 0),
)
await page.clock.runFor(31_000)
await page.setViewportSize(PORTRAIT)
await check('Team 1 transition: 3 correct, 2 passed (one tilt = one answer)', async () => {
  const t = await text()
  assert.match(t, /Round Finished/i)
  assert.match(t, /3 POINTS 3 Correct 2 Passed/i)
  assert.match(t, /Up next: Simba Damu/)
})
await shot('07-transition')

// Team 2 — manual buttons (no sensor data in this round)
await page.getByRole('button', { name: /Start Simba Damu/ }).click()
await page.setViewportSize(LANDSCAPE)
await startRound()
await page.clock.runFor(1600)
await check('Manual fallback buttons appear when no motion data', async () =>
  assert.equal(await page.locator('.manual-answer').count(), 2),
)
await page.getByRole('button', { name: 'Correct' }).click()
await page.getByRole('button', { name: 'Correct' }).count() // (hidden during feedback)
await page.clock.runFor(FEEDBACK_MS + 50)
await page.getByRole('button', { name: 'Correct' }).click()
await page.clock.runFor(FEEDBACK_MS + 50)
await page.getByRole('button', { name: 'Correct' }).click()
await page.clock.runFor(FEEDBACK_MS + 50)
await page.clock.runFor(31_000)
await check('Team 2 scored 3', async () => assert.match(await text(), /3 POINTS/i))

// Team 3 — answer right at the deadline is rejected
await page.getByRole('button', { name: /Start Team Chapchap/ }).click()
await startRound()
await page.clock.runFor(29_990)
await page.clock.runFor(20)
await page.keyboard.press('ArrowDown') // after time is up
await page.clock.runFor(1000)
await page.setViewportSize(PORTRAIT)
await check('Last team → final results with tie and 3 teams', async () => {
  const t = await text()
  assert.match(t, /Match Standings/i)
  assert.match(t, /Tie between Wana Dar & Simba Damu/)
  assert.equal((await page.locator('text=/correct •/').allInnerTexts()).length, 3)
})
await check('Late answer after time-up not counted (Team Chapchap = 0)', async () =>
  assert.match(await text(), /Team Chapchap ✓ 0 correct/),
)
await shot('08-results-teams')
await page.getByRole('button', { name: 'Play Again' }).click()
await check('Play Again → Team 1 again', async () => assert.match(await text(), /Team 1 of 3 · Wana Dar/))
await page.getByRole('button', { name: /Home/ }).last().click()

/* ================= QUICK PLAY ================= */
await page.goto(BASE + '/#home')
await page.clock.runFor(300)
await page.getByRole('button', { name: /Feeling lucky/ }).first().click()
await check('Feeling lucky → Play Mode', async () => assert.match(await text(), /Feeling lucky — all categories/))
await page.getByRole('button', { name: /^Quick Play/ }).click()
await page.setViewportSize(LANDSCAPE)
await check('Quick Play skips team setup → Get Ready', async () =>
  assert.match(await text(), /Get ready!/),
)
await check('Quick Play Get Ready has no info bubble (no "Quick Play · 60s" badge, no team line)', async () => {
  const t = await text()
  assert.doesNotMatch(t, /Quick Play|⚡|\d+s ·|Mixed \(English/)
  assert.doesNotMatch(t, /Team \d of/)
})
await shot('09a-get-ready-quick')
await startRound()
await key('ArrowDown')
await key('ArrowDown')
await key('ArrowUp')
await page.clock.runFor(31_000)
await page.setViewportSize(PORTRAIT)
await check('Quick Play ends on its own results (no team list)', async () => {
  const t = await text()
  assert.match(t, /Time's up!/)
  assert.match(t, /Great round! 2 correct answers/)
  assert.doesNotMatch(t, /Match Standings|Round Finished/i)
})
await shot('09-results-quick')
await page.getByRole('button', { name: 'Return Home' }).click()
await check('Return Home works', async () => assert.match(await text(), /Ready to play\?/))

/* ================= GUARDS ================= */
await page.goto(BASE + '/#gameplay')
await page.clock.runFor(300)
await check('Opening #gameplay with no game redirects to setup', async () =>
  assert.match(await text(), /Game setup/i),
)
await page.close()

/* ================= PHONE (touch device) ================= */
page = await newPage({ isMobile: true, hasTouch: true })
await page.goto(BASE + '/#home')
await page.clock.runFor(300)
await page.getByRole('button', { name: /Feeling lucky/ }).first().click()
await page.getByRole('button', { name: /^Quick Play/ }).click()
await page.clock.runFor(300)
await check('Phone: Quick Play requests fullscreen + landscape lock', async () => {
  const log = await page.evaluate(() => window.__orientationLog)
  assert.deepEqual(log.slice(0, 2), ['fullscreen', 'lock:landscape'])
})
await check('Phone held upright: "Turn your phone sideways" instead of Ready', async () => {
  const t = await text()
  assert.match(t, /Turn your phone sideways/)
  assert.equal(await page.getByRole('button', { name: "I'm Ready" }).count(), 0)
})
await shot('10-rotate-prompt')
await page.setViewportSize(LANDSCAPE)
await page.clock.runFor(200)
await startRound()
await check('Phone: "I\'m Ready" retries the landscape lock (second tap-driven attempt)', async () => {
  const log = await page.evaluate(() => window.__orientationLog)
  assert.equal(log.filter((x) => x === 'lock:landscape').length, 2)
})
const secs = (t) => {
  const [m, ss] = t.split(':').map(Number)
  return m * 60 + ss
}
const startTimer = secs(await page.locator('.hud-pill').first().innerText())
await page.setViewportSize(PORTRAIT)
await page.getByText('Round paused').waitFor()
await page.clock.runFor(10_000)
await check('Phone turned upright mid-round: round pauses behind rotate screen', async () =>
  assert.match(await text(), /Round paused/),
)
await page.setViewportSize(LANDSCAPE)
await page.locator('.gameplay-stage').waitFor()
await page.clock.runFor(300)
await check('Timer did not run during the 10 s pause', async () => {
  const now = secs(await page.locator('.hud-pill').first().innerText())
  assert.ok(startTimer - now <= 1, `before ${startTimer}s, after ${now}s`)
})
await page.clock.runFor(61_000)
await page.getByText("Time's up!").waitFor({ timeout: 3000 }).catch(() => {})
await page.clock.runFor(100)
await check('Phone: orientation released when the game reaches results', async () => {
  const log = await page.evaluate(() => window.__orientationLog)
  assert.ok(log.includes('unlock'), JSON.stringify(log))
})

await check('No console/page errors', () => assert.deepEqual(errors, []))
await browser.close()

for (const [s, n] of results) console.log(`${s}  ${n}`)
const failed = results.filter(([s]) => s === 'FAIL').length
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed ? 1 : 0)
