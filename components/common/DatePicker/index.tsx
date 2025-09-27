"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    value?: Date
    onChange?: (date: Date | undefined | string) => void
    placeholder?: string
    disabled?: (date: Date) => boolean
    className?: string
    buttonClassName?: string
    label?: string
    description?: string
    error?: string
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Pick a date",
    disabled = (date) => date > new Date() || date < new Date("1900-01-01"),
    className,
    buttonClassName,
    label,
    description,
    error,
}: DatePickerProps) {
    const [open, setOpen] = useState(false)

    return (
        <div className={cn("flex flex-col space-y-2", className)}>
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        className={cn(
                            "w-full h-10 px-3 rounded-md text-left font-normal flex items-center justify-between bg-slate-800/50 border-slate-700 border",
                            !value && "text-muted-foreground",
                            buttonClassName
                        )}
                    >
                        {value ? format(value, "PPP") : <span>{placeholder}</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={(date) => {
                            if (date) {
                                const isoDate = date.toISOString()
                                onChange?.(isoDate)
                                setOpen(false)
                            }
                        }}
                        disabled={disabled}
                        captionLayout="dropdown"
                    />
                </PopoverContent>
            </Popover>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
            )}
        </div>
    )
}
