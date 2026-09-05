"use client"

import { useMemo } from "react"
import { Brain } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InsightHorizonBadge } from "@/components/insights/InsightHorizonBadge"
import { useAiInsight } from "@/hooks/useAiInsight"
import { useAppSelector } from "@/store/hooks"
import { useDashboard } from "@/app/app/dashboard/_hooks/useDashboard"
import { buildLifeOsInsightExtras } from "@/lib/insights/lifeOsContext"
import { buildPrayerInsightSlice } from "@/lib/insights/prayerInsightContext"
import type { PrayerDayLog, PrayerTimings } from "@/lib/api/prayer"
import type { PrayerAnalysisInsightSlice } from "@/lib/insights/prayerInsightContext"

const insightStyles = [
  "from-primary/15 to-primary/5 border-primary/25",
  "from-emerald-500/15 to-teal-500/5 border-emerald-500/25",
  "from-cyan-500/15 to-blue-500/5 border-cyan-500/25",
]

type AiPrayerInsightsProps = {
  timings: PrayerTimings | null
  today: PrayerDayLog | null
  analysis: PrayerAnalysisInsightSlice
  enabled?: boolean
}

export function AiPrayerInsights({
  timings,
  today,
  analysis,
  enabled = true,
}: AiPrayerInsightsProps) {
  const user = useAppSelector((state) => state.user.user)
  const { dashboard: lifeOs } = useDashboard()

  const context = useMemo(
    () => ({
      ...buildLifeOsInsightExtras(user, lifeOs),
      ...buildPrayerInsightSlice({ timings, today, analysis }),
    }),
    [user, lifeOs, timings, today, analysis]
  )

  const { data, hasInsight, isLoading, enabled: insightsOn } = useAiInsight(
    "prayer",
    context,
    { enabled }
  )

  if (!insightsOn || (!hasInsight && !isLoading)) return null

  return (
    <Card className="astra-card">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <Brain className="mr-2 h-5 w-5 text-yellow-500" />
          AI Prayer Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && !hasInsight ? (
          <div className="space-y-3">
            <div className="h-12 rounded-lg border animate-pulse bg-muted/30" />
            <div className="h-12 rounded-lg border animate-pulse bg-muted/30" />
          </div>
        ) : (
          <div className="space-y-3">
            {(data?.items ?? []).map((item, index) => (
              <div
                key={`${item.message}-${index}`}
                className={`rounded-lg border bg-gradient-to-r p-3 backdrop-blur-sm space-y-1.5 ${insightStyles[index % insightStyles.length]}`}
              >
                <InsightHorizonBadge horizon={item.horizon} />
                <p className="text-sm text-foreground">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
