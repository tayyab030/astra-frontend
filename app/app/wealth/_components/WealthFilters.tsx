"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { WealthFilter, WealthFilterMode } from "@/lib/api/wealth"

export type { WealthFilter, WealthFilterMode, WealthMonthFilter, WealthYearFilter } from "@/lib/api/wealth"

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
]

const selectTriggerClassName =
  "font-mono bg-slate-900/50 border-slate-600/50 text-white min-w-[110px] h-9"

function getYearOptions() {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let year = currentYear; year >= currentYear - 10; year--) {
    years.push(year)
  }
  return years
}

interface WealthFiltersProps {
  onChange?: (filter: WealthFilter) => void
}

export function WealthFilters({ onChange }: WealthFiltersProps) {
  const yearOptions = useMemo(getYearOptions, [])
  const currentYear = yearOptions[0]
  const currentMonth = new Date().getMonth() + 1

  const [mode, setMode] = useState<WealthFilterMode>("month")
  const [monthYear, setMonthYear] = useState(String(currentYear))
  const [month, setMonth] = useState(String(currentMonth))
  const [startYear, setStartYear] = useState(String(currentYear))
  const [endYear, setEndYear] = useState(String(currentYear))

  const startYearNumber = Number(startYear)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (mode === "month") {
      onChangeRef.current?.({
        mode: "month",
        year: Number(monthYear),
        month: Number(month),
      })
      return
    }

    onChangeRef.current?.({
      mode: "year",
      startYear: startYearNumber,
      endYear: Number(endYear),
    })
  }, [mode, monthYear, month, startYear, endYear, startYearNumber])

  const handleStartYearChange = (value: string) => {
    setStartYear(value)
    if (Number(value) > Number(endYear)) {
      setEndYear(value)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:items-end">
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(value) => {
          if (value) setMode(value as WealthFilterMode)
        }}
        className="bg-slate-900/50 border border-slate-600/50 rounded-md p-1"
      >
        <ToggleGroupItem
          value="month"
          className="font-mono text-xs px-3 data-[state=on]:bg-gradient-to-r data-[state=on]:from-cyan-500 data-[state=on]:to-blue-600 data-[state=on]:text-white"
        >
          Month
        </ToggleGroupItem>
        <ToggleGroupItem
          value="year"
          className="font-mono text-xs px-3 data-[state=on]:bg-gradient-to-r data-[state=on]:from-cyan-500 data-[state=on]:to-blue-600 data-[state=on]:text-white"
        >
          Year
        </ToggleGroupItem>
      </ToggleGroup>

      {mode === "month" ? (
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label className="font-mono text-xs text-slate-400">Year</Label>
            <Select value={monthYear} onValueChange={setMonthYear}>
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600/50">
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={String(year)} className="font-mono">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="font-mono text-xs text-slate-400">Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className={`${selectTriggerClassName} min-w-[130px]`}>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600/50">
                {MONTHS.map((entry) => (
                  <SelectItem key={entry.value} value={String(entry.value)} className="font-mono">
                    {entry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label className="font-mono text-xs text-slate-400">Start Year</Label>
            <Select value={startYear} onValueChange={handleStartYearChange}>
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder="Start" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600/50">
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={String(year)} className="font-mono">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="font-mono text-xs text-slate-400">End Year</Label>
            <Select value={endYear} onValueChange={setEndYear}>
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder="End" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600/50">
                {yearOptions.map((year) => (
                  <SelectItem
                    key={year}
                    value={String(year)}
                    disabled={year < startYearNumber}
                    className="font-mono"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
