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
import { cn } from "@/lib/utils"

const SECTION_COLORS: Record<string, string> = {
  todo: "#94a3b8",
  in_progress: "#3b82f6",
  review: "#a855f7",
  done: "#22c55e",
}

const taskStatusChartConfig = {
  todo: { label: "To Do", color: SECTION_COLORS.todo },
  in_progress: { label: "In Progress", color: SECTION_COLORS.in_progress },
  review: { label: "Review", color: SECTION_COLORS.review },
  done: { label: "Done", color: SECTION_COLORS.done },
} satisfies ChartConfig

export interface TaskDashboardSection {
  id: string
  name: string
  status: string
  tasks: unknown[]
}

interface TaskDashboardChartProps {
  sections: TaskDashboardSection[]
  totalTasks: number
}

export default function TaskDashboardChart({ sections, totalTasks }: TaskDashboardChartProps) {
  const chartData = sections
    .map((section) => ({
      status: section.status,
      label: section.name,
      count: section.tasks.length,
      fill: SECTION_COLORS[section.status] ?? "#64748b",
    }))
    .filter((entry) => entry.count > 0)

  const doneCount = sections.find((section) => section.status === "done")?.tasks.length ?? 0
  const completionRate = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0

  if (totalTasks === 0) {
    return (
      <div className="flex h-48 items-center justify-center font-mono text-sm text-slate-400">
        No tasks yet — create one to see progress here.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="rounded-lg border border-slate-700/30 bg-slate-900/40 p-4"
          >
            <p className="font-mono text-sm text-slate-400">{section.name}</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-white">{section.tasks.length}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-700/30 bg-slate-900/30 p-4">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="font-mono text-sm text-slate-400">Completion rate</p>
          <p className="font-mono text-sm font-medium text-cyan-300">{completionRate}%</p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-700/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-xs text-slate-500">
          {doneCount} of {totalTasks} tasks done
        </p>
      </div>

      {chartData.length > 0 ? (
        <div className="rounded-lg border border-slate-700/30 bg-slate-900/30 p-4">
          <p className="mb-4 font-mono text-sm text-slate-400">Tasks by status</p>
          <ChartContainer
            config={taskStatusChartConfig}
            className={cn(
              "mx-auto h-64 w-full max-w-md aspect-auto",
              "[&_.recharts-cartesian-axis-tick_text]:fill-slate-400",
            )}
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="border-slate-700 bg-slate-900/95 font-mono text-slate-200"
                    nameKey="label"
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="label"
                innerRadius={58}
                outerRadius={92}
                paddingAngle={chartData.length > 1 ? 3 : 0}
                stroke="transparent"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={
                  <ChartLegendContent
                    nameKey="label"
                    className="font-mono text-slate-400 [&_.recharts-legend-item-text]:text-slate-300"
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        </div>
      ) : null}
    </div>
  )
}
