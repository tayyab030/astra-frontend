import type { TimeEntry } from "../_types/timeTrack.types"

export interface TaskReportDayBreakdown {
  date: string
  durationSeconds: number
}

export interface TaskReportSummary {
  taskId: string
  taskTitle: string
  totalSeconds: number
  days: TaskReportDayBreakdown[]
  isSingleDay: boolean
}

export function buildTaskReportSummaries(entries: TimeEntry[]): TaskReportSummary[] {
  const byTask = new Map<string, { taskTitle: string; byDate: Map<string, number> }>()

  for (const entry of entries) {
    let task = byTask.get(entry.taskId)
    if (!task) {
      task = { taskTitle: entry.taskTitle, byDate: new Map() }
      byTask.set(entry.taskId, task)
    }
    task.byDate.set(entry.date, (task.byDate.get(entry.date) ?? 0) + entry.durationSeconds)
  }

  return Array.from(byTask.entries())
    .map(([taskId, { taskTitle, byDate }]) => {
      const days = Array.from(byDate.entries())
        .map(([date, durationSeconds]) => ({ date, durationSeconds }))
        .sort((a, b) => b.date.localeCompare(a.date))

      const totalSeconds = days.reduce((sum, day) => sum + day.durationSeconds, 0)

      return {
        taskId,
        taskTitle,
        totalSeconds,
        days,
        isSingleDay: days.length === 1,
      }
    })
    .sort((a, b) => b.totalSeconds - a.totalSeconds)
}
