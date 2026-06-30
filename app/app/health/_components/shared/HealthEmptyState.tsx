"use client"

import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HealthEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function HealthEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: HealthEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="h-12 w-12 text-slate-600 mb-4" />
      <h3 className="text-lg font-mono text-slate-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 font-mono max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button
          variant="outline"
          className="mt-4 border-slate-600 text-slate-300 font-mono"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
