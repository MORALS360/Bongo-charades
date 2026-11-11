/**
 * Bongo Charades — end-to-end BROWSER SIMULATION of a complete game.
 *
 * This drives a real Chromium browser through: Home → Categories → Setup →
 * Forehead → 3-2-1-GO → Gameplay (taps + simulated tilt) → Team transition →
 * … → Final results → Play Again → Return Home, plus edge cases.
 *
 * It uses Playwright's fake clock, so a 30-second round takes milliseconds.
 * Tilt is SIMULATED by dispatching fake 'deviceorientation' events — this proves the
 * app logic, NOT that a real phone's sensors behave the same. Real-device testing
 * is still required.
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
const results = []
const check = async (name, fn) => {
  try {
    await fn()
    results.push(['PASS', name])
  } catch (e) {
    results.push(['FAIL', name + ' — ' + e.message])
  }
}

// If a step crashes, still print what passed so far
process.on('exit', (code) => {
  if (code !== 0 && results.length) for (const [st, n] of results) console.log(`${st}  ${n}`)
})

const LANDSCAPE = { width: 844, height: 390 }
const PORTRAIT = { width: 390, height: 844 }

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: PORTRAIT })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
await page.clock.install()

const shot = async (name) => SHOTS && page.screenshot({ path: `${SHOTS}/${name}.png` })
const text = async () => (await page.innerText('body')).replace(/\s+/g, ' ')
const score = async () => Number((await page.locator('.hud-pill').nth(1).innerText()).match(/\d+/)[0])
const prompt = async () => (await page.locator('h1').first().innerText()).trim()
const tilt = (beta, gamma) =>
  page.evaluate(
    ([b, g]) => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: b, gamma: g })),
    [beta, gamma],
  )
const tap = async (label) => {
  await page.getByRole('button', { name: label }).first().click()
  await page.clock.runFor(450) // wait past the 400 ms answer lock
}

/* ---------- Setup ---------- */
await page.goto(BASE + '/#home')
await page.evaluate(() => localStorage.clear())
await page.goto(BASE + '/#setup')
await page.reload()
await page.clock.runFor(300)
// Remove every pre-selected category chip, then Start must be disabled
while ((await page.getByRole('button', { name: /^Remove / }).count()) > 0) {
  await page.getByRole('button', { name: /^Remove / }).first().click()
}
await check('Start Game is disabled when no categories are chosen', async () =>
  assert.equal(await page.getByRole('button', { name: 'Start Game' }).isDisabled(), true),
)

await page.goto(BASE + '/#categories')
await page.getByText('Bongo Flava', { exact: true }).first().click()
await page.getByText('Animals', { exact: true }).first().click()
await page.getByRole('button', { name: /Continue to Setup/ }).click()
await page.getByRole('button', { name: '3', exact: true }).click()
await page.getByRole('button', { name: '30s', exact: true }).click()
await shot('01-setup')
await page.getByRole('button', { name: 'Start Game' }).click()

/* ---------- Team 1 ---------- */
await page.setViewportSize(LANDSCAPE)
let t = await text()
await check('Forehead screen shows Team 1/3 with real team name', () =>
  assert.match(t, /Team 1\/3: Wana Dar/),
)
await shot('02-forehead')
await page.getByRole('button', { name: "I'm Ready" }).click()
t = await text()
await check('Countdown starts at 3', () => assert.match(t, /3/))
await page.clock.runFor(1100)
await shot('03-countdown')
await page.clock.runFor(3000)
t = await text()
await check('Gameplay screen reached after 3-2-1-GO', () => assert.match(t, /Correct/))
await check('Timer starts at 0:30', () => assert.match(t, /0:30/))
await check('Active team name shown', () => assert.match(t, /Wana Dar/i))
await shot('04-gameplay')

const p1 = await prompt()
await check('Prompt is not empty/undefined', () => {
  assert.ok(p1.length > 0)
  assert.ok(!/undefined|null/i.test(p1))
})
await tap('Correct')
const p2 = await prompt()
await check('Prompt changes after an answer', () => assert.notEqual(p1, p2))
await tap('Correct')
await tap('Pass')
await check('Score after Correct, Correct, Pass = 2', async () => assert.equal(await score(), 2))

// Rapid double tap: only one point
await page.getByRole('button', { name: 'Correct' }).first().dblclick()
await page.clock.runFor(450)
await check('Rapid double-tap awards only 1 point', async () => assert.equal(await score(), 3))

// Simulated tilt: upright, then nod down = correct; holding down does not repeat
await tilt(0, 90)
await page.clock.runFor(100)
await tilt(180, 40) // screen facing floor ~ -40°
await page.clock.runFor(100)
const afterTilt = await score()
await tilt(180, 30)
await page.clock.runFor(1500)
await tilt(180, 20)
await page.clock.runFor(500)
await check('Simulated tilt DOWN = Correct (+1)', () => assert.equal(afterTilt, 4))
await check('Holding the tilt does not award extra points', async () =>
  assert.equal(await score(), 4),
)
// Back to upright then tilt up = pass (score unchanged, prompt changes)
await tilt(0, 90)
await page.clock.runFor(100)
const beforePass = await prompt()
await tilt(0, 40) // screen facing ceiling ~ +50°
await page.clock.runFor(500)
await check('Simulated tilt UP = Pass (no point, new prompt)', async () => {
  assert.equal(await score(), 4)
  assert.notEqual(await prompt(), beforePass)
})

// Upright on forehead in either landscape direction never fires
await tilt(0, 90)
await page.clock.runFor(800)
await tilt(0, -90)
await page.clock.runFor(800)
await tilt(3, -87)
await page.clock.runFor(800)
await check('Upright forehead position (both landscape directions) never fires', async () =>
  assert.equal(await score(), 4),
)

// Run the clock to the end of the round
await page.clock.runFor(31_000)
await page.setViewportSize(PORTRAIT)
t = await text()
await check('Round ends at 0 → transition screen', () => assert.match(t, /Round Finished/i))
await check('Transition shows Team 1 score 4 and next team', () => {
  assert.match(t, /Great round, Wana Dar/)
  assert.match(t, /Up next: Simba Damu/)
})
await shot('05-transition')

await page.getByRole('button', { name: /View Current Standings/ }).click()
t = await text()
await check('Mid-game standings show leader', () => assert.match(t, /Wana Dar is in the lead/))
await shot('06-standings')
await page.getByRole('button', { name: 'Back to Game' }).click()

/* ---------- Team 2 ---------- */
await page.getByRole('button', { name: /Start Simba Damu/ }).click()
await page.setViewportSize(LANDSCAPE)
t = await text()
await check('Team 2 forehead screen', () => assert.match(t, /Team 2\/3: Simba Damu/))
await page.getByRole('button', { name: "I'm Ready" }).click()
await page.clock.runFor(4100)
await check('Team 2 starts on 0 points', async () => assert.equal(await score(), 0))
for (let i = 0; i < 4; i++) await tap('Correct')
await page.clock.runFor(31_000)

/* ---------- Team 3 ---------- */
await page.getByRole('button', { name: /Start Team Chapchap/ }).click()
await page.getByRole('button', { name: "I'm Ready" }).click()
await page.clock.runFor(4100)
await tap('Pass')
await page.clock.runFor(29_000)
const lastPrompt = await prompt()
await page.clock.runFor(2_000)
await page.setViewportSize(PORTRAIT)
t = await text()
await check('After last team → final results (no 4th team)', () => assert.match(t, /Match Standings/i))
await check('Tie for first is announced', () =>
  assert.match(t, /Tie between Wana Dar & Simba Damu/),
)
await check('Prompt shown at time-up was a real prompt', () => assert.ok(lastPrompt.length > 0))
await shot('07-results')
const rows = await page.locator('text=/correct •/').allInnerTexts()
await check('All 3 teams listed in results', () => assert.equal(rows.length, 3))

/* ---------- Play Again ---------- */
await page.getByRole('button', { name: 'Play Again' }).click()
t = await text()
await check('Play Again → Team 1 forehead, same teams', () => assert.match(t, /Team 1\/3: Wana Dar/))
await page.getByRole('button', { name: "I'm Ready" }).click()
await page.clock.runFor(4100)
await check('Scores reset after Play Again', async () => assert.equal(await score(), 0))

/* ---------- Leaving mid-game & guards ---------- */
await page.goBack()
await page.clock.runFor(300)
t = await text()
await check('Browser Back during gameplay leaves to Game Setup', () => assert.match(t, /Game setup/i))
await page.goto(BASE + '/#gameplay')
await page.clock.runFor(300)
t = await text()
await check('Opening #gameplay with no game running redirects to Setup', () =>
  assert.match(t, /Game setup/i),
)

/* ---------- Portrait warning ---------- */
await page.getByRole('button', { name: 'Start Game' }).click()
await page.getByRole('button', { name: "I'm Ready" }).click()
await page.clock.runFor(4100)
await page.setViewportSize(PORTRAIT)
await page.clock.runFor(300)
t = await text()
await check('Rotate-phone message on portrait phone during gameplay', () =>
  assert.match(t, /Rotate to Landscape/),
)
await shot('08-portrait-warning')

/* ---------- Return Home from results (2-team quick game) ---------- */
await page.goto(BASE + '/#setup')
await page.clock.runFor(300)
await page.getByRole('button', { name: '2', exact: true }).click()
await page.getByRole('button', { name: 'Start Game' }).click()
for (let team = 0; team < 2; team++) {
  if (team === 1) await page.getByRole('button', { name: /Start .*Turn/ }).click()
  await page.getByRole('button', { name: "I'm Ready" }).click()
  await page.clock.runFor(4100)
  await page.clock.runFor(31_000)
}
t = await text()
await check('0–0 game shows a friendly no-winner message', () => assert.match(t, /Good effort all teams/))
await page.getByRole('button', { name: 'Return Home' }).click()
t = await text()
await check('Return Home works', () => assert.match(t, /Ready to play\?/))

await check('No console/page errors', () => assert.deepEqual(errors, []))
await browser.close()

for (const [s, n] of results) console.log(`${s}  ${n}`)
const failed = results.filter(([s]) => s === 'FAIL').length
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed ? 1 : 0)
