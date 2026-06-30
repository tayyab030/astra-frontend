"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { taskBreakdownChartConfig } from "../../_utils/timeTrackCharts"
import { CHART_CLASS_NAME } from "../constants"

interface TaskBreakdownChartProps {
  data: { label: string; hours: number; formatted: string }[]
}

export function TaskBreakdownChart({ data }: TaskBreakdownChartProps) {
  if (data.length === 0) {
    return (
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardContent className="h-64 flex items-center justify-center text-slate-400 font-mono text-sm">
          No task breakdown for this period
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-mono text-white">Time by Task</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={taskBreakdownChartConfig satisfies ChartConfig}
          className={CHART_CLASS_NAME}
        >
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}h`} />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={120}
            />
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
            <Bar dataKey="hours" fill="#818cf8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
