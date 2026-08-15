"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"
import { InsightHorizonBadge } from "@/components/insights/InsightHorizonBadge"
import { useAiInsight } from "@/hooks/useAiInsight"
import type { Goal } from "@/lib/api/goals"

const insightStyles = [
  "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
  "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  "from-cyan-400/20 to-blue-400/20 border-cyan-400/30",
]

type AiGoalInsightsProps = {
  goals: Goal[]
  activeCount?: number
  avgProgress?: number
}

export function AiGoalInsights({ goals, activeCount, avgProgress }: AiGoalInsightsProps) {
  const context = {
    activeCount: activeCount ?? goals.filter((g) => g.progress < 100).length,
    avgProgress:
      avgProgress ??
      (goals.length
        ? Math.round(goals.reduce((sum, g) => sum + (g.progress ?? 0), 0) / goals.length)
        : 0),
    goals: goals.slice(0, 10).map((g) => ({
      title: g.title,
      category: g.category,
      progress: g.progress,
      priority: g.priority,
      streak: g.streak,
      target_date: g.target_date,
    })),
  }

  const { data, hasInsight, isLoading, enabled } = useAiInsight("goals", context)

  if (!enabled || (!hasInsight && !isLoading)) return null

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-poppins flex items-center">
          <Brain className="mr-2 h-5 w-5 text-yellow-400" />
          <span className="text-cyan-300">AI Goal Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && !hasInsight ? (
          <div className="space-y-3">
            <div className="h-12 rounded-lg border animate-pulse bg-slate-700/40" />
            <div className="h-12 rounded-lg border animate-pulse bg-slate-700/40" />
          </div>
        ) : (
          <div className="space-y-3">
            {(data?.items ?? []).map((item, index) => (
              <div
                key={`${item.message}-${index}`}
                className={`p-3 bg-gradient-to-r ${insightStyles[index % insightStyles.length]} rounded-lg border backdrop-blur-sm space-y-1.5`}
              >
                <InsightHorizonBadge horizon={item.horizon} />
                <p className="text-sm font-inter text-slate-200">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
