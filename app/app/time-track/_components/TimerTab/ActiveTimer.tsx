"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pause, Play, Square } from "lucide-react"
import type { UseTimeTrackReturn } from "../../_hooks/useTimeTrack"
import { formatTimerClock } from "../../_utils/formatTime"

interface ActiveTimerProps {
  timeTrack: UseTimeTrackReturn
}

export function ActiveTimer({ timeTrack }: ActiveTimerProps) {
  const { activeTask, activeTimer, displayClockSeconds, startTimer, pauseTimer, stopTimer } =
    timeTrack

  const isRunning = activeTimer.status === "running"
  const hasActiveTask = Boolean(activeTask)

  return (
    <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center py-10">
        <div className="text-6xl font-mono font-bold tracking-wider text-cyan-300 tabular-nums">
          {formatTimerClock(displayClockSeconds)}
        </div>
        <p className="mt-4 text-lg text-slate-300 font-mono">
          {activeTask?.title ?? "No task selected"}
        </p>
        {activeTask?.projectTitle && (
          <p className="text-sm text-slate-500 font-mono">{activeTask.projectTitle}</p>
        )}

        <div className="mt-8 flex items-center gap-3">
          {!isRunning ? (
            <Button
              size="lg"
              disabled={!hasActiveTask}
              onClick={() => activeTask && startTimer(activeTask.taskId)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 font-mono"
            >
              <Play className="mr-2 h-5 w-5" />
              {activeTimer.status === "paused" ? "Resume" : "Start"}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              onClick={pauseTimer}
              className="border-slate-600 text-white hover:bg-slate-700 font-mono"
            >
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            disabled={!isRunning}
            onClick={stopTimer}
            className="border-red-500/50 text-red-300 hover:bg-red-500/10 font-mono"
          >
            <Square className="mr-2 h-5 w-5" />
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
