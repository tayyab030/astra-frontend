"use client"

import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useHealthContext } from "../../_context/HealthProvider"
import { HealthPeriodFilterBar } from "../shared/HealthPeriodFilterBar"
import { HealthTrendChart } from "../shared/HealthTrendChart"

export function InsightsTab() {
  const {
    habits,
    periodFilter,
    weightChartData,
    waterChartData,
    sleepChartData,
    exerciseChartData,
    setPeriodFilter,
  } = useHealthContext()

  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0)

  return (
    <div className="space-y-6 pb-6">
      <HealthPeriodFilterBar filter={periodFilter} onChange={setPeriodFilter} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardContent className="py-6 text-center">
            <div className="text-2xl font-bold font-mono text-cyan-400">{longestStreak}</div>
            <p className="text-sm text-slate-400 font-mono">Longest Habit Streak</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardContent className="py-6 text-center">
            <div className="text-2xl font-bold font-mono text-blue-400">180</div>
            <p className="text-sm text-slate-400 font-mono">Weekly Exercise Minutes</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardContent className="py-6 text-center">
            <div className="text-2xl font-bold font-mono text-cyan-400">7.2h</div>
            <p className="text-sm text-slate-400 font-mono">Average Sleep</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-mono flex items-center text-cyan-300">
            <BarChart3 className="mr-2 h-5 w-5 text-cyan-400" />
            Health Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <HealthTrendChart
            title="Weight"
            data={weightChartData}
            emptyMessage="No weight data for this period"
            valueFormatter={(v) => `${v}kg`}
            color="#34d399"
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <HealthTrendChart
              title="Water"
              data={waterChartData}
              emptyMessage="No water data for this period"
              color="#22d3ee"
            />
            <HealthTrendChart
              title="Sleep"
              data={sleepChartData}
              emptyMessage="No sleep data for this period"
              valueFormatter={(v) => `${v}h`}
              color="#818cf8"
            />
            <HealthTrendChart
              title="Exercise"
              data={exerciseChartData}
              emptyMessage="No exercise data for this period"
              valueFormatter={(v) => `${v}m`}
              color="#a78bfa"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
