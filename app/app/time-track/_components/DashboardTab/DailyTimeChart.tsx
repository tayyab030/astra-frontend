"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dailyTimeChartConfig } from "../../_utils/timeTrackCharts"
import { CHART_CLASS_NAME } from "../constants"

interface DailyTimeChartProps {
  data: { label: string; hours: number; formatted: string }[]
}

export function DailyTimeChart({ data }: DailyTimeChartProps) {
  if (data.length === 0) {
    return (
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardContent className="h-64 flex items-center justify-center text-slate-400 font-mono text-sm">
          No time data for this period
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-mono text-white">Daily Time Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={dailyTimeChartConfig satisfies ChartConfig}
          className={CHART_CLASS_NAME}
        >
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#22d3ee"
              fill="url(#timeGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
