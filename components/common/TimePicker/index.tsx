"use client"

import { Clock } from "lucide-react"
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

export interface TimePickerProps {
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

function parseTimeValue(value?: string) {
  if (!value?.trim()) return null
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/)
  if (!match) return null
  const hour = String(Math.min(23, Number(match[1]))).padStart(2, "0")
  const minute = String(Math.min(59, Number(match[2]))).padStart(2, "0")
  return { hour, minute }
}

function formatTimeDisplay(hour: string, minute: string) {
  return `${hour}:${minute}`
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Pick a time",
  disabled = false,
  className,
  buttonClassName,
  label,
  id,
}: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const parsed = useMemo(() => parseTimeValue(value), [value])
  const hour = parsed?.hour ?? "09"
  const minute = parsed?.minute ?? "00"

  const commit = (nextHour: string, nextMinute: string) => {
    onChange?.(formatTimeDisplay(nextHour, nextMinute))
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
            <span className="min-w-0 flex-1 truncate text-left font-mono">
              {parsed ? formatTimeDisplay(parsed.hour, parsed.minute) : placeholder}
            </span>
            <Clock className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto bg-slate-800 border-slate-700 p-3"
          align="start"
          side="bottom"
          collisionPadding={16}
        >
          <div className="flex items-center gap-2">
            <Select
              value={hour}
              onValueChange={(nextHour) => commit(nextHour, minute)}
            >
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
            <span className="font-mono text-slate-400">:</span>
            <Select
              value={minute}
              onValueChange={(nextMinute) => commit(hour, nextMinute)}
            >
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
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
