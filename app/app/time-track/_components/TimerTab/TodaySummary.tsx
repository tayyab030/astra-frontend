"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { formatDuration } from "../../_utils/formatTime"

interface TodaySummaryProps {
  totalSeconds: number
}

export function TodaySummary({ totalSeconds }: TodaySummaryProps) {
  return (
    <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
      <CardContent className="flex items-center gap-3 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
          <Clock className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <p className="text-sm text-slate-400 font-mono">Total today</p>
          <p className="text-xl font-bold text-white font-mono">{formatDuration(totalSeconds)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
