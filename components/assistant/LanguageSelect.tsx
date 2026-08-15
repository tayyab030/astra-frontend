"use client"

import { useMemo, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AI_LANGUAGE_LABELS,
  AI_LANGUAGE_OPTIONS,
  type AiLanguage,
} from "@/lib/ai-language"
import { cn } from "@/lib/utils"

type LanguageSelectProps = {
  value: AiLanguage
  onValueChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function LanguageSelect({
  value,
  onValueChange,
  disabled = false,
  className,
}: LanguageSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedLabel = useMemo(() => {
    const option = AI_LANGUAGE_OPTIONS.find((item) => item.value === value)
    if (!option) return AI_LANGUAGE_LABELS[value] ?? value
    return option.nativeVoice ? `${option.label} · voice` : option.label
  }, [value])

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label="Assistant language"
          disabled={disabled}
          className={cn(
            "inline-flex h-9 w-[9.5rem] items-center justify-between rounded-md border border-border bg-secondary/60 px-2 font-mono text-xs text-foreground shadow-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 md:w-[12rem]",
            className
          )}
        >
          <span className="min-w-0 truncate text-left">{selectedLabel}</span>
          <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={6}
        collisionPadding={16}
        className="z-[100] w-[16rem] border-border bg-popover p-0"
      >
        <Command shouldFilter className="bg-popover font-mono">
          <CommandInput placeholder="Search language..." className="h-9 text-xs" />
          <CommandList className="max-h-72">
            <CommandEmpty className="py-4 text-center text-xs">
              No language found.
            </CommandEmpty>
            <CommandGroup>
              {AI_LANGUAGE_OPTIONS.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.value}`}
                  className="cursor-pointer text-xs"
                  onSelect={() => {
                    onValueChange(option.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">
                    {option.label}
                    {option.nativeVoice ? " · voice" : ""}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
