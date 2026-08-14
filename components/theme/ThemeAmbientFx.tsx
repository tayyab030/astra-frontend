"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

/**
 * Ambient neon FX. Visibility is controlled by --fx-opacity on each theme
 * in globals.css — no per-page neon: class branching needed.
 */
export function ThemeAmbientFx({ className }: { className?: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        delay: `${(i % 8) * 0.7}s`,
        duration: `${12 + (i % 5) * 2}s`,
      })),
    []
  )

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden astra-fx", className)}
      aria-hidden
    >
      <div className="astra-fx-grid absolute inset-0" />
      <div className="astra-fx-orb absolute top-20 left-20 h-32 w-32 rounded-full blur-xl" />
      <div className="astra-fx-orb astra-fx-orb-alt absolute top-40 right-32 h-24 w-24 rounded-full blur-xl" />
      <div className="astra-fx-orb absolute bottom-32 left-1/4 h-40 w-40 rounded-full blur-2xl" />
      <div className="astra-fx-ring absolute top-1/4 right-1/4 h-64 w-64 rounded-full" />
      <div className="astra-fx-ring astra-fx-ring-alt absolute bottom-1/4 left-1/3 h-48 w-48 rounded-full" />
      {particles.map((p) => (
        <div
          key={p.id}
          className="astra-fx-particle absolute h-1 w-1 rounded-full"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  )
}
