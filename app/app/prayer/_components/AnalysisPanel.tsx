"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getLocalDateString } from "../../health/_utils/date"
import { usePrayer } from "../_hooks/usePrayer"
import { usePrayerDay } from "../_hooks/usePrayerDay"
import {
  usePrayerAnalysis,
  type PrayerAnalysisRange,
} from "../_hooks/usePrayerAnalysis"
import { AiPrayerInsights } from "./AiPrayerInsights"

const CHART_CLASS =
  "h-48 w-full aspect-auto [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/40"

export function AnalysisPanel() {
  const [range, setRange] = useState<PrayerAnalysisRange>(7)
  const prayer = usePrayer()
  const today = getLocalDateString()
  const { day: todayLog } = usePrayerDay(today)
  const { points, overallPercent, insightSlice, isLoading, error } =
    usePrayerAnalysis(range)

  return (
    <div className="space-y-6">
      <Card className="astra-card">
        <CardHeader>
          <CardTitle className="text-primary">Completion rate</CardTitle>
          <CardDescription>
            Average % of Fajr–Isha + Tahajjud marked complete
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {([7, 30] as const).map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={range === value ? "default" : "outline"}
                className={range === value ? "astra-btn-primary" : ""}
                onClick={() => setRange(value)}
              >
                Last {value} days
              </Button>
            ))}
          </div>
          {isLoading ? (
            <Skeleton className="h-12 w-32" />
          ) : (
            <div>
              <p className="text-4xl font-bold tracking-tight text-white light:text-foreground">
                {overallPercent}%
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                average over the last {range} days
              </p>
            </div>
          )}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>

      <Card className="astra-card">
        <CardHeader>
          <CardTitle className="text-primary">Daily completion</CardTitle>
          <CardDescription>Share of trackable prayers done</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : points.every((p) => p.completedCount === 0) ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No tracking data yet
            </p>
          ) : (
            <div className={CHART_CLASS}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={points}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    width={32}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Completion"]}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Bar
                    dataKey="percent"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <AiPrayerInsights
        timings={prayer.timings}
        today={todayLog}
        analysis={insightSlice}
        enabled={!isLoading}
      />
    </div>
  )
}
