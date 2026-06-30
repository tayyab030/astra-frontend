"use client"

import dynamic from "next/dynamic"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import type { HealthTabId } from "../_types/health.types"
import { NavigationTabs } from "./NavigationTabs"

const OverviewTab = dynamic(
  () => import("./OverviewTab").then((m) => ({ default: m.OverviewTab })),
  { loading: () => <TabSkeleton /> }
)
const WeightTab = dynamic(
  () => import("./WeightTab").then((m) => ({ default: m.WeightTab })),
  { loading: () => <TabSkeleton tall /> }
)
const TrackingTab = dynamic(
  () => import("./TrackingTab").then((m) => ({ default: m.TrackingTab })),
  { loading: () => <TabSkeleton tall /> }
)
const HabitsTab = dynamic(
  () => import("./HabitsTab").then((m) => ({ default: m.HabitsTab })),
  { loading: () => <TabSkeleton /> }
)
const ExerciseTab = dynamic(
  () => import("./ExerciseTab").then((m) => ({ default: m.ExerciseTab })),
  { loading: () => <TabSkeleton /> }
)
const WellnessTab = dynamic(
  () => import("./WellnessTab").then((m) => ({ default: m.WellnessTab })),
  { loading: () => <TabSkeleton /> }
)
const InsightsTab = dynamic(
  () => import("./InsightsTab").then((m) => ({ default: m.InsightsTab })),
  { loading: () => <TabSkeleton tall /> }
)

function TabSkeleton({ tall }: { tall?: boolean }) {
  return <Skeleton className={`w-full bg-slate-800/50 ${tall ? "h-72" : "h-48"}`} />
}

interface HealthContentProps {
  currentView: HealthTabId
  onTabChange: (tab: HealthTabId) => void
}

export function HealthContent({ currentView, onTabChange }: HealthContentProps) {
  return (
    <>
      <NavigationTabs activeTab={currentView} onTabChange={onTabChange} />

      <Tabs value={currentView} className="mt-0">
        <TabsContent value="overview" className="mt-4">
          {currentView === "overview" ? <OverviewTab /> : null}
        </TabsContent>
        <TabsContent value="weight" className="mt-4">
          {currentView === "weight" ? <WeightTab /> : null}
        </TabsContent>
        <TabsContent value="tracking" className="mt-4">
          {currentView === "tracking" ? <TrackingTab /> : null}
        </TabsContent>
        <TabsContent value="habits" className="mt-4">
          {currentView === "habits" ? <HabitsTab /> : null}
        </TabsContent>
        <TabsContent value="exercise" className="mt-4">
          {currentView === "exercise" ? <ExerciseTab /> : null}
        </TabsContent>
        <TabsContent value="wellness" className="mt-4">
          {currentView === "wellness" ? <WellnessTab /> : null}
        </TabsContent>
        <TabsContent value="insights" className="mt-4">
          {currentView === "insights" ? <InsightsTab /> : null}
        </TabsContent>
      </Tabs>
    </>
  )
}
