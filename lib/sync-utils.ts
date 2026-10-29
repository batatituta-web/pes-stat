// Postgres jsonb reorders object keys, so states must be compared with a key-order independent serialization.
export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => entry !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`).join(',')}}`
  }
  return JSON.stringify(value)
}

let audioContext: AudioContext | null = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioContext) {
    const AudioContextClass = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return null
    audioContext = new AudioContextClass()
  }
  return audioContext
}

// Browsers block audio until the user interacts with the page, so the context is unlocked on the first gesture.
export function unlockNotificationSound() {
  const context = getAudioContext()
  if (context?.state === 'suspended') void context.resume()
}

export function playUpdateSound() {
  const context = getAudioContext()
  if (!context) return
  if (context.state === 'suspended') void context.resume()
  const start = context.currentTime
  ;[660, 880].forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const noteStart = start + index * 0.14
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, noteStart)
    gain.gain.exponentialRampToValueAtTime(0.25, noteStart + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.22)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(noteStart)
    oscillator.stop(noteStart + 0.25)
  })
}
