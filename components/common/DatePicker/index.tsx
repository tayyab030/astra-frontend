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
              "w-full h-10 px-3 rounded-md text-left font-normal flex items-center justify-between bg-slate-800/50 border-slate-700 border",
              !selectedDate && "text-muted-foreground",
              error && "border-destructive",
              buttonClassName,
            )}
          >
            {selectedDate ? format(selectedDate, "PPP") : <span>{placeholder}</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
