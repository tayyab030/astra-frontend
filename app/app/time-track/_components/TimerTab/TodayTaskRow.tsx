"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, Trash2 } from "lucide-react"
import type { TrackedTask } from "../../_types/timeTrack.types"
import type { ActiveTimerState } from "../../_types/timeTrack.types"
import { formatDuration } from "../../_utils/formatTime"
import { TaskMetaBadges } from "./TaskMetaBadges"

interface TodayTaskRowProps {
  task: TrackedTask
  activeTimer: ActiveTimerState
  elapsedSeconds: number
  onStart: (taskId: string) => void
  onSelect: (taskId: string) => void
  onPause: () => void
  onRemove: (task: TrackedTask) => void
}

export function TodayTaskRow({
  task,
  activeTimer,
  elapsedSeconds,
  onStart,
  onSelect,
  onPause,
  onRemove,
}: TodayTaskRowProps) {
  const isSelected = activeTimer.taskId === task.taskId
  const isRunning = isSelected && activeTimer.status === "running"
  const displaySeconds = isRunning ? elapsedSeconds : task.totalSecondsToday

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(task.taskId)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(task.taskId)}
      className={`flex items-start justify-between rounded-lg border p-3 transition-colors cursor-pointer ${
        isSelected
          ? "border-cyan-500/50 bg-cyan-500/10"
          : "border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-white font-mono truncate">{task.title}</p>
          <span className="shrink-0 text-sm text-cyan-300 font-mono tabular-nums">
            {formatDuration(displaySeconds)}
          </span>
        </div>
        <TaskMetaBadges task={task} compact className="mt-2" />
      </div>

      <div className="flex items-center gap-1 ml-3 shrink-0">
        {isRunning ? (
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onPause()
            }}
            className="h-8 w-8 text-slate-400 hover:text-white"
          >
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onStart(task.taskId)
            }}
            className="h-8 w-8 text-slate-400 hover:text-cyan-300"
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(task)
          }}
          className="h-8 w-8 text-slate-400 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
