"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartPoint } from "../../_types/health.types"
import { CHART_CLASS_NAME } from "../constants"

const chartConfig = {
  value: { label: "Value", color: "#22d3ee" },
} satisfies ChartConfig

interface HealthTrendChartProps {
  title: string
  data: ChartPoint[]
  emptyMessage: string
  valueFormatter?: (v: number) => string
  color?: string
}

export function HealthTrendChart({
  title,
  data,
  emptyMessage,
  valueFormatter = (v) => String(v),
  color = "#22d3ee",
}: HealthTrendChartProps) {
  const hasData = data.some((point) => point.value > 0)

  if (!hasData) {
    return (
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardContent className="h-64 flex items-center justify-center text-slate-400 font-mono text-sm">
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
        <ChartContainer config={chartConfig} className={CHART_CLASS_NAME}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={data.length > 20 ? Math.floor(data.length / 12) : 0}
            />
            <YAxis tickLine={false} axisLine={false} tickFormatter={valueFormatter} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(_value, _name, item) => (
                    <span className="font-mono">{(item.payload as ChartPoint).formatted}</span>
                  )}
                />
              }
            />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
