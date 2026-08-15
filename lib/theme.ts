/**
 * Central theme config.
 * Add or change themes here + matching CSS variables in app/globals.css.
 * UI should use semantic tokens / astra-* utilities — not hardcoded palette colors.
 */

export const APP_THEMES = [
  "light",
  "mist",
  "dark",
  "neon",
  "ocean",
  "forest",
  "ember",
  "aurora",
] as const

export type AppTheme = (typeof APP_THEMES)[number]

export const DEFAULT_THEME: AppTheme = "neon"

/** Themes that use dark surfaces (Tailwind `dark:` + Sonner dark chrome). */
export const DARK_SURFACE_THEMES: readonly AppTheme[] = [
  "dark",
  "neon",
  "ocean",
  "forest",
  "ember",
  "aurora",
]

export type ThemeOption = {
  value: AppTheme
  label: string
  description: string
  accent: string
  /** Tailwind classes when the option card is selected in Settings */
  activeClass: string
  /** Inline gradient for the preview swatch */
  swatch: string
  swatchBorder: string
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    description: "Clean light UI with blue accent",
    accent: "blue",
    activeClass: "border-blue-500 bg-blue-500/10 text-blue-600 shadow-[0_0_18px_rgba(59,130,246,0.25)]",
    swatch: "linear-gradient(135deg, #ffffff, #e2e8f0)",
    swatchBorder: "#cbd5e1",
  },
  {
    value: "mist",
    label: "Mist",
    description: "Soft daylight with teal accent",
    accent: "teal",
    activeClass: "border-teal-500 bg-teal-500/10 text-teal-700 shadow-[0_0_18px_rgba(20,184,166,0.28)]",
    swatch: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
    swatchBorder: "#5eead4",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Plain dark UI with slate accent",
    accent: "slate",
    activeClass: "border-slate-300 bg-slate-500/15 text-slate-200 shadow-[0_0_18px_rgba(148,163,184,0.25)]",
    swatch: "linear-gradient(135deg, #3f3f46, #09090b)",
    swatchBorder: "#64748b",
  },
  {
    value: "neon",
    label: "Neon",
    description: "Cyan ASTRA look with glow accents",
    accent: "cyan",
    activeClass: "border-cyan-400 bg-cyan-500/10 text-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.35)]",
    swatch: "linear-gradient(135deg, #06b6d4, #2563eb)",
    swatchBorder: "rgba(34,211,238,0.6)",
  },
  {
    value: "ocean",
    label: "Ocean",
    description: "Deep navy with teal accent",
    accent: "teal",
    activeClass: "border-teal-400 bg-teal-500/10 text-teal-300 shadow-[0_0_18px_rgba(45,212,191,0.3)]",
    swatch: "linear-gradient(135deg, #0e7490, #164e63)",
    swatchBorder: "rgba(45,212,191,0.55)",
  },
  {
    value: "forest",
    label: "Forest",
    description: "Deep green with emerald accent",
    accent: "emerald",
    activeClass: "border-emerald-400 bg-emerald-500/10 text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.3)]",
    swatch: "linear-gradient(135deg, #059669, #14532d)",
    swatchBorder: "rgba(52,211,153,0.55)",
  },
  {
    value: "ember",
    label: "Ember",
    description: "Warm charcoal with amber accent",
    accent: "amber",
    activeClass: "border-amber-400 bg-amber-500/10 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.3)]",
    swatch: "linear-gradient(135deg, #f59e0b, #431407)",
    swatchBorder: "rgba(251,191,36,0.55)",
  },
  {
    value: "aurora",
    label: "Aurora",
    description: "Night sky with mint glow accents",
    accent: "mint",
    activeClass: "border-emerald-300 bg-emerald-400/10 text-emerald-200 shadow-[0_0_18px_rgba(110,231,183,0.32)]",
    swatch: "linear-gradient(135deg, #34d399, #6366f1)",
    swatchBorder: "rgba(110,231,183,0.55)",
  },
]

/** Accent preview tied to each theme (display-only until accents are user-selectable). */
export const THEME_ACCENT: Record<AppTheme, string> = Object.fromEntries(
  THEME_OPTIONS.map((option) => [option.value, option.accent])
) as Record<AppTheme, string>

export function isAppTheme(value: unknown): value is AppTheme {
  return typeof value === "string" && (APP_THEMES as readonly string[]).includes(value)
}

export function isDarkSurfaceTheme(value: unknown): boolean {
  return typeof value === "string" && (DARK_SURFACE_THEMES as readonly string[]).includes(value)
}
