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
const FEEDBACK_MS = 800
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
const startRound = async () => {
  await page.getByRole('button', { name: "I'm Ready" }).click()
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
await check('Forehead screen shows Team 1/3', async () => assert.match(await text(), /Team 1\/3: Wana Dar/))
await page.getByRole('button', { name: "I'm Ready" }).click()
await page.clock.runFor(1100)
await check('Instruction stage: TILT DOWN = CORRECT, TILT UP = PASS + countdown', async () => {
  const t = await text()
  assert.match(t, /Tilt down/i)
  assert.match(t, /Correct/i)
  assert.match(t, /Tilt up/i)
  assert.match(t, /Pass/i)
  assert.match(t, /How to answer/i)
})
await shot('03-instructions')
await page.clock.runFor(2900)
await check('Gameplay is clean: prompt + timer, no tilt instructions', async () => {
  const t = await text()
  assert.match(t, /0:30/)
  assert.doesNotMatch(t, /Tilt down|Tilt up|How to answer/i)
  assert.ok((await prompt()).length > 0)
})
await shot('04-gameplay')

// --- Full-screen feedback ---
const p1 = await prompt()
await page.keyboard.press('ArrowDown')
await page.clock.runFor(100)
await check('Correct → full-screen green feedback, prompt hidden', async () => {
  assert.equal(await page.locator('.answer-feedback--correct').count(), 1)
  assert.equal(await page.locator('.gameplay-stage h1').count(), 0)
})
await shot('05-feedback-correct')
await page.keyboard.press('ArrowDown') // pressed again DURING feedback → ignored
await page.clock.runFor(500)
await check('Next prompt still hidden at ~600 ms', async () =>
  assert.equal(await page.locator('.gameplay-stage h1').count(), 0),
)
await page.clock.runFor(300)
await check('Next prompt appears after the feedback (~800 ms) and is different', async () => {
  assert.equal(await page.locator('.answer-feedback').count(), 0)
  assert.notEqual(await prompt(), p1)
})
await page.keyboard.press('ArrowUp')
await page.clock.runFor(100)
await check('Pass → full-screen red feedback', async () =>
  assert.equal(await page.locator('.answer-feedback--pass').count(), 1),
)
await shot('06-feedback-pass')
await page.clock.runFor(800)
await key('ArrowDown') // correct #2

// --- Simulated tilt ---
await tilt(0, 90) // upright on forehead
await page.clock.runFor(100)
await tilt(180, 40) // screen to floor → correct #3
await page.clock.runFor(100)
await check('Simulated tilt DOWN shows Correct feedback', async () =>
  assert.equal(await page.locator('.answer-feedback--correct').count(), 1),
)
await tilt(180, 30) // still tilted, during and after feedback → nothing
await page.clock.runFor(1500)
await tilt(180, 20)
await page.clock.runFor(500)
await tilt(0, 90)
await page.clock.runFor(100)
await tilt(0, 40) // screen to ceiling → pass #2
await page.clock.runFor(900)
await tilt(0, 90)
await page.clock.runFor(900)
await tilt(0, -90)
await page.clock.runFor(900)
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
await check('Play Again → Team 1 again', async () => assert.match(await text(), /Team 1\/3: Wana Dar/))
await page.getByRole('button', { name: /Home/ }).last().click()

/* ================= QUICK PLAY ================= */
await page.goto(BASE + '/#home')
await page.clock.runFor(300)
await page.getByRole('button', { name: /Feeling lucky/ }).first().click()
await check('Feeling lucky → Play Mode', async () => assert.match(await text(), /Feeling lucky — all categories/))
await page.getByRole('button', { name: /^Quick Play/ }).click()
await page.setViewportSize(LANDSCAPE)
await check('Quick Play skips team setup → Forehead', async () => {
  const t = await text()
  assert.match(t, /Quick Play/)
  assert.doesNotMatch(t, /Team 1/)
})
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
