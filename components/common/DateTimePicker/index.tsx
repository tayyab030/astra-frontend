"use client"

import { format, parseISO } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export interface DateTimePickerProps {
  value?: string
  onChange?: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  buttonClassName?: string
  label?: string
  id?: string
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))

function parseDateTimeValue(value?: string) {
  if (!value?.trim()) return undefined
  // datetime-local: yyyy-MM-ddTHH:mm — treat as local
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
    const parsed = parseISO(value.slice(0, 16))
    return Number.isNaN(parsed.getTime()) ? undefined : parsed
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

function toDateTimeLocalValue(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm")
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick date & time",
  disabled = false,
  className,
  buttonClassName,
  label,
  id,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = useMemo(() => parseDateTimeValue(value), [value])

  const hour = selected ? format(selected, "HH") : "09"
  const minute = selected ? format(selected, "mm") : "00"

  const commit = (next: Date) => {
    onChange?.(toDateTimeLocalValue(next))
  }

  const handleDaySelect = (date: Date | undefined) => {
    if (!date) return
    const next = new Date(date)
    next.setHours(Number(hour), Number(minute), 0, 0)
    commit(next)
  }

  const handleHourChange = (nextHour: string) => {
    const base = selected ?? new Date()
    const next = new Date(base)
    if (!selected) {
      next.setSeconds(0, 0)
    }
    next.setHours(Number(nextHour), Number(minute), 0, 0)
    commit(next)
  }

  const handleMinuteChange = (nextMinute: string) => {
    const base = selected ?? new Date()
    const next = new Date(base)
    if (!selected) {
      next.setSeconds(0, 0)
    }
    next.setHours(Number(hour), Number(nextMinute), 0, 0)
    commit(next)
  }

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label ? (
        <Label htmlFor={id}>{label}</Label>
      ) : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-10 w-full items-center rounded-md border border-slate-700 bg-slate-800/50 px-3 text-left font-normal",
              !selected && "text-muted-foreground",
              buttonClassName,
              "gap-3",
            )}
          >
            <span className="min-w-0 flex-1 truncate text-left">
              {selected ? format(selected, "PPP p") : placeholder}
            </span>
            <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-slate-800 border-slate-700"
          align="start"
          side="bottom"
          collisionPadding={16}
        >
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleDaySelect}
            captionLayout="dropdown"
            defaultMonth={selected}
          />
          <div className="flex items-center gap-2 border-t border-slate-700 px-3 py-3">
            <Clock className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            <Select value={hour} onValueChange={handleHourChange}>
              <SelectTrigger className="h-9 w-[76px] bg-slate-900/50 border-slate-600 text-white font-mono">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 max-h-56">
                {HOURS.map((h) => (
                  <SelectItem key={h} value={h} className="font-mono">
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-slate-400 font-mono">:</span>
            <Select value={minute} onValueChange={handleMinuteChange}>
              <SelectTrigger className="h-9 w-[76px] bg-slate-900/50 border-slate-600 text-white font-mono">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 max-h-56">
                {MINUTES.map((m) => (
                  <SelectItem key={m} value={m} className="font-mono">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto h-9 font-mono text-slate-300"
              onClick={() => {
                onChange?.(undefined)
                setOpen(false)
              }}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
