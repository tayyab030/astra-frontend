"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Clock, Hash, Trophy } from "lucide-react"
import { formatDuration } from "../../_utils/formatTime"
import { getDashboardStats } from "../../_utils/timeTrackCharts"

type DashboardStatsData = ReturnType<typeof getDashboardStats>

interface DashboardStatsProps {
  stats: DashboardStatsData
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      title: "Total Time",
      value: formatDuration(stats.totalSeconds),
      icon: Clock,
      color: "text-cyan-300",
      bg: "bg-cyan-500/20",
    },
    {
      title: "Avg per Day",
      value: formatDuration(Math.round(stats.avgPerDaySeconds)),
      icon: BarChart3,
      color: "text-blue-300",
      bg: "bg-blue-500/20",
    },
    {
      title: "Top Task",
      value: stats.topTask.length > 20 ? stats.topTask.slice(0, 20) + "…" : stats.topTask,
      subtitle: stats.topTaskSeconds > 0 ? formatDuration(stats.topTaskSeconds) : undefined,
      icon: Trophy,
      color: "text-amber-300",
      bg: "bg-amber-500/20",
    },
    {
      title: "Sessions",
      value: String(stats.sessionCount),
      icon: Hash,
      color: "text-emerald-300",
      bg: "bg-emerald-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
            <CardContent className="flex items-center gap-3 py-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-mono">{card.title}</p>
                <p className={`text-lg font-bold font-mono truncate ${card.color}`}>{card.value}</p>
                {card.subtitle && (
                  <p className="text-xs text-slate-500 font-mono">{card.subtitle}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
