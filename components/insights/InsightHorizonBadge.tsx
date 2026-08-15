"use client"

import { horizonLabel, type InsightHorizon } from "@/lib/api/insights"

export function InsightHorizonBadge({
  horizon,
  className = "",
}: {
  horizon?: InsightHorizon | string | null
  className?: string
}) {
  const label = horizonLabel(horizon)
  if (!label) return null
  return (
    <span
      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground border-border/60 bg-muted/40 ${className}`}
    >
      {label}
    </span>
  )
}
