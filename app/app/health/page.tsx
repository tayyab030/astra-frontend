"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { Heart } from "lucide-react"
import {
  StatCardsSkeleton,
  TabPanelSkeleton,
  TabStripSkeleton,
} from "@/components/skeletons"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { HealthProvider, useHealthContext } from "./_context/HealthProvider"
import { HealthContent } from "./_components/HealthContent"
import { TodaySummaryRow } from "./_components/TodaySummaryRow"
import { HEALTH_TABS } from "./_components/constants"
import type { HealthTabId } from "./_types/health.types"

function isHealthTab(value: string | null): value is HealthTabId {
  return HEALTH_TABS.some((tab) => tab.id === value)
}

function HealthPageInner() {
  const { healthScore, isLoading } = useHealthContext()
  const searchParams = useSearchParams()
  const [currentView, setCurrentView] = useState<HealthTabId>(() => {
    const tab = searchParams.get("tab")
    return isHealthTab(tab) ? tab : "overview"
  })

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (isHealthTab(tab)) setCurrentView(tab)
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="astra-page space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
        <StatCardsSkeleton count={4} />
        <TabStripSkeleton count={6} />
        <TabPanelSkeleton />
      </div>
    )
  }

  return (
    <div className="astra-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="astra-title">Health Dashboard</h1>
          <p className="astra-subtitle mt-1 text-sm">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <Badge variant="secondary" className="astra-badge-accent text-lg px-4 py-2">
          <Heart className="mr-2 h-4 w-4" />
          Health Score: {healthScore}
        </Badge>
      </div>

      <TodaySummaryRow />
      <HealthContent currentView={currentView} onTabChange={setCurrentView} />
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
