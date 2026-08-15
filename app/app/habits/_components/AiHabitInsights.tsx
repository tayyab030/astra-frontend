"use client"

import { Brain } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InsightHorizonBadge } from "@/components/insights/InsightHorizonBadge"
import { useAiInsight } from "@/hooks/useAiInsight"

const insightStyles = [
  "from-primary/15 to-primary/5 border-primary/25",
  "from-orange-500/15 to-amber-500/5 border-orange-500/25",
  "from-emerald-500/15 to-teal-500/5 border-emerald-500/25",
]

type HabitInsightSummary = {
  total: number
  completed: number
  highCompleted: number
  highTotal: number
  longestStreak: number
  longestStreakHabitName?: string | null
  habits: { name: string; streak: number; completed: boolean; priority: string }[]
}

export function AiHabitInsights({ summary }: { summary: HabitInsightSummary }) {
  const context = {
    total: summary.total,
    completed: summary.completed,
    highCompleted: summary.highCompleted,
    highTotal: summary.highTotal,
    longestStreak: summary.longestStreak,
    longestStreakHabitName: summary.longestStreakHabitName ?? null,
    habits: summary.habits.slice(0, 12),
  }

  const { data, hasInsight, isLoading, enabled } = useAiInsight("habits", context)

  if (!enabled || (!hasInsight && !isLoading)) return null

  return (
    <Card className="astra-card">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <Brain className="mr-2 h-5 w-5 text-yellow-500" />
          AI Habit Insights
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
