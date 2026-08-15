"use client"

import dynamic from "next/dynamic"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { TabPanelSkeleton } from "@/components/skeletons"
import type { HealthTabId } from "../_types/health.types"
import { NavigationTabs } from "./NavigationTabs"

const OverviewTab = dynamic(
  () => import("./OverviewTab").then((m) => ({ default: m.OverviewTab })),
  { loading: () => <TabPanelSkeleton /> }
)
const WeightTab = dynamic(
  () => import("./WeightTab").then((m) => ({ default: m.WeightTab })),
  { loading: () => <TabPanelSkeleton tall /> }
)
const TrackingTab = dynamic(
  () => import("./TrackingTab").then((m) => ({ default: m.TrackingTab })),
  { loading: () => <TabPanelSkeleton tall /> }
)
const ExerciseTab = dynamic(
  () => import("./ExerciseTab").then((m) => ({ default: m.ExerciseTab })),
  { loading: () => <TabPanelSkeleton /> }
)
const WellnessTab = dynamic(
  () => import("./WellnessTab").then((m) => ({ default: m.WellnessTab })),
  { loading: () => <TabPanelSkeleton /> }
)
const InsightsTab = dynamic(
  () => import("./InsightsTab").then((m) => ({ default: m.InsightsTab })),
  { loading: () => <TabPanelSkeleton tall /> }
)

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
