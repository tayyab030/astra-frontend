import { toggleHealthSleep } from "@/lib/api/health"
import type { SleepSession } from "../_types/health.types"
import { getLocalDateString } from "./date"

const QUEUE_KEY = "astra_health_sleep_toggle_queue"
const STORE_VERSION = 1

export interface QueuedSleepToggle {
  id: string
  timestamp: string
  local_date: string
}

interface SleepOfflineStore {
  version: number
  /** Ordered Goodnight/Awake taps. Pairs form sessions; many pairs = many sleep sections. */
  toggles: QueuedSleepToggle[]
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `sleep-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function isNetworkError(error: unknown) {
  if (typeof navigator !== "undefined" && !navigator.onLine) return true
  const err = error as { code?: string; message?: string; response?: unknown }
  if (!err) return false
  if (err.code === "ERR_NETWORK" || err.code === "ECONNABORTED") return true
  if (!err.response && typeof err.message === "string") {
    const msg = err.message.toLowerCase()
    if (msg.includes("network") || msg.includes("failed to fetch")) return true
  }
  return false
}

function emptyStore(): SleepOfflineStore {
  return { version: STORE_VERSION, toggles: [] }
}

function readStore(): SleepOfflineStore {
  if (typeof window === "undefined") return emptyStore()
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as SleepOfflineStore | QueuedSleepToggle[]

    // Migrate legacy bare array → versioned store
    if (Array.isArray(parsed)) {
      return { version: STORE_VERSION, toggles: parsed }
    }
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.toggles)) {
      return { version: STORE_VERSION, toggles: parsed.toggles }
    }
    return emptyStore()
  } catch {
    return emptyStore()
  }
}

function writeStore(store: SleepOfflineStore) {
  if (typeof window === "undefined") return
  localStorage.setItem(
    QUEUE_KEY,
    JSON.stringify({ version: STORE_VERSION, toggles: store.toggles })
  )
}

export function readSleepToggleQueue(): QueuedSleepToggle[] {
  return readStore().toggles
}

export function writeSleepToggleQueue(toggles: QueuedSleepToggle[]) {
  writeStore({ version: STORE_VERSION, toggles })
}

/** Append a tap. Does not clear anything — supports many sleep sections offline. */
export function enqueueSleepToggle(payload: {
  timestamp: string
  local_date: string
}): QueuedSleepToggle {
  const item: QueuedSleepToggle = {
    id: createId(),
    timestamp: payload.timestamp,
    local_date: payload.local_date,
  }
  const store = readStore()
  store.toggles.push(item)
  writeStore(store)
  return item
}

/**
 * Remove one queued tap by id — only call after that tap uploaded successfully.
 * Leaves all other pending sleep sections untouched.
 */
export function removeSleepToggleAfterSuccess(id: string): boolean {
  const store = readStore()
  const index = store.toggles.findIndex((item) => item.id === id)
  if (index < 0) return false
  store.toggles = [...store.toggles.slice(0, index), ...store.toggles.slice(index + 1)]
  writeStore(store)
  return true
}

function formatClock(iso: string) {
  const date = new Date(iso)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
}

function hoursBetween(startedAt: string, endedAt: string) {
  const ms = new Date(endedAt).getTime() - new Date(startedAt).getTime()
  return Math.round(Math.max(0, ms / (1000 * 60 * 60)) * 2) / 2
}

/** Apply pending offline taps on top of server sessions for optimistic UI. */
export function applyPendingSleepToggles(
  serverSessions: SleepSession[],
  queue: QueuedSleepToggle[]
): SleepSession[] {
  if (queue.length === 0) return serverSessions

  const list: SleepSession[] = serverSessions.map((session) => ({ ...session }))

  for (const tap of queue) {
    const activeIndex = list.findIndex((session) => session.isActive)
    if (activeIndex >= 0) {
      const active = list[activeIndex]
      list[activeIndex] = {
        ...active,
        endedAt: tap.timestamp,
        endTime: formatClock(tap.timestamp),
        hours: hoursBetween(active.startedAt, tap.timestamp),
        isActive: false,
        date: tap.local_date,
      }
    } else {
      list.push({
        id: `local-${tap.id}`,
        date: tap.local_date,
        startedAt: tap.timestamp,
        endedAt: null,
        startTime: formatClock(tap.timestamp),
        endTime: null,
        hours: null,
        isActive: true,
      })
    }
  }

  return list
}

export function sumCompletedSleepHours(sessions: SleepSession[], date = getLocalDateString()) {
  const total = sessions.reduce((sum, session) => {
    if (session.isActive || session.date !== date || session.hours == null) return sum
    return sum + session.hours
  }, 0)
  return Math.round(total * 2) / 2
}

let flushPromise: Promise<number> | null = null

/**
 * Upload queued taps in order.
 * Each tap is removed from local store only after that upload succeeds.
 * On failure, remaining taps (including the failed one) stay in local store.
 */
export async function flushSleepToggleQueue(): Promise<number> {
  if (typeof window !== "undefined" && !navigator.onLine) return 0
  if (flushPromise) return flushPromise

  flushPromise = (async () => {
    let synced = 0
    try {
      while (true) {
        const queue = readSleepToggleQueue()
        if (queue.length === 0) break

        const next = queue[0]

        // Upload first — do not touch local store until this resolves
        await toggleHealthSleep({
          timestamp: next.timestamp,
          local_date: next.local_date,
        })

        // Success only: drop this one tap; keep every other sleep section
        removeSleepToggleAfterSuccess(next.id)
        synced += 1
      }
      return synced
    } catch (error) {
      // Intentionally do not clear remaining queue items
      throw error
    } finally {
      flushPromise = null
    }
  })()

  return flushPromise
}
