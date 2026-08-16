"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  DEFAULT_INSIGHT_PERIOD,
  fetchInsights,
  insightsHaveContent,
  shuffleInsightItems,
  type InsightKind,
  type InsightPeriod,
  type InsightsResponse,
} from "@/lib/api/insights"
import { DEFAULT_AI_INSIGHTS, aiSettingsFingerprint } from "@/lib/ai-settings"
import {
  readInsightCache,
  writeInsightCache,
} from "@/lib/insights/insightStorage"
import { withCurrencyInsightContext } from "@/lib/insights/withCurrencyContext"
import { useAppSelector } from "@/store/hooks"

function stableContextKey(context: Record<string, unknown> | undefined) {
  try {
    return JSON.stringify(context ?? {})
  } catch {
    return ""
  }
}

export function useAiInsight(
  kind: InsightKind,
  context: Record<string, unknown> | undefined,
  options?: { enabled?: boolean; period?: InsightPeriod }
) {
  const user = useAppSelector((s) => s.user.user)
  const currencyCode = useAppSelector((s) => s.currency.code)
  const currencyRates = useAppSelector((s) => s.currency.rates)
  const userId = user?.id ?? ""
  const period = options?.period ?? DEFAULT_INSIGHT_PERIOD
  const smartInsightsEnabled =
    typeof user?.ai_insights === "boolean" ? user.ai_insights : DEFAULT_AI_INSIGHTS

  const fingerprint = aiSettingsFingerprint({
    ...user,
    currency: currencyCode || user?.currency,
  })

  const enrichedContext = useMemo(
    () =>
      withCurrencyInsightContext(
        context,
        currencyCode || user?.currency || "USD",
        currencyRates
      ),
    [context, currencyCode, currencyRates, user?.currency]
  )

  const enabled =
    Boolean(options?.enabled ?? true) &&
    smartInsightsEnabled &&
    Boolean(userId)

  const contextKey = useMemo(
    () => stableContextKey(enrichedContext),
    [enrichedContext]
  )

  const query = useQuery({
    queryKey: ["ai-insight", userId, kind, period, fingerprint, contextKey],
    enabled,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 31 * 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: () => {
      if (!userId) return undefined
      return (
        readInsightCache(userId, kind, period, fingerprint, contextKey) ??
        undefined
      )
    },
    queryFn: async (): Promise<InsightsResponse> => {
      const cached = readInsightCache(
        userId,
        kind,
        period,
        fingerprint,
        contextKey
      )
      if (cached) {
        return {
          ...cached,
          items: cached.items ? shuffleInsightItems(cached.items) : cached.items,
        }
      }

      const data = await fetchInsights({
        kind,
        period,
        context: enrichedContext,
      })
      if (data.enabled !== false && insightsHaveContent(data)) {
        writeInsightCache(
          userId,
          kind,
          period,
          fingerprint,
          data,
          contextKey
        )
      }
      return {
        ...data,
        items: data.items ? shuffleInsightItems(data.items) : data.items,
      }
    },
  })

  const data = enabled ? query.data : undefined
  const hasInsight = insightsHaveContent(data)
  const isLoading = enabled && query.isLoading && !data

  return {
    data,
    hasInsight,
    isLoading,
    enabled,
    period,
    smartInsightsEnabled,
  }
}
