"use client"

import { Cell, Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useCurrency } from "@/hooks/useCurrency"
import type { WealthCategoryTotal } from "@/lib/api/wealth"
import { buildCategoryChartData, categoryChartConfig } from "./wealthCharts"

const chartClassName =
  "h-64 w-full aspect-auto [&_.recharts-cartesian-axis-tick_text]:fill-slate-400"

interface ExpenseCategoriesChartProps {
  categoryTotals: WealthCategoryTotal[]
}

export function ExpenseCategoriesChart({ categoryTotals }: ExpenseCategoriesChartProps) {
  const { formatCurrency } = useCurrency()
  const data = buildCategoryChartData(categoryTotals)

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 font-mono text-sm">
        No category spending for this period
      </div>
    )
  }

  return (
    <ChartContainer
      config={categoryChartConfig satisfies ChartConfig}
      className={chartClassName}
    >
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="bg-slate-900/95 border-slate-700 text-slate-200 font-mono"
              nameKey="category"
              formatter={(value) =>
                formatCurrency(Number(value), {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }
            />
          }
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          stroke="transparent"
        >
          {data.map((entry) => (
            <Cell key={entry.category} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
          content={
            <ChartLegendContent
              nameKey="category"
              className="text-slate-400 font-mono [&_.recharts-legend-item-text]:text-slate-300"
            />
          }
        />
      </PieChart>
    </ChartContainer>
  )
}
