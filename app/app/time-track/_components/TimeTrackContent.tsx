"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { format } from "date-fns"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useTimeTrackContext } from "../_context/TimeTrackProvider"
import { useTimeTrackPageData } from "../_hooks/useTimeTrackPageData"
import type { UseTimeTrackReturn } from "../_hooks/useTimeTrack"
import NavigationTabs from "./NavigationTabs"
import type { TimeTrackTabId } from "./constants"

const TimerTab = dynamic(
  () => import("./TimerTab").then((m) => ({ default: m.TimerTab })),
  { loading: () => <TabSkeleton /> }
)
const DashboardTab = dynamic(
  () => import("./DashboardTab").then((m) => ({ default: m.DashboardTab })),
  { loading: () => <TabSkeleton tall /> }
)
const ReportsTab = dynamic(
  () => import("./ReportsTab").then((m) => ({ default: m.ReportsTab })),
  { loading: () => <TabSkeleton /> }
)
const WeeklyTab = dynamic(
  () => import("./WeeklyTab").then((m) => ({ default: m.WeeklyTab })),
  { loading: () => <TabSkeleton tall /> }
)
const SettingsTab = dynamic(
  () => import("./SettingsTab").then((m) => ({ default: m.SettingsTab })),
  { loading: () => <TabSkeleton /> }
)

function TabSkeleton({ tall }: { tall?: boolean }) {
  return <Skeleton className={`w-full bg-slate-800/50 ${tall ? "h-72" : "h-48"}`} />
}

export default function TimeTrackContent() {
  const [currentView, setCurrentView] = useState<TimeTrackTabId>("timer")
  const core = useTimeTrackContext()
  const page = useTimeTrackPageData(core)

  const timeTrack = useMemo<UseTimeTrackReturn>(
    () => ({
      ...core,
      ...page,
      isLoading: core.isLoading || page.isPageLoading,
      isSaving: core.isSaving || page.isSavingPage,
    }),
    [core, page]
  )

  if (timeTrack.isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-10 w-48 bg-slate-800/50" />
        <Skeleton className="h-64 w-full bg-slate-800/50" />
        <Skeleton className="h-32 w-full bg-slate-800/50" />
      </div>
    )
  }

  return (
    <div className="relative flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono">Time Track</h1>
          <p className="text-sm text-slate-400 font-mono mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <NavigationTabs activeTab={currentView} onTabChange={setCurrentView} />

      <Tabs value={currentView} className="mt-4">
        <TabsContent value="timer" className="mt-0">
          {currentView === "timer" ? <TimerTab timeTrack={timeTrack} /> : null}
        </TabsContent>
        <TabsContent value="dashboard" className="mt-0">
          {currentView === "dashboard" ? <DashboardTab timeTrack={timeTrack} /> : null}
        </TabsContent>
        <TabsContent value="reports" className="mt-0">
          {currentView === "reports" ? <ReportsTab timeTrack={timeTrack} /> : null}
        </TabsContent>
        <TabsContent value="weekly" className="mt-0">
          {currentView === "weekly" ? <WeeklyTab timeTrack={timeTrack} /> : null}
        </TabsContent>
        <TabsContent value="settings" className="mt-0">
          {currentView === "settings" ? <SettingsTab timeTrack={timeTrack} /> : null}
        </TabsContent>
      </Tabs>
    </div>
  )
}
