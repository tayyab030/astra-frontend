"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { DateRangeFilterBar } from "../DashboardTab/DateRangeFilter"
import type { UseTimeTrackReturn } from "../../_hooks/useTimeTrack"

interface ReportsFiltersProps {
  timeTrack: UseTimeTrackReturn
}

export function ReportsFilters({ timeTrack }: ReportsFiltersProps) {
  const { reportsSearch, setReportsSearch, dateRange, setDateRangePreset, setCustomDateRange } =
    timeTrack

  return (
    <div className="space-y-4">
      <DateRangeFilterBar
        dateRange={dateRange}
        onPresetChange={setDateRangePreset}
        onCustomChange={setCustomDateRange}
      />
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by task name..."
          value={reportsSearch}
          onChange={(e) => setReportsSearch(e.target.value)}
          className="pl-9 bg-slate-800/50 border-slate-600 text-white font-mono"
        />
      </div>
    </div>
  )
}
