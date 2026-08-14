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
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0">
          <Label className="text-slate-400 font-mono text-xs mb-2 block">Period</Label>
          <ToggleGroup
            type="single"
            value={dateRange.preset}
            onValueChange={(value) => value && onPresetChange(value as DateRangeFilter["preset"])}
            className="flex w-fit flex-wrap gap-2 rounded-lg border border-slate-700/50 bg-slate-800/50 p-1.5"
          >
            {DATE_RANGE_PRESETS.map((preset) => (
              <ToggleGroupItem
                key={preset.value}
                value={preset.value}
                className="flex-none rounded-md px-3 font-mono text-xs data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-300"
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
              className="min-w-[200px]"
              buttonClassName="h-9 min-w-[200px] border-slate-600/50 bg-slate-900/50 font-mono text-white"
            />
            <DatePicker
              label="End"
              value={dateRange.endDate}
              onChange={(date) => date && onCustomChange(dateRange.startDate, date)}
              className="min-w-[200px]"
              buttonClassName="h-9 min-w-[200px] border-slate-600/50 bg-slate-900/50 font-mono text-white"
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
