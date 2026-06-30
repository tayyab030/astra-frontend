"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PatternChartPoint } from "../../_utils/workingPatternCharts"
import { CHART_CLASS_NAME } from "../constants"

const patternChartConfig = {
  hours: { label: "Hours", color: "#a78bfa" },
} satisfies ChartConfig

interface WorkingPatternChartProps {
  title: string
  data: PatternChartPoint[]
  emptyMessage: string
}

export function WorkingPatternChart({ title, data, emptyMessage }: WorkingPatternChartProps) {
  const hasData = data.some((point) => point.hours > 0)

  if (!hasData) {
    return (
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardContent className="h-72 flex items-center justify-center text-slate-400 font-mono text-sm">
          {emptyMessage}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-mono text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={patternChartConfig} className={CHART_CLASS_NAME}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={data.length > 20 ? Math.floor(data.length / 12) : 0}
            />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v}h`} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(_value, _name, item) => (
                    <span className="font-mono">
                      {(item.payload as PatternChartPoint).formatted}
                    </span>
                  )}
                />
              }
            />
            <Bar dataKey="hours" fill="#a78bfa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
