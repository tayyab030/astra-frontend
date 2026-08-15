"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"
import { WeekdayPicker } from "./WeekdayPicker"
import {
  FREQUENCY_OPTIONS,
  TIME_OF_DAY_OPTIONS,
  type HabitFrequency,
  type HabitTimeOfDay,
} from "../_types/habits.types"

export interface HabitScheduleValue {
  frequency: HabitFrequency
  repeatDays: number[]
  periodTarget: number
  intervalDays: number
  startDate: string
  /** Optional stop date; null = continues indefinitely */
  endDate: string | null
  timeOfDay: HabitTimeOfDay
  reminderTime: string | null
}

interface HabitScheduleFieldsProps {
  value: HabitScheduleValue
  onChange: (next: Partial<HabitScheduleValue>) => void
}

export function HabitScheduleFields({
  value,
  onChange,
}: HabitScheduleFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Frequency</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FREQUENCY_OPTIONS.map((option) => {
            const active = value.frequency === option.value
            return (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={active ? "default" : "outline"}
                className={active ? "astra-btn-primary h-auto flex-col py-2" : "h-auto flex-col py-2"}
                onClick={() => onChange({ frequency: option.value })}
              >
                <span>{option.label}</span>
                <span className="text-[10px] font-normal opacity-80">{option.hint}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {value.frequency === "daily" ? (
        <div className="space-y-2">
          <Label>Repeat on</Label>
          <WeekdayPicker
            value={value.repeatDays}
            onChange={(repeatDays) => onChange({ repeatDays })}
          />
        </div>
      ) : null}

      {value.frequency === "weekly" ? (
        <div className="space-y-2">
          <Label htmlFor="period-target-weekly">Times per week</Label>
          <Input
            id="period-target-weekly"
            type="number"
            min={1}
            max={7}
            value={value.periodTarget}
            onChange={(e) =>
              onChange({ periodTarget: Math.min(7, Math.max(1, Number(e.target.value) || 1)) })
            }
          />
          <p className="text-xs text-muted-foreground">
            Like TickTick — check in any day until you hit this weekly goal.
          </p>
        </div>
      ) : null}

      {value.frequency === "monthly" ? (
        <div className="space-y-2">
          <Label htmlFor="period-target-monthly">Times per month</Label>
          <Input
            id="period-target-monthly"
            type="number"
            min={1}
            max={31}
            value={value.periodTarget}
            onChange={(e) =>
              onChange({ periodTarget: Math.min(31, Math.max(1, Number(e.target.value) || 1)) })
            }
          />
        </div>
      ) : null}

      {value.frequency === "interval" ? (
        <div className="space-y-2">
          <Label htmlFor="interval-days">Every N days</Label>
          <Input
            id="interval-days"
            type="number"
            min={1}
            max={365}
            value={value.intervalDays}
            onChange={(e) =>
              onChange({ intervalDays: Math.min(365, Math.max(1, Number(e.target.value) || 1)) })
            }
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex h-5 items-center justify-between gap-2">
            <Label>Starts from</Label>
          </div>
          <DatePicker
            value={value.startDate}
            onChange={(date) => date && onChange({ startDate: date })}
            placeholder="Pick start date"
            buttonClassName="h-10 w-full border-border bg-background text-foreground"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex h-5 items-center justify-between gap-2">
            <Label>Ends on</Label>
            {value.endDate ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-auto px-1.5 py-0 text-xs text-muted-foreground"
                onClick={() => onChange({ endDate: null })}
              >
                Clear
              </Button>
            ) : null}
          </div>
          <DatePicker
            value={value.endDate ?? undefined}
            onChange={(date) => onChange({ endDate: date ?? null })}
            placeholder="No end — continues"
            buttonClassName="h-10 w-full border-border bg-background text-foreground"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Time of day</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TIME_OF_DAY_OPTIONS.map((option) => {
            const active = value.timeOfDay === option.value
            return (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={active ? "default" : "outline"}
                className={active ? "astra-btn-primary" : ""}
                onClick={() => onChange({ timeOfDay: option.value })}
              >
                {option.label}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Reminder</Label>
        <div className="flex items-center gap-2">
          <TimePicker
            value={value.reminderTime ?? undefined}
            onChange={(time) => onChange({ reminderTime: time ?? null })}
            placeholder="No reminder"
            className="flex-1"
            buttonClassName="h-10 border-border bg-background text-foreground"
          />
          {value.reminderTime ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onChange({ reminderTime: null })}
            >
              Clear
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
