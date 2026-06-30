"use client"

import { useMemo } from "react"
import type { UseTimeTrackReturn } from "../../_hooks/useTimeTrack"
import { buildWeeklyBarData } from "../../_utils/timeTrackCharts"
import { WeeklyTargetEditor } from "./WeeklyTargetEditor"
import { WeeklySummaryCards } from "./WeeklySummaryCards"
import { WeeklyBarChart } from "./WeeklyBarChart"
import { WeeklyDailyBreakdown } from "./WeeklyDailyBreakdown"

interface WeeklyTabProps {
  timeTrack: UseTimeTrackReturn
}

export function WeeklyTab({ timeTrack }: WeeklyTabProps) {
  const { weekEntries, weekTotalSeconds, weekRange, weeklyTarget, updateWeeklyTarget } = timeTrack

  const weekData = useMemo(
    () => buildWeeklyBarData(weekEntries, weekRange.startDate, weekRange.endDate),
    [weekEntries, weekRange]
  )

  const daysWorked = useMemo(
    () => new Set(weekEntries.map((e) => e.date)).size,
    [weekEntries]
  )

  return (
    <div className="space-y-6 pb-6">
      <WeeklyTargetEditor
        hoursPerWeek={weeklyTarget.hoursPerWeek}
        onChange={updateWeeklyTarget}
      />
      <WeeklySummaryCards
        weekTotalSeconds={weekTotalSeconds}
        targetHours={weeklyTarget.hoursPerWeek}
        daysWorked={daysWorked}
      />
      <WeeklyBarChart data={weekData} />
      <WeeklyDailyBreakdown data={weekData} entries={weekEntries} />
    </div>
  )
}
