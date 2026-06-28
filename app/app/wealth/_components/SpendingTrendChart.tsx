"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useCurrency } from "@/hooks/useCurrency"
import type { WealthDashboard, WealthTransaction } from "@/lib/api/wealth"
import { buildSpendingTrendData, spendingChartConfig } from "./wealthCharts"

const chartClassName =
  "h-64 w-full aspect-auto [&_.recharts-cartesian-axis-tick_text]:fill-slate-400 [&_.recharts-cartesian-grid_line]:stroke-slate-700/40"

interface SpendingTrendChartProps {
  transactions: WealthTransaction[]
  filter: WealthDashboard["filter"]
}

export function SpendingTrendChart({ transactions, filter }: SpendingTrendChartProps) {
  const { formatCurrency } = useCurrency()
  const data = buildSpendingTrendData(transactions, filter)

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 font-mono text-sm">
        No spending data for this period
      </div>
    )
  }

  return (
    <ChartContainer
      config={spendingChartConfig satisfies ChartConfig}
      className={chartClassName}
    >
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={48}
          tickFormatter={(value) =>
            formatCurrency(Number(value), { maximumFractionDigits: 0 })
          }
        />
        <ChartTooltip
          cursor={{ stroke: "#475569", strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              className="bg-slate-900/95 border-slate-700 text-slate-200 font-mono"
              formatter={(value) =>
                formatCurrency(Number(value), {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }
            />
          }
        />
        <Area
          type="monotone"
          dataKey="spending"
          stroke="#22d3ee"
          strokeWidth={2}
          fill="url(#spendingGradient)"
          dot={{ fill: "#22d3ee", r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#06b6d4", stroke: "#ecfeff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ChartContainer>
  )
}
