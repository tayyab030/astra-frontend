"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const TimeTrackContent = dynamic(() => import("./_components/TimeTrackContent"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col space-y-4">
      <Skeleton className="h-10 w-48 bg-slate-800/50" />
      <Skeleton className="h-64 w-full bg-slate-800/50" />
      <Skeleton className="h-32 w-full bg-slate-800/50" />
    </div>
  ),
})

export default function TimeTrackPage() {
  return <TimeTrackContent />
}
