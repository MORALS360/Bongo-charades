/**
 * Bongo Charades — Web Audio API Synthesized Sound & Haptics Engine
 *
 * Provides real-time sound effects and vibration without external audio files:
 * - Countdown tick (3, 2, 1) & GO! chime
 * - Correct answer chime (ascending frequencies)
 * - Pass answer swoosh (descending frequencies)
 * - Time's up fanfare
 * - Safe fallback if Web Audio is unsupported or muted
 */

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      // @ts-expect-error WebkitAudioContext fallback for older Safari
      window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

/**
 * Play a tone with frequency and envelope.
 */
function playTone(freq: number, type: OscillatorType, duration: number, delay = 0) {
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, now)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + duration + 0.05)
  } catch {
    // Audio playback error swallowed gracefully
  }
}

/**
 * Countdown tick: short beep for 3, 2, 1; high celebratory tone for GO!
 */
export function playCountdownTick(isGo = false) {
  if (isGo) {
    playTone(880, 'sine', 0.25)
    playTone(1174, 'triangle', 0.35, 0.08)
    triggerHaptic([60, 40, 100])
  } else {
    playTone(587.33, 'sine', 0.12)
    triggerHaptic([40])
  }
}

/**
 * Positive chime on Correct answer (two-tone rising harmony: C5 -> G5).
 */
export function playCorrectSound() {
  playTone(523.25, 'triangle', 0.15) // C5
  playTone(783.99, 'sine', 0.22, 0.08) // G5
  triggerHaptic([40, 30, 70])
}

/**
 * Pass sound: swift downward swoosh.
 */
export function playPassSound() {
  const ctx = getAudioContext()
  if (!ctx) {
    triggerHaptic([90])
    return
  }

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.18)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.2)
  } catch {
    // Swallow audio error
  }
  triggerHaptic([80])
}

/**
 * Time's up fanfare: celebratory 4-note brass sequence.
 */
export function playTimeUpSound() {
  playTone(523.25, 'triangle', 0.18, 0) // C5
  playTone(659.25, 'triangle', 0.18, 0.12) // E5
  playTone(783.99, 'triangle', 0.22, 0.24) // G5
  playTone(1046.5, 'triangle', 0.45, 0.38) // C6
  triggerHaptic([100, 50, 100, 50, 200])
}

/**
 * Trigger mobile haptic vibration if supported.
 */
export function triggerHaptic(pattern: number[]) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern)
    } catch {
      // Haptics not allowed or denied
    }
  }
}
