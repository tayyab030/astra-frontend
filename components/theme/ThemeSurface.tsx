"use client"

import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type DivProps = HTMLAttributes<HTMLDivElement>

/** Page content wrapper — use inside AuthLayout instead of hardcoded slate/cyan shells. */
export function ThemePage({ className, children, ...props }: DivProps) {
  return (
    <div className={cn("astra-page", className)} {...props}>
      {children}
    </div>
  )
}

/** Themed card surface (settings-style). */
export function ThemeCard({ className, children, ...props }: DivProps) {
  return (
    <div className={cn("astra-card", className)} {...props}>
      {children}
    </div>
  )
}

/** Inset panel / row surface. */
export function ThemePanel({ className, children, ...props }: DivProps) {
  return (
    <div className={cn("astra-panel", className)} {...props}>
      {children}
    </div>
  )
}

/** Page / section title with theme-aware accent glow. */
export function ThemeTitle({
  className,
  as: Comp = "h1",
  children,
  ...props
}: DivProps & { as?: "h1" | "h2" | "h3" | "p" | "span" }) {
  return (
    <Comp className={cn("astra-title", className)} {...props}>
      {children}
    </Comp>
  )
}

export function ThemeSubtitle({ className, children, ...props }: DivProps) {
  return (
    <p className={cn("astra-subtitle", className)} {...props}>
      {children}
    </p>
  )
}
