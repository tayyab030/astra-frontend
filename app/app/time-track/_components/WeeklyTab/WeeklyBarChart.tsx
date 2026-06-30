"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { weeklyBarChartConfig } from "../../_utils/timeTrackCharts"
import { CHART_CLASS_NAME } from "../constants"

interface WeeklyBarChartProps {
  data: { label: string; hours: number; formatted: string }[]
}

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const hasData = data.some((d) => d.hours > 0)

  if (!hasData) {
    return (
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardContent className="h-64 flex items-center justify-center text-slate-400 font-mono text-sm">
          No time tracked this week yet
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-mono text-white">Hours per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={weeklyBarChartConfig satisfies ChartConfig}
          className={CHART_CLASS_NAME}
        >
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v}h`} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item) => (
                    <span className="font-mono">
                      {(item.payload as { formatted: string }).formatted}
                    </span>
                  )}
                />
              }
            />
            <Bar dataKey="hours" fill="#34d399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
