import { eachDayOfInterval, format, parseISO } from "date-fns"
import type { ChartConfig } from "@/components/ui/chart"
import type { TimeEntry } from "../_types/timeTrack.types"
import { formatDuration } from "./formatTime"

export const dailyTimeChartConfig = {
  hours: { label: "Hours", color: "#22d3ee" },
} satisfies ChartConfig

export const taskBreakdownChartConfig = {
  hours: { label: "Hours", color: "#818cf8" },
} satisfies ChartConfig

export const weeklyBarChartConfig = {
  hours: { label: "Hours", color: "#34d399" },
} satisfies ChartConfig

export function buildDailyTrendData(
  entries: TimeEntry[],
  startDate: string,
  endDate: string
) {
  const days = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  })

  return days.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd")
    const daySeconds = entries
      .filter((e) => e.date === dateStr)
      .reduce((sum, e) => sum + e.durationSeconds, 0)

    return {
      label: format(day, "MMM d"),
      date: dateStr,
      hours: Math.round((daySeconds / 3600) * 100) / 100,
      formatted: formatDuration(daySeconds),
    }
  })
}

export function buildTaskBreakdownData(entries: TimeEntry[]) {
  const taskMap = new Map<string, { title: string; seconds: number }>()

  for (const entry of entries) {
    const existing = taskMap.get(entry.taskId)
    if (existing) {
      existing.seconds += entry.durationSeconds
    } else {
      taskMap.set(entry.taskId, { title: entry.taskTitle, seconds: entry.durationSeconds })
    }
  }

  return Array.from(taskMap.values())
    .map((item) => ({
      label: item.title.length > 24 ? item.title.slice(0, 24) + "…" : item.title,
      fullTitle: item.title,
      hours: Math.round((item.seconds / 3600) * 100) / 100,
      formatted: formatDuration(item.seconds),
    }))
    .sort((a, b) => b.hours - a.hours)
}

export function buildWeeklyBarData(entries: TimeEntry[], weekStart: string, weekEnd: string) {
  return buildDailyTrendData(entries, weekStart, weekEnd)
}

export function getDashboardStats(entries: TimeEntry[]) {
  const totalSeconds = entries.reduce((sum, e) => sum + e.durationSeconds, 0)
  const uniqueDays = new Set(entries.map((e) => e.date)).size
  const avgPerDay = uniqueDays > 0 ? totalSeconds / uniqueDays : 0

  const taskTotals = new Map<string, number>()
  for (const entry of entries) {
    taskTotals.set(entry.taskTitle, (taskTotals.get(entry.taskTitle) ?? 0) + entry.durationSeconds)
  }

  let topTask = "—"
  let topSeconds = 0
  for (const [title, seconds] of taskTotals) {
    if (seconds > topSeconds) {
      topTask = title
      topSeconds = seconds
    }
  }

  return {
    totalSeconds,
    avgPerDaySeconds: avgPerDay,
    topTask,
    topTaskSeconds: topSeconds,
    sessionCount: entries.length,
  }
}
