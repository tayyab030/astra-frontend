import type {
  InsightKind,
  InsightPeriod,
  InsightsResponse,
} from "@/lib/api/insights"

type StoredInsight = {
  data: InsightsResponse
  fetchedAt: number
  period_key?: string
  cache_until?: string
}

function storageKey(
  userId: string,
  kind: InsightKind,
  period: InsightPeriod,
  fingerprint: string,
  contextKey = ""
) {
  const contextPart = contextKey ? `:${hashContextKey(contextKey)}` : ""
  return `astra-insight:${userId}:${kind}:${period}:${fingerprint}${contextPart}`
}

/** Short stable hash so storage keys stay compact when context JSON is large. */
function hashContextKey(contextKey: string) {
  let hash = 0
  for (let i = 0; i < contextKey.length; i += 1) {
    hash = (hash * 31 + contextKey.charCodeAt(i)) | 0
  }
  return Math.abs(hash).toString(36)
}

function isFresh(stored: StoredInsight): boolean {
  if (!stored?.data) return false
  if (stored.cache_until) {
    const until = Date.parse(stored.cache_until)
    if (Number.isFinite(until)) return Date.now() < until
  }
  if (stored.data.cache_until) {
    const until = Date.parse(stored.data.cache_until)
    if (Number.isFinite(until)) return Date.now() < until
  }
  // Fallback: weekly ~7d, monthly ~31d from fetch
  const ttl =
    stored.data.period === "monthly"
      ? 31 * 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000
  return Date.now() - stored.fetchedAt < ttl
}

export function readInsightCache(
  userId: string,
  kind: InsightKind,
  period: InsightPeriod,
  fingerprint: string,
  contextKey = ""
): InsightsResponse | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(
      storageKey(userId, kind, period, fingerprint, contextKey)
    )
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredInsight
    if (!isFresh(parsed)) return null
    return parsed.data
  } catch {
    return null
  }
}

export function writeInsightCache(
  userId: string,
  kind: InsightKind,
  period: InsightPeriod,
  fingerprint: string,
  data: InsightsResponse,
  contextKey = ""
) {
  if (typeof window === "undefined") return
  try {
    const payload: StoredInsight = {
      data,
      fetchedAt: Date.now(),
      period_key: data.period_key,
      cache_until: data.cache_until,
    }
    window.localStorage.setItem(
      storageKey(userId, kind, period, fingerprint, contextKey),
      JSON.stringify(payload)
    )
  } catch {
    // ignore quota / private mode
  }
}
