"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { APP_THEMES, DEFAULT_THEME } from "@/lib/theme"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={DEFAULT_THEME}
      enableSystem={false}
      themes={[...APP_THEMES]}
      value={Object.fromEntries(APP_THEMES.map((theme) => [theme, theme]))}
    >
      {children}
    </NextThemesProvider>
  )
}
