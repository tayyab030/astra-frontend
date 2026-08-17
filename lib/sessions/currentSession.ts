export type CurrentSessionInfo = {
  id: string
  userId: string
  startedAt: string
  lastSeenAt: string
  browser: string
  os: string
  deviceLabel: string
  userAgent: string
}

const STORAGE_PREFIX = "astra-current-session:"

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`
}

function detectBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return "Microsoft Edge"
  if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return "Opera"
  if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) return "Chrome"
  if (/Firefox\//i.test(ua)) return "Firefox"
  if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return "Safari"
  return "Browser"
}

function detectOs(ua: string): string {
  if (/Windows NT/i.test(ua)) return "Windows"
  if (/Mac OS X|Macintosh/i.test(ua)) return "macOS"
  if (/Android/i.test(ua)) return "Android"
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS"
  if (/Linux/i.test(ua)) return "Linux"
  return "Unknown OS"
}

function detectDeviceLabel(ua: string, os: string, browser: string): string {
  if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
    return `${os} · ${browser} (mobile)`
  }
  return `${os} · ${browser}`
}

export function parseUserAgent(ua = typeof navigator !== "undefined" ? navigator.userAgent : "") {
  const browser = detectBrowser(ua)
  const os = detectOs(ua)
  return {
    browser,
    os,
    deviceLabel: detectDeviceLabel(ua, os, browser),
    userAgent: ua || "unknown",
  }
}

export function loadCurrentSession(userId: string): CurrentSessionInfo | null {
  if (typeof window === "undefined" || !userId) return null
  try {
    const raw = window.localStorage.getItem(storageKey(userId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as CurrentSessionInfo
    if (!parsed?.id || parsed.userId !== userId) return null
    return parsed
  } catch {
    return null
  }
}

export function saveCurrentSession(session: CurrentSessionInfo) {
  if (typeof window === "undefined" || !session.userId) return
  try {
    window.localStorage.setItem(storageKey(session.userId), JSON.stringify(session))
  } catch {
    // ignore
  }
}

export function clearCurrentSession(userId: string) {
  if (typeof window === "undefined" || !userId) return
  try {
    window.localStorage.removeItem(storageKey(userId))
  } catch {
    // ignore
  }
}

/** Create or refresh the local record for this browser session. */
export function ensureCurrentSession(userId: string): CurrentSessionInfo | null {
  if (typeof window === "undefined" || !userId) return null
  const uaInfo = parseUserAgent()
  const existing = loadCurrentSession(userId)
  const now = new Date().toISOString()

  if (existing) {
    const updated: CurrentSessionInfo = {
      ...existing,
      ...uaInfo,
      lastSeenAt: now,
    }
    saveCurrentSession(updated)
    return updated
  }

  const created: CurrentSessionInfo = {
    id: `local-${Date.now().toString(36)}`,
    userId,
    startedAt: now,
    lastSeenAt: now,
    ...uaInfo,
  }
  saveCurrentSession(created)
  return created
}

export function formatSessionWhen(iso: string | null | undefined) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return "—"
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}
