import type { ChartConfig } from "@/components/ui/chart"

export const AI_HABIT_INSIGHTS = [
  "🔥 Your morning checklist is your strongest streak — protect the first 30 minutes of the day.",
  "💡 Low-priority habits are slipping. Pair them right after a high-priority item.",
  "📈 At your current pace, a 21-day streak on your top habit is within reach this month.",
]

export const WEEKLY_CONSISTENCY_DATA = [
  { day: "Mon", completed: 72 },
  { day: "Tue", completed: 80 },
  { day: "Wed", completed: 65 },
  { day: "Thu", completed: 88 },
  { day: "Fri", completed: 70 },
  { day: "Sat", completed: 55 },
  { day: "Sun", completed: 60 },
]

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

export const HABIT_ACHIEVEMENTS = [
  {
    title: "Consistency Builder",
    description: "Completed high-priority habits 5 days in a row",
    gradient: "from-orange-400 to-red-500",
  },
  {
    title: "Pack Completer",
    description: "Finished every item in a habit pack once",
    gradient: "from-amber-400 to-orange-500",
  },
]
