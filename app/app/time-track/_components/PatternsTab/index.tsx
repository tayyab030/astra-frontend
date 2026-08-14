"use client"

import { useMemo, useState } from "react"
import { format, parseISO } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { MonthPicker } from "@/components/ui/month-picker"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchTimeTrackDashboard } from "@/lib/api/timeTrack"
import { getTodayString } from "../../_utils/dateRange"
import { formatWorkedTotal } from "../../_utils/formatTime"
import {
  buildDailyPatternForMonth,
  buildHourlyPattern,
  buildMonthlyPattern,
  getPatternChartMeta,
  getPatternFetchRange,
  getPatternSummary,
  type PatternViewMode,
} from "../../_utils/workingPatternCharts"
import { timeTrackKeys } from "../../_hooks/queryKeys"
import { WorkingPatternChart } from "./WorkingPatternChart"

const YEAR_OPTIONS = Array.from({ length: 6 }, (_, index) => {
  const year = new Date().getFullYear() - index
  return String(year)
})

export function PatternsTab() {
  const [mode, setMode] = useState<PatternViewMode>("day")
  const [selectedDay, setSelectedDay] = useState(getTodayString())
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"))
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()))

  const fetchRange = useMemo(
    () => getPatternFetchRange(mode, selectedDay, selectedMonth, selectedYear),
    [mode, selectedDay, selectedMonth, selectedYear]
  )

  const patternsQuery = useQuery({
    queryKey: timeTrackKeys.dashboard(fetchRange.startDate, fetchRange.endDate),
    queryFn: () =>
      fetchTimeTrackDashboard({
        start_date: fetchRange.startDate,
        end_date: fetchRange.endDate,
      }),
    staleTime: 60_000,
  })

  const entries = patternsQuery.data?.entries ?? []

  const chartData = useMemo(() => {
    switch (mode) {
      case "day":
        return buildHourlyPattern(entries, selectedDay)
      case "month":
        return buildDailyPatternForMonth(entries, selectedMonth)
      case "year":
        return buildMonthlyPattern(entries, parseInt(selectedYear, 10))
    }
  }, [mode, entries, selectedDay, selectedMonth, selectedYear])

  const chartMeta = getPatternChartMeta(mode)
  const summary = getPatternSummary(chartData)

  const peakLabel =
    mode === "day"
      ? `Peak hour: ${summary.peakLabel}`
      : mode === "month"
        ? `Busiest day: ${summary.peakLabel}`
        : `Busiest month: ${summary.peakLabel}`

  return (
    <div className="space-y-4 pb-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <Label className="mb-2 block font-mono text-xs text-slate-400">View</Label>
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => value && setMode(value as PatternViewMode)}
            className="flex w-fit flex-wrap gap-2 rounded-lg border border-slate-700/50 bg-slate-800/50 p-1.5"
          >
            <ToggleGroupItem
              value="day"
              className="flex-none rounded-md px-4 font-mono text-xs data-[state=on]:bg-violet-500/20 data-[state=on]:text-violet-300"
            >
              Day
            </ToggleGroupItem>
            <ToggleGroupItem
              value="month"
              className="flex-none rounded-md px-4 font-mono text-xs data-[state=on]:bg-violet-500/20 data-[state=on]:text-violet-300"
            >
              Month
            </ToggleGroupItem>
            <ToggleGroupItem
              value="year"
              className="flex-none rounded-md px-4 font-mono text-xs data-[state=on]:bg-violet-500/20 data-[state=on]:text-violet-300"
            >
              Year
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {mode === "day" && (
          <DatePicker
            label="Day"
            value={selectedDay}
            onChange={(date) => date && setSelectedDay(date)}
            className="min-w-[220px]"
            buttonClassName="h-9 min-w-[220px] border-slate-600/50 bg-slate-900/50 font-mono text-white"
          />
        )}

        {mode === "month" && (
          <MonthPicker
            label="Month"
            value={selectedMonth}
            onChange={(month) => month && setSelectedMonth(month)}
            buttonClassName="h-9 min-w-[180px] border-slate-600/50 bg-slate-900/50 font-mono text-white"
          />
        )}

        {mode === "year" && (
          <div>
            <Label className="text-slate-400 font-mono text-xs mb-2 block">Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px] bg-slate-900/50 border-slate-600/50 text-white font-mono h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {YEAR_OPTIONS.map((year) => (
                  <SelectItem key={year} value={year} className="font-mono">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-400 font-mono">{chartMeta.description}</p>

      {patternsQuery.isLoading ? (
        <Skeleton className="h-72 w-full bg-slate-800/50" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-slate-700/50 bg-slate-800/30">
              <CardContent className="py-4">
                <p className="text-xs text-slate-400 font-mono">Total worked</p>
                <p className="text-xl font-bold text-violet-300 font-mono">
                  {formatWorkedTotal(summary.totalSeconds)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-700/50 bg-slate-800/30">
              <CardContent className="py-4">
                <p className="text-xs text-slate-400 font-mono">{peakLabel}</p>
                <p className="text-xl font-bold text-white font-mono">{summary.peakFormatted}</p>
              </CardContent>
            </Card>
          </div>

          <WorkingPatternChart
            title={chartMeta.title}
            data={chartData}
            emptyMessage={chartMeta.emptyMessage}
          />
        </>
      )}
    </div>
  )
}
