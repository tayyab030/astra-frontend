import type { InsightsResponse } from "@/lib/api/insights"

export type CachedAiWarning = {
  id: string
  title: string
  message: string
}

/** Scan local insight caches for warning items (no network). */
export function collectCachedAiWarnings(userId: string): CachedAiWarning[] {
  if (typeof window === "undefined" || !userId) return []
  const prefix = `astra-insight:${userId}:`
  const out: CachedAiWarning[] = []
  const seen = new Set<string>()

  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i)
      if (!key || !key.startsWith(prefix)) continue
      const raw = window.localStorage.getItem(key)
      if (!raw) continue
      let data: InsightsResponse | null = null
      try {
        const parsed = JSON.parse(raw) as { data?: InsightsResponse }
        data = parsed?.data ?? null
      } catch {
        continue
      }
      if (!data) continue
      const kind = data.kind ?? "dashboard"
      const items = data.items ?? []
      for (let idx = 0; idx < items.length; idx += 1) {
        const item = items[idx]
        if (item.type !== "warning") continue
        const message = item.message?.trim()
        if (!message) continue
        const id = `${kind}:${idx}:${message.slice(0, 48)}`
        if (seen.has(id)) continue
        seen.add(id)
        out.push({
          id,
          title: item.title?.trim() || "AI warning",
          message,
        })
      }
      const coach = data.coach ?? []
      for (let idx = 0; idx < coach.length; idx += 1) {
        const entry = coach[idx]
        const text = entry.text?.trim()
        if (!text) continue
        const label = (entry.label ?? "").toLowerCase()
        if (!label.includes("warn") && !label.includes("risk") && !label.includes("alert")) {
          continue
        }
        const id = `coach:${kind}:${idx}:${text.slice(0, 48)}`
        if (seen.has(id)) continue
        seen.add(id)
        out.push({
          id,
          title: entry.label || "AI warning",
          message: text,
        })
      }
    }
  } catch {
    return out
  }

  return out.slice(0, 10)
}
