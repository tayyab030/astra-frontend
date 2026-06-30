"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, Clock, TrendingUp } from "lucide-react"
import { formatDuration } from "../../_utils/formatTime"

interface WeeklySummaryCardsProps {
  weekTotalSeconds: number
  targetHours: number
  daysWorked: number
}

export function WeeklySummaryCards({
  weekTotalSeconds,
  targetHours,
  daysWorked,
}: WeeklySummaryCardsProps) {
  const targetSeconds = targetHours * 3600
  const progress = targetSeconds > 0 ? Math.min((weekTotalSeconds / targetSeconds) * 100, 100) : 0
  const dailyAvg = daysWorked > 0 ? weekTotalSeconds / daysWorked : 0

  const cards = [
    {
      title: "This Week",
      value: formatDuration(weekTotalSeconds),
      icon: Clock,
      color: "text-cyan-300",
      bg: "bg-cyan-500/20",
    },
    {
      title: "Daily Average",
      value: formatDuration(Math.round(dailyAvg)),
      icon: TrendingUp,
      color: "text-blue-300",
      bg: "bg-blue-500/20",
    },
    {
      title: "Days Worked",
      value: String(daysWorked),
      icon: CalendarDays,
      color: "text-emerald-300",
      bg: "bg-emerald-500/20",
    },
  ]

  return (
    <div className="space-y-4">
      <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400 font-mono">Weekly Progress</p>
            <p className="text-sm font-mono text-white">
              {formatDuration(weekTotalSeconds)} / {targetHours}h
            </p>
          </div>
          <Progress value={progress} className="h-2 bg-slate-700" />
          <p className="text-xs text-slate-500 font-mono mt-1">{Math.round(progress)}% of target</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
              <CardContent className="flex items-center gap-3 py-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono">{card.title}</p>
                  <p className={`text-lg font-bold font-mono ${card.color}`}>{card.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
