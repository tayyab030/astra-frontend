/**
 * Central theme config.
 * Add or change themes here + matching CSS variables in app/globals.css.
 * UI should use semantic tokens / astra-* utilities — not hardcoded palette colors.
 */

export const APP_THEMES = ["light", "dark", "neon"] as const

export type AppTheme = (typeof APP_THEMES)[number]

export const DEFAULT_THEME: AppTheme = "neon"

export const THEME_OPTIONS: { value: AppTheme; label: string; description: string }[] = [
  { value: "light", label: "Light", description: "Clean light UI with blue accent" },
  { value: "dark", label: "Dark", description: "Plain dark UI with slate accent" },
  { value: "neon", label: "Neon", description: "Cyan ASTRA look with glow accents" },
]

/** Accent preview tied to each theme (display-only until accents are user-selectable). */
export const THEME_ACCENT: Record<AppTheme, string> = {
  light: "blue",
  dark: "slate",
  neon: "cyan",
}

export function isAppTheme(value: unknown): value is AppTheme {
  return typeof value === "string" && (APP_THEMES as readonly string[]).includes(value)
}
