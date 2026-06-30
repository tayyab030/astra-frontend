"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TimeEntry } from "../../_types/timeTrack.types"
import { formatDisplayDate, formatDuration } from "../../_utils/formatTime"

interface WeeklyDailyBreakdownProps {
  data: { label: string; date: string; hours: number; formatted: string }[]
  entries: TimeEntry[]
}

function getTopTaskForDay(entries: TimeEntry[], date: string): string | null {
  const dayEntries = entries.filter((e) => e.date === date)
  if (dayEntries.length === 0) return null

  const taskTotals = new Map<string, number>()
  for (const entry of dayEntries) {
    taskTotals.set(entry.taskTitle, (taskTotals.get(entry.taskTitle) ?? 0) + entry.durationSeconds)
  }

  let topTask: string | null = null
  let topSeconds = 0
  for (const [title, seconds] of taskTotals) {
    if (seconds > topSeconds) {
      topTask = title
      topSeconds = seconds
    }
  }
  return topTask
}

export function WeeklyDailyBreakdown({ data, entries }: WeeklyDailyBreakdownProps) {
  return (
    <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-mono text-white">Daily Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.map((day) => {
          const topTask = getTopTaskForDay(entries, day.date)
          return (
            <div
              key={day.date}
              className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/30 p-3"
            >
              <div>
                <p className="text-sm text-white font-mono">{formatDisplayDate(day.date)}</p>
                {topTask && (
                  <p className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-[200px]">
                    Top: {topTask}
                  </p>
                )}
              </div>
              <span className="text-sm text-cyan-300 font-mono tabular-nums">
                {day.hours > 0 ? day.formatted : "—"}
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
