/**
 * Apply an app theme class on <html>.
 * next-themes also does this; we keep a shared helper so session sync /
 * switcher stay consistent and old theme classes never stack.
 */

import { APP_THEMES, isAppTheme, type AppTheme } from "@/lib/theme"

export function applyThemeClass(nextTheme: AppTheme) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  for (const theme of APP_THEMES) {
    root.classList.toggle(theme, theme === nextTheme)
  }
  root.style.colorScheme = nextTheme === "light" || nextTheme === "mist" ? "light" : "dark"
}

export function applyThemeClassIfValid(value: unknown) {
  if (isAppTheme(value)) applyThemeClass(value)
}
