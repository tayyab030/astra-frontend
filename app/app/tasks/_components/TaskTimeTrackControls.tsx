"use client"

import type { MouseEvent } from "react"
import { Play, Square } from "lucide-react"
import { useTimeTrackContext } from "@/app/app/time-track/_context/TimeTrackProvider"
import { cn } from "@/lib/utils"
import type { TaskItem } from "@/lib/api/tasks"

interface TaskTimeTrackControlsProps {
  task: Pick<TaskItem, "id" | "title" | "project_title" | "priority" | "completed">
  className?: string
  iconClassName?: string
}

export function TaskTimeTrackControls({
  task,
  className,
  iconClassName = "h-3.5 w-3.5",
}: TaskTimeTrackControlsProps) {
  const { activeTimer, playTask, stopTask, isSaving } = useTimeTrackContext()
  const isRunning = activeTimer.taskId === task.id && activeTimer.status === "running"
  const disabled = task.completed || isSaving

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (disabled) return

    if (isRunning) {
      void stopTask(task.id)
      return
    }

    void playTask({
      id: task.id,
      title: task.title,
      project_title: task.project_title,
      priority: task.priority,
    })
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        isRunning ? "text-red-400 hover:text-red-300" : "text-slate-400 hover:text-cyan-300",
        className
      )}
      aria-label={isRunning ? "Stop timer" : "Start timer"}
    >
      {isRunning ? (
        <Square className={iconClassName} />
      ) : (
        <Play className={iconClassName} />
      )}
    </button>
  )
}
