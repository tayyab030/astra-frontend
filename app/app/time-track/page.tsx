"use client"

import dynamic from "next/dynamic"
import {
  PageHeaderSkeleton,
  TabPanelSkeleton,
  TabStripSkeleton,
} from "@/components/skeletons"

const TimeTrackContent = dynamic(() => import("./_components/TimeTrackContent"), {
  ssr: false,
  loading: () => (
    <div className="astra-page space-y-6">
      <PageHeaderSkeleton />
      <TabStripSkeleton count={6} />
      <TabPanelSkeleton tall />
    </div>
  ),
})

export default function TimeTrackPage() {
  return <TimeTrackContent />
}
