"use client"

import type { UseTimeTrackReturn } from "../../_hooks/useTimeTrack"
import { ReportsFilters } from "./ReportsFilters"
import { TaskReportTable } from "./TaskReportTable"

interface ReportsTabProps {
  timeTrack: UseTimeTrackReturn
}

export function ReportsTab({ timeTrack }: ReportsTabProps) {
  const { filteredEntries } = timeTrack

  return (
    <div className="space-y-4 pb-6">
      <ReportsFilters timeTrack={timeTrack} />
      <TaskReportTable entries={filteredEntries} />
    </div>
  )
}
