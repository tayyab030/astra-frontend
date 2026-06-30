"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { HealthProvider, useHealthContext } from "./_context/HealthProvider"
import { HealthContent } from "./_components/HealthContent"
import { HealthPageBackground } from "./_components/HealthPageBackground"
import { TodaySummaryRow } from "./_components/TodaySummaryRow"
import type { HealthTabId } from "./_types/health.types"

function HealthPageInner() {
  const { healthScore, isLoading } = useHealthContext()
  const [currentView, setCurrentView] = useState<HealthTabId>("overview")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden p-6 space-y-6">
        <Skeleton className="h-10 w-64 bg-slate-800/50" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 bg-slate-800/50" />
          ))}
        </div>
        <Skeleton className="h-64 w-full bg-slate-800/50" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <HealthPageBackground />

      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-mono text-cyan-300">Health Dashboard</h1>
            <p className="text-slate-300 font-mono mt-1 text-sm">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <Badge
            variant="secondary"
            className="text-lg px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 shadow-lg shadow-cyan-500/25 font-mono"
          >
            <Heart className="mr-2 h-4 w-4" />
            Health Score: {healthScore}
          </Badge>
        </div>

        <TodaySummaryRow />
        <HealthContent currentView={currentView} onTabChange={setCurrentView} />
      </div>
    </div>
  )
}

export default function HealthPage() {
  return (
    <HealthProvider>
      <HealthPageInner />
    </HealthProvider>
  )
}
