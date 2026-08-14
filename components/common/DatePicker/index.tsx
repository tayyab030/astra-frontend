"use client"

import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  value?: Date | string
  onChange?: (date: string | undefined) => void
  placeholder?: string
  disabled?: boolean | ((date: Date) => boolean)
  className?: string
  buttonClassName?: string
  label?: string
  description?: string
  error?: string
  fromYear?: number
  toYear?: number
  id?: string
}

function parseDateValue(value?: Date | string) {
  if (!value) return undefined
  if (value instanceof Date) return value
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return parseISO(value)
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  className,
  buttonClassName,
  label,
  description,
  error,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 10,
  id,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selectedDate = useMemo(() => parseDateValue(value), [value])
  const isButtonDisabled = typeof disabled === "boolean" ? disabled : false
  const disabledDays = typeof disabled === "function" ? disabled : undefined

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label ? (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      ) : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            disabled={isButtonDisabled}
            className={cn(
              "flex h-10 w-full items-center rounded-md border border-slate-700 bg-slate-800/50 px-3 text-left font-normal",
              !selectedDate && "text-muted-foreground",
              error && "border-destructive",
              buttonClassName,
              // Keep date text and calendar icon separated globally (after buttonClassName so it always wins).
              "gap-3",
            )}
          >
            <span className="min-w-0 flex-1 truncate text-left">
              {selectedDate ? format(selectedDate, "PPP") : placeholder}
            </span>
            <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onChange?.(format(date, "yyyy-MM-dd"))
                setOpen(false)
              }
            }}
            disabled={disabledDays}
            captionLayout="dropdown"
            startMonth={new Date(fromYear, 0)}
            endMonth={new Date(toYear, 11)}
            defaultMonth={selectedDate}
          />
        </PopoverContent>
      </Popover>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
    </div>
  )
}
