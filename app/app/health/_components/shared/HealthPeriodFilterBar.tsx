"use client"

import { format } from "date-fns"
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
import type { HealthPeriodFilter, HealthPeriodMode } from "../../_types/health.types"

const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => String(new Date().getFullYear() - i))

interface HealthPeriodFilterBarProps {
  filter: HealthPeriodFilter
  onChange: (filter: HealthPeriodFilter) => void
}

export function HealthPeriodFilterBar({ filter, onChange }: HealthPeriodFilterBarProps) {
  const setMode = (mode: HealthPeriodMode) => onChange({ ...filter, mode })

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div>
        <Label className="text-slate-400 font-mono text-xs mb-2 block">Period</Label>
        <ToggleGroup
          type="single"
          value={filter.mode}
          onValueChange={(v) => v && setMode(v as HealthPeriodMode)}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-1"
        >
          {(["day", "week", "month", "year"] as const).map((mode) => (
            <ToggleGroupItem
              key={mode}
              value={mode}
              className="font-mono text-xs capitalize data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-300"
            >
              {mode}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {(filter.mode === "day" || filter.mode === "week") && (
        <DatePicker
          label={filter.mode === "day" ? "Day" : "Week of"}
          value={filter.selectedDay}
          onChange={(date) => date && onChange({ ...filter, selectedDay: date })}
          buttonClassName="bg-slate-900/50 border-slate-600/50 text-white font-mono h-9"
        />
      )}

      {filter.mode === "month" && (
        <div>
          <Label className="text-slate-400 font-mono text-xs mb-2 block">Month</Label>
          <input
            type="month"
            value={filter.selectedMonth}
            onChange={(e) => onChange({ ...filter, selectedMonth: e.target.value })}
            className="h-9 rounded-md border border-slate-600/50 bg-slate-900/50 px-3 text-sm font-mono text-white"
          />
        </div>
      )}

      {filter.mode === "year" && (
        <div>
          <Label className="text-slate-400 font-mono text-xs mb-2 block">Year</Label>
          <Select
            value={filter.selectedYear}
            onValueChange={(year) => onChange({ ...filter, selectedYear: year })}
          >
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

      <p className="text-xs text-slate-500 font-mono pb-2">
        {filter.mode === "month"
          ? format(new Date(`${filter.selectedMonth}-01`), "MMMM yyyy")
          : filter.mode === "year"
            ? filter.selectedYear
            : format(new Date(filter.selectedDay), "MMM d, yyyy")}
      </p>
    </div>
  )
}
