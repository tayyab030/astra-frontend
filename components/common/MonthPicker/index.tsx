"use client"

import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"
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

export interface MonthPickerProps {
  value?: string
  onChange?: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  buttonClassName?: string
  label?: string
  id?: string
  fromYear?: number
  toYear?: number
}

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]

function parseMonthValue(value?: string) {
  if (!value?.trim()) return null
  if (!/^\d{4}-\d{2}$/.test(value)) return null
  const date = parseISO(`${value}-01`)
  if (Number.isNaN(date.getTime())) return null
  return {
    year: value.slice(0, 4),
    month: value.slice(5, 7),
    date,
  }
}

export function MonthPicker({
  value,
  onChange,
  placeholder = "Pick a month",
  disabled = false,
  className,
  buttonClassName,
  label,
  id,
  fromYear = new Date().getFullYear() - 10,
  toYear = new Date().getFullYear() + 2,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false)
  const parsed = useMemo(() => parseMonthValue(value), [value])
  const year = parsed?.year ?? String(new Date().getFullYear())
  const month = parsed?.month ?? String(new Date().getMonth() + 1).padStart(2, "0")

  const years = useMemo(() => {
    const list: string[] = []
    for (let y = toYear; y >= fromYear; y -= 1) list.push(String(y))
    return list
  }, [fromYear, toYear])

  const commit = (nextYear: string, nextMonth: string) => {
    onChange?.(`${nextYear}-${nextMonth}`)
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
              !parsed && "text-muted-foreground",
              buttonClassName,
              "gap-3",
            )}
          >
            <span className="min-w-0 flex-1 truncate text-left">
              {parsed ? format(parsed.date, "MMMM yyyy") : placeholder}
            </span>
            <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[280px] bg-slate-800 border-slate-700 p-3"
          align="start"
          side="bottom"
          collisionPadding={16}
        >
          <div className="mb-3">
            <Select value={year} onValueChange={(nextYear) => commit(nextYear, month)}>
              <SelectTrigger className="h-9 bg-slate-900/50 border-slate-600 text-white font-mono">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 max-h-56">
                {years.map((y) => (
                  <SelectItem key={y} value={y} className="font-mono">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((item) => {
              const isActive = parsed?.year === year && parsed?.month === item.value
              return (
                <Button
                  key={item.value}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 font-mono text-xs text-slate-300 hover:bg-slate-700 hover:text-white",
                    isActive && "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 hover:text-cyan-200",
                  )}
                  onClick={() => {
                    commit(year, item.value)
                    setOpen(false)
                  }}
                >
                  {item.label.slice(0, 3)}
                </Button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
