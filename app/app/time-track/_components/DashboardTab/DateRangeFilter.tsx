"use client"

import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { DateRangeFilter } from "../../_types/timeTrack.types"
import { formatWorkedTotal } from "../../_utils/formatTime"
import { DATE_RANGE_PRESETS } from "../constants"

interface DateRangeFilterProps {
  dateRange: DateRangeFilter
  onPresetChange: (preset: DateRangeFilter["preset"]) => void
  onCustomChange: (startDate: string, endDate: string) => void
  totalSeconds?: number
}

export function DateRangeFilterBar({
  dateRange,
  onPresetChange,
  onCustomChange,
  totalSeconds,
}: DateRangeFilterProps) {
  const periodLabel =
    dateRange.preset === "custom"
      ? "Selected period"
      : DATE_RANGE_PRESETS.find((p) => p.value === dateRange.preset)?.label ?? "Period"

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-4">
      <div>
        <Label className="text-slate-400 font-mono text-xs mb-2 block">Period</Label>
        <ToggleGroup
          type="single"
          value={dateRange.preset}
          onValueChange={(value) => value && onPresetChange(value as DateRangeFilter["preset"])}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-1"
        >
          {DATE_RANGE_PRESETS.map((preset) => (
            <ToggleGroupItem
              key={preset.value}
              value={preset.value}
              className="font-mono text-xs data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-300"
            >
              {preset.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {dateRange.preset === "custom" && (
        <div className="flex flex-wrap items-end gap-3">
          <DatePicker
            label="Start"
            value={dateRange.startDate}
            onChange={(date) => date && onCustomChange(date, dateRange.endDate)}
            buttonClassName="bg-slate-900/50 border-slate-600/50 text-white font-mono h-9"
          />
          <DatePicker
            label="End"
            value={dateRange.endDate}
            onChange={(date) => date && onCustomChange(dateRange.startDate, date)}
            buttonClassName="bg-slate-900/50 border-slate-600/50 text-white font-mono h-9"
          />
        </div>
      )}
      </div>

      {totalSeconds !== undefined && (
        <p className="text-sm font-mono text-slate-400">
          {periodLabel}:{" "}
          <span className="font-semibold text-cyan-300">{formatWorkedTotal(totalSeconds)}</span>{" "}
          worked
        </p>
      )}
    </div>
  )
}
