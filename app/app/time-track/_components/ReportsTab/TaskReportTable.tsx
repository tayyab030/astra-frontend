"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { TimeEntry } from "../../_types/timeTrack.types"
import { formatDisplayDate, formatDuration, formatWorkedTotal } from "../../_utils/formatTime"
import { buildTaskReportSummaries } from "../../_utils/reportSummaries"

interface TaskReportTableProps {
  entries: TimeEntry[]
}

export function TaskReportTable({ entries }: TaskReportTableProps) {
  const summaries = useMemo(() => buildTaskReportSummaries(entries), [entries])

  if (summaries.length === 0) {
    return (
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardContent className="py-12 text-center text-slate-400 font-mono text-sm">
          No time logged for the selected filters
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-slate-700/50 text-slate-400">
                <th className="text-left p-3 font-medium">Task</th>
                <th className="text-left p-3 font-medium">When</th>
                <th className="text-right p-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((summary) => (
                <tr
                  key={summary.taskId}
                  className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors align-top"
                >
                  <td className="p-3 text-white font-medium">{summary.taskTitle}</td>
                  <td className="p-3 text-slate-400">
                    {summary.isSingleDay ? (
                      <span>{formatDisplayDate(summary.days[0].date)}</span>
                    ) : (
                      <ul className="space-y-1">
                        {summary.days.map((day) => (
                          <li key={day.date} className="flex flex-wrap items-baseline gap-x-2">
                            <span className="text-slate-300">{formatDisplayDate(day.date)}</span>
                            <span className="text-slate-500">·</span>
                            <span className="text-cyan-300/80 tabular-nums">
                              {formatDuration(day.durationSeconds)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="p-3 text-right text-cyan-300 tabular-nums font-semibold whitespace-nowrap">
                    {formatWorkedTotal(summary.totalSeconds)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
