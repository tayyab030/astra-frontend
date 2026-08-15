"use client"

import { Button } from "@/components/ui/button"
import { WEEKDAY_OPTIONS } from "../_types/habits.types"

interface WeekdayPickerProps {
  value: number[]
  onChange: (days: number[]) => void
  disabled?: boolean
}

export function WeekdayPicker({ value, onChange, disabled }: WeekdayPickerProps) {
  const toggle = (day: number) => {
    if (value.includes(day)) {
      onChange(value.filter((item) => item !== day))
    } else {
      onChange([...value, day].sort((a, b) => a - b))
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {WEEKDAY_OPTIONS.map((day) => {
          const active = value.includes(day.value)
          return (
            <Button
              key={day.value}
              type="button"
              size="sm"
              variant={active ? "default" : "outline"}
              disabled={disabled}
              className={active ? "astra-btn-primary" : ""}
              onClick={() => toggle(day.value)}
            >
              {day.label}
            </Button>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Habit repeats on the selected days each week.
      </p>
    </div>
  )
}
