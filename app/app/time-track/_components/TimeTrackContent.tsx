"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useTimeTrackContext } from "../_context/TimeTrackProvider"
import NavigationTabs from "./NavigationTabs"
import type { TimeTrackTabId } from "./constants"
import { TimerTab } from "./TimerTab"
import { DashboardTab } from "./DashboardTab"
import { ReportsTab } from "./ReportsTab"
import { WeeklyTab } from "./WeeklyTab"
import { SettingsTab } from "./SettingsTab"

export default function TimeTrackContent() {
  const [currentView, setCurrentView] = useState<TimeTrackTabId>("timer")
  const timeTrack = useTimeTrackContext()

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
          <TimerTab timeTrack={timeTrack} />
        </TabsContent>
        <TabsContent value="dashboard" className="mt-0">
          <DashboardTab timeTrack={timeTrack} />
        </TabsContent>
        <TabsContent value="reports" className="mt-0">
          <ReportsTab timeTrack={timeTrack} />
        </TabsContent>
        <TabsContent value="weekly" className="mt-0">
          <WeeklyTab timeTrack={timeTrack} />
        </TabsContent>
        <TabsContent value="settings" className="mt-0">
          <SettingsTab timeTrack={timeTrack} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
