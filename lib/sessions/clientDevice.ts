export type AuthClientType = "web" | "mobile" | "desktop"

export type ClientDeviceMeta = {
  client_type: AuthClientType
  platform: string
  device_label: string
  user_agent: string
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
  return "Unknown"
}

/** Detect if this build is running as a future desktop shell (Electron/Tauri/PWA standalone). */
function detectDesktopShell(): boolean {
  if (typeof window === "undefined") return false
  const nav = window.navigator as Navigator & { userAgentData?: { mobile?: boolean } }
  if ((window as Window & { electron?: unknown }).electron) return true
  if ((window as Window & { __TAURI__?: unknown }).__TAURI__) return true
  const standalone =
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    (nav as Navigator & { standalone?: boolean }).standalone === true
  // Treat installed PWA on desktop OS as desktop client when not mobile UA.
  if (standalone && !/Mobile|Android|iPhone|iPad/i.test(nav.userAgent || "")) {
    return true
  }
  return false
}

export function getWebClientDeviceMeta(): ClientDeviceMeta {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : ""
  const browser = detectBrowser(ua)
  const os = detectOs(ua)
  const isDesktop = detectDesktopShell()
  const client_type: AuthClientType = isDesktop ? "desktop" : "web"
  const device_label = isDesktop
    ? `${os} · Astra desktop`
    : `${os} · ${browser} · Website`

  return {
    client_type,
    platform: os.toLowerCase().replace(/\s+/g, ""),
    device_label,
    user_agent: ua.slice(0, 512),
  }
}

const SESSION_ID_PREFIX = "astra-auth-session-id:"

export function saveAuthSessionId(userId: string, sessionId: string) {
  if (typeof window === "undefined" || !userId || !sessionId) return
  try {
    window.localStorage.setItem(`${SESSION_ID_PREFIX}${userId}`, sessionId)
  } catch {
    // ignore
  }
}

export function loadAuthSessionId(userId: string): string | null {
  if (typeof window === "undefined" || !userId) return null
  try {
    return window.localStorage.getItem(`${SESSION_ID_PREFIX}${userId}`)
  } catch {
    return null
  }
}

export function clearAuthSessionId(userId: string) {
  if (typeof window === "undefined" || !userId) return
  try {
    window.localStorage.removeItem(`${SESSION_ID_PREFIX}${userId}`)
  } catch {
    // ignore
  }
}

export function clientTypeLabel(type: AuthClientType | string): string {
  if (type === "mobile") return "Mobile app"
  if (type === "desktop") return "Desktop software"
  return "Website"
}
