"use client"

import { useMemo, useState } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { TIMEZONES } from "@/lib/countries"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TimezoneSelectProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  triggerClassName?: string
  placeholder?: string
}

export function TimezoneSelect({
  value,
  onValueChange,
  className,
  triggerClassName,
  placeholder = "Select timezone...",
}: TimezoneSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredTimezones = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return TIMEZONES
    return TIMEZONES.filter((timezone) => timezone.toLowerCase().includes(query))
  }, [search])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-cyan-500/30 bg-slate-800/50 px-3 py-2 text-sm font-mono text-slate-300 shadow-xs transition-colors hover:bg-slate-800/70 hover:text-slate-200 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none",
            !value && "text-slate-400",
            triggerClassName
          )}
        >
          <span className="truncate text-left">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className={cn(
          "z-[200] w-[min(100vw-2rem,420px)] p-0 bg-slate-900 border-cyan-500/30 shadow-xl",
          className
        )}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="flex items-center border-b border-slate-700 px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search timezone..."
            className="border-0 bg-transparent font-mono text-slate-200 shadow-none focus-visible:ring-0"
            autoFocus
          />
        </div>
        <div className="max-h-[280px] overflow-y-auto p-1">
          {filteredTimezones.length === 0 ? (
            <p className="py-6 text-center text-sm font-mono text-slate-400">No timezone found.</p>
          ) : (
            filteredTimezones.map((timezone) => (
              <button
                key={timezone}
                type="button"
                onClick={() => {
                  onValueChange(timezone)
                  handleOpenChange(false)
                }}
                className={cn(
                  "flex w-full items-center rounded-sm px-2 py-2 text-left text-sm font-mono text-slate-200 transition-colors hover:bg-cyan-500/20 hover:text-cyan-300",
                  value === timezone && "bg-cyan-500/10 text-cyan-300"
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 shrink-0",
                    value === timezone ? "opacity-100 text-cyan-400" : "opacity-0"
                  )}
                />
                <span>{timezone}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default TimezoneSelect
