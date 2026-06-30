"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { TimeEntry } from "../../_types/timeTrack.types"
import { formatDisplayDate, formatDuration, formatTimeOfDay } from "../../_utils/formatTime"

interface TimeEntryTableProps {
  entries: TimeEntry[]
}

export function TimeEntryTable({ entries }: TimeEntryTableProps) {
  if (entries.length === 0) {
    return (
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardContent className="py-12 text-center text-slate-400 font-mono text-sm">
          No time entries found for the selected filters
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
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Task</th>
                <th className="text-left p-3 font-medium">Start</th>
                <th className="text-left p-3 font-medium">End</th>
                <th className="text-right p-3 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-3 text-slate-300">{formatDisplayDate(entry.date)}</td>
                  <td className="p-3 text-white">{entry.taskTitle}</td>
                  <td className="p-3 text-slate-400">{formatTimeOfDay(entry.startTime)}</td>
                  <td className="p-3 text-slate-400">{formatTimeOfDay(entry.endTime)}</td>
                  <td className="p-3 text-right text-cyan-300 tabular-nums">
                    {formatDuration(entry.durationSeconds)}
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
