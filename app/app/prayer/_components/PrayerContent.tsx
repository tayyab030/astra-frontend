"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { usePrayer } from "../_hooks/usePrayer"
import { AnalysisPanel } from "./AnalysisPanel"
import { NavigationTabs } from "./NavigationTabs"
import { PRAYER_TABS, type PrayerTabId } from "./constants"
import { TimesPanel } from "./TimesPanel"
import { TrackPanel } from "./TrackPanel"

function isPrayerTab(value: string | null): value is PrayerTabId {
  return PRAYER_TABS.some((tab) => tab.id === value)
}

export function PrayerContent() {
  const prayer = usePrayer()
  const searchParams = useSearchParams()
  const [currentView, setCurrentView] = useState<PrayerTabId>(() => {
    const tab = searchParams.get("tab")
    return isPrayerTab(tab) ? tab : "times"
  })

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (isPrayerTab(tab)) setCurrentView(tab)
  }, [searchParams])

  if (prayer.isBootstrapping) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  const subtitle =
    currentView === "times"
      ? prayer.timings?.date.readable
        ? `${prayer.timings.date.readable}${
            prayer.timings.date.hijri
              ? ` · ${prayer.timings.date.hijri} AH`
              : ""
          }`
        : "Today's salah schedule"
      : currentView === "track"
        ? "Mark salah completed by day"
        : "Completion trends"

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Prayer</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <NavigationTabs activeTab={currentView} onTabChange={setCurrentView} />

      {currentView === "times" ? <TimesPanel prayer={prayer} /> : null}
      {currentView === "track" ? <TrackPanel prayer={prayer} /> : null}
      {currentView === "analysis" ? <AnalysisPanel /> : null}
    </div>
  )
}
