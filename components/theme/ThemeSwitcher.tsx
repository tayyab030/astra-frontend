"use client"

import { useEffect, useRef, useState } from "react"
import {
  Check,
  Droplets,
  Flame,
  Leaf,
  Moon,
  Sparkles,
  Sun,
  Trees,
  Waves,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getUserErrorMessage, updateCurrentUser } from "@/lib/api/user"
import { THEME_OPTIONS, isAppTheme, type AppTheme } from "@/lib/theme"
import { applyThemeClass } from "@/lib/apply-theme-class"
import { noteThemeUserChange } from "@/lib/theme-sync"
import { setUser } from "@/store/slice/userSlice"
import { useAppDispatch } from "@/store/hooks"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

const THEME_ICONS: Record<AppTheme, LucideIcon> = {
  light: Sun,
  mist: Droplets,
  dark: Moon,
  neon: Sparkles,
  ocean: Waves,
  forest: Trees,
  ember: Flame,
  aurora: Leaf,
}

interface ThemeSwitcherProps {
  persist?: boolean
  className?: string
}

export function ThemeSwitcher({ persist = false, className }: ThemeSwitcherProps) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const [mounted, setMounted] = useState(false)
  /** Optimistic selection so the menu updates instantly and stale saves can't snap back. */
  const [selectedTheme, setSelectedTheme] = useState<AppTheme | null>(null)
  const latestRequestRef = useRef<AppTheme | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { mutate: saveTheme } = useMutation({
    mutationFn: (nextTheme: AppTheme) => updateCurrentUser({ theme: nextTheme }),
    onSuccess: (user, requestedTheme) => {
      // Ignore outdated responses if the user already picked another theme.
      if (latestRequestRef.current !== requestedTheme) return
      dispatch(setUser(user))
      queryClient.setQueryData(["auth", "me"], user)
    },
    onError: (error, requestedTheme) => {
      if (latestRequestRef.current !== requestedTheme) return
      toast.error(getUserErrorMessage(error, "Theme applied locally, but profile sync failed"))
    },
  })

  const active = theme ?? resolvedTheme
  const currentTheme =
    selectedTheme ?? (isAppTheme(active) ? active : "neon")
  const CurrentIcon = THEME_ICONS[currentTheme]

  const handleThemeChange = (nextTheme: AppTheme) => {
    if (nextTheme === currentTheme) return
    latestRequestRef.current = nextTheme
    setSelectedTheme(nextTheme)
    noteThemeUserChange()
    applyThemeClass(nextTheme)
    setTheme(nextTheme)
    if (persist) saveTheme(nextTheme)
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9", className)}
        aria-label="Change theme"
        disabled
      />
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 text-foreground hover:bg-accent hover:text-accent-foreground",
            className
          )}
          aria-label={`Theme: ${currentTheme}. Change theme`}
        >
          <CurrentIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[100] min-w-[11rem]">
        {THEME_OPTIONS.map((option) => {
          const Icon = THEME_ICONS[option.value]
          const isActive = currentTheme === option.value
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => handleThemeChange(option.value)}
              className="font-mono"
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{option.label}</span>
              {isActive ? <Check className="h-4 w-4 text-primary" /> : null}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
