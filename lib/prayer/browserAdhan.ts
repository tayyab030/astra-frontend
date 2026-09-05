/**
 * Browser Adhan while the Prayer page (or app shell) stays open.
 * Closed-tab / background delivery needs a service worker later.
 */

type AdhanPrayer = { key: string; name: string; time: string }

let pendingTimeouts: number[] = []

function clearPending() {
  for (const id of pendingTimeouts) {
    window.clearTimeout(id)
  }
  pendingTimeouts = []
}

function parsePrayerTimeToday(time: string, now: Date): Date | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim())
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null
  }
  const target = new Date(now)
  target.setHours(hours, minutes, 0, 0)
  return target
}

function playBeep() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.value = 660
    gain.gain.value = 0.08
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2)
    osc.stop(ctx.currentTime + 1.25)
    window.setTimeout(() => {
      void ctx.close()
    }, 1500)
  } catch {
    // ignore audio failures
  }
}

async function ensurePermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false
  }
  if (Notification.permission === "granted") return true
  if (Notification.permission === "denied") return false
  const result = await Notification.requestPermission()
  return result === "granted"
}

function fireAdhan(prayer: AdhanPrayer) {
  playBeep()
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      try {
        new Notification(`Adhan · ${prayer.name}`, {
          body: `It's time for ${prayer.name}`,
          tag: `adhan-${prayer.key}`,
        })
      } catch {
        // ignore
      }
    }
  }
}

/** Schedule in-page Adhan for remaining prayers today. Call cancelBrowserAdhan on cleanup. */
export async function scheduleBrowserAdhan(
  prayers: AdhanPrayer[],
  keys: string[]
): Promise<void> {
  clearPending()
  if (!keys.length || typeof window === "undefined") return

  const granted = await ensurePermission()
  if (!granted) return

  const keySet = new Set(keys)
  const now = new Date()

  for (const prayer of prayers) {
    if (!keySet.has(prayer.key)) continue
    const at = parsePrayerTimeToday(prayer.time, now)
    if (!at || at.getTime() <= now.getTime()) continue
    const delay = at.getTime() - now.getTime()
    const id = window.setTimeout(() => fireAdhan(prayer), delay)
    pendingTimeouts.push(id)
  }
}

export function cancelBrowserAdhan() {
  clearPending()
}
