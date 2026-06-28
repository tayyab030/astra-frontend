"use client"

import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/common/DatePicker"
import { cn } from "@/lib/utils"
import { FormFieldError } from "./FormFieldError"

function getCurrentMonthValue() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

function monthToDateValue(month: string) {
  if (/^\d{4}-\d{2}$/.test(month)) return `${month}-01`
  return undefined
}

function dateToMonth(date: string) {
  return date.slice(0, 7)
}

interface SavingMonthFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
  labelClassName?: string
  id?: string
}

export function SavingMonthField({
  value,
  onChange,
  error,
  labelClassName,
  id,
}: SavingMonthFieldProps) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="space-y-2">
      <Label className={cn("font-mono", labelClassName)} htmlFor={id}>
        Month
      </Label>
      <DatePicker
        value={monthToDateValue(value)}
        onChange={(date) => date && onChange(dateToMonth(date))}
        placeholder="Pick a month"
        className="space-y-0"
        fromYear={currentYear - 10}
        toYear={currentYear}
        buttonClassName={cn(
          "font-mono bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20",
          error && "border-red-500/70"
        )}
      />
      <FormFieldError message={error} />
    </div>
  )
}

export { getCurrentMonthValue }
