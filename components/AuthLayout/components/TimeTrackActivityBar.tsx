"use client"

import { Button } from "@/components/ui/button"
import { Pause, Play, Square } from "lucide-react"
import { useTimeTrackContext } from "@/app/app/time-track/_context/TimeTrackProvider"
import { formatTimerClock } from "@/app/app/time-track/_utils/formatTime"

export function TimeTrackActivityBar() {
  const {
    activeTask,
    activeTimer,
    displayClockSeconds,
    startTimer,
    pauseTimer,
    stopTimer,
    settings,
    isLoading,
  } = useTimeTrackContext()

  if (isLoading || !settings.activityBarVisible) return null

  const isRunning = activeTimer.status === "running"
  const hasTask = Boolean(activeTask)

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-2xl lg:left-[5.5rem] lg:right-6">
      <div className="astra-card flex items-center gap-2 px-3 py-1.5 shadow-xl shadow-black/20">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium font-mono leading-tight text-foreground">
            {activeTask?.title ?? "No task selected"}
          </p>
        </div>

        <div className="shrink-0 text-sm font-bold tabular-nums text-primary font-mono">
          {hasTask ? formatTimerClock(displayClockSeconds) : formatTimerClock(0)}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {!isRunning ? (
            <Button
              size="icon"
              disabled={!hasTask}
              onClick={() => activeTask && startTimer(activeTask.taskId)}
              className="astra-btn-primary h-7 w-7"
            >
              <Play className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="outline"
              onClick={() => void pauseTimer()}
              className="h-7 w-7 border-border text-foreground hover:bg-accent"
            >
              <Pause className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            size="icon"
            variant="outline"
            disabled={!isRunning}
            onClick={stopTimer}
            className="h-7 w-7 border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <Square className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
