"use client"

import { addDays, format, parseISO } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import type { HabitDayRelative } from "../_types/habits.types"
import { getLocalDateString } from "../../health/_utils/date"

function relativeLabel(relative: HabitDayRelative | undefined, date: string) {
  switch (relative) {
    case "today":
      return "Today"
    case "yesterday":
      return "Yesterday"
    case "tomorrow":
      return "Tomorrow"
    case "past":
      return "Past day"
    case "future":
      return "Upcoming"
    default:
      return format(parseISO(date), "EEE")
  }
}

interface HabitDateNavProps {
  date: string
  today?: string
  relative?: HabitDayRelative
  onChange: (date: string) => void
}

export function HabitDateNav({ date, today, relative, onChange }: HabitDateNavProps) {
  const todayDate = today ?? getLocalDateString()
  const yesterday = format(addDays(parseISO(todayDate), -1), "yyyy-MM-dd")
  const tomorrow = format(addDays(parseISO(todayDate), 1), "yyyy-MM-dd")

  const shift = (amount: number) => {
    onChange(format(addDays(parseISO(date), amount), "yyyy-MM-dd"))
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button type="button" size="icon" variant="outline" onClick={() => shift(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-[9.5rem] text-center">
          <p className="text-sm font-medium text-foreground">
            {relativeLabel(relative, date)}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(parseISO(date), "MMM d, yyyy")}
          </p>
        </div>
        <Button type="button" size="icon" variant="outline" onClick={() => shift(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={date === yesterday ? "default" : "outline"}
          className={date === yesterday ? "astra-btn-primary" : ""}
          onClick={() => onChange(yesterday)}
        >
          Yesterday
        </Button>
        <Button
          type="button"
          size="sm"
          variant={date === todayDate ? "default" : "outline"}
          className={date === todayDate ? "astra-btn-primary" : ""}
          onClick={() => onChange(todayDate)}
        >
          Today
        </Button>
        <Button
          type="button"
          size="sm"
          variant={date === tomorrow ? "default" : "outline"}
          className={date === tomorrow ? "astra-btn-primary" : ""}
          onClick={() => onChange(tomorrow)}
        >
          Tomorrow
        </Button>
        <DatePicker
          value={date}
          onChange={(next) => {
            if (next) onChange(next)
          }}
          placeholder="Pick a date"
          className="w-[200px]"
          buttonClassName="h-9 border-border bg-background text-foreground"
        />
      </div>
    </div>
  )
}
