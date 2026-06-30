"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Trash2 } from "lucide-react"
import type { TrackedTask } from "../../_types/timeTrack.types"
import type { ActiveTimerState } from "../../_types/timeTrack.types"
import { formatDuration } from "../../_utils/formatTime"

interface TodayTaskRowProps {
  task: TrackedTask
  activeTimer: ActiveTimerState
  elapsedSeconds: number
  onStart: (taskId: string) => void
  onPause: () => void
  onRemove: (task: TrackedTask) => void
}

export function TodayTaskRow({
  task,
  activeTimer,
  elapsedSeconds,
  onStart,
  onPause,
  onRemove,
}: TodayTaskRowProps) {
  const isActive = activeTimer.taskId === task.taskId
  const isRunning = isActive && activeTimer.status === "running"
  const displaySeconds = task.totalSecondsToday + (isRunning ? elapsedSeconds : 0)

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
        isActive
          ? "border-cyan-500/50 bg-cyan-500/10"
          : "border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white font-mono truncate">{task.title}</p>
        <div className="flex items-center gap-2 mt-1">
          {task.projectTitle && (
            <Badge variant="outline" className="text-xs font-mono border-slate-600 text-slate-400">
              {task.projectTitle}
            </Badge>
          )}
          <span className="text-sm text-cyan-300 font-mono tabular-nums">
            {formatDuration(displaySeconds)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-3">
        {isRunning ? (
          <Button
            size="icon"
            variant="ghost"
            onClick={onPause}
            className="h-8 w-8 text-slate-400 hover:text-white"
          >
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onStart(task.taskId)}
            className="h-8 w-8 text-slate-400 hover:text-cyan-300"
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onRemove(task)}
          className="h-8 w-8 text-slate-400 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
