import type { ChartConfig } from "@/components/ui/chart"

export const weeklyConsistencyChartConfig = {
  completed: {
    label: "Completion %",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export const completionChartConfig = {
  done: {
    label: "Completed",
    color: "hsl(142 70% 45%)",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig

export const streakChartConfig = {
  streak: {
    label: "Streak",
    color: "hsl(24 95% 53%)",
  },
} satisfies ChartConfig
