"use client"

import { useMemo } from "react"
import type { UseTimeTrackReturn } from "../../_hooks/useTimeTrack"
import {
  buildDailyTrendData,
  buildTaskBreakdownData,
  getDashboardStats,
} from "../../_utils/timeTrackCharts"
import { DateRangeFilterBar } from "./DateRangeFilter"
import { DashboardStats } from "./DashboardStats"
import { DailyTimeChart } from "./DailyTimeChart"
import { TaskBreakdownChart } from "./TaskBreakdownChart"

interface DashboardTabProps {
  timeTrack: UseTimeTrackReturn
}

export function DashboardTab({ timeTrack }: DashboardTabProps) {
  const { entriesInDateRange, dateRange, setDateRangePreset, setCustomDateRange } = timeTrack

  const stats = useMemo(() => getDashboardStats(entriesInDateRange), [entriesInDateRange])

  const periodTotalSeconds = useMemo(
    () => entriesInDateRange.reduce((sum, entry) => sum + entry.durationSeconds, 0),
    [entriesInDateRange]
  )

  const dailyData = useMemo(
    () => buildDailyTrendData(entriesInDateRange, dateRange.startDate, dateRange.endDate),
    [entriesInDateRange, dateRange]
  )

  const taskData = useMemo(() => buildTaskBreakdownData(entriesInDateRange), [entriesInDateRange])

  return (
    <div className="space-y-6 pb-6">
      <DateRangeFilterBar
        dateRange={dateRange}
        onPresetChange={setDateRangePreset}
        onCustomChange={setCustomDateRange}
        totalSeconds={periodTotalSeconds}
      />
      <DashboardStats stats={stats} />
      <DailyTimeChart data={dailyData} />
      <TaskBreakdownChart data={taskData} />
    </div>
  )
}
