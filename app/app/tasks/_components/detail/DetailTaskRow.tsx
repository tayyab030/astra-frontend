"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Circle,
  Clock,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { TaskItem } from "@/lib/api/tasks"
import { TaskTimeTrackControls } from "../TaskTimeTrackControls"

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-500"
    case "medium":
      return "bg-yellow-500"
    case "low":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

function getStatusIcon(status: string, completed?: boolean) {
  if (completed || status === "done") {
    return <CheckCircle2 className="h-4 w-4 text-green-500" />
  }
  switch (status) {
    case "in_progress":
    case "in-progress":
      return <Clock className="h-4 w-4 text-blue-500" />
    case "review":
      return <Eye className="h-4 w-4 text-purple-500" />
    default:
      return <Circle className="h-4 w-4 text-gray-400" />
  }
}

interface DetailTaskRowProps {
  task: TaskItem
  onToggleComplete: (task: TaskItem) => void
  onEdit: (task: TaskItem) => void
  onDelete: (task: TaskItem) => void
}

export default function DetailTaskRow({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: DetailTaskRowProps) {
  return (
    <div className="group flex min-w-0 items-center rounded-lg border border-slate-700/30 bg-slate-800/30 p-3 transition-all duration-200 hover:border-cyan-500/30 hover:bg-slate-800/50">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={() => onToggleComplete(task)}
          className="shrink-0"
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          {getStatusIcon(task.status, task.completed)}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <h3
              className={cn(
                "min-w-0 flex-1 truncate font-medium font-mono text-slate-200",
                task.completed && "line-through text-slate-500",
              )}
              title={task.title}
            >
              {task.title}
            </h3>
            <div className={cn("h-2 w-2 shrink-0 rounded-full", getPriorityColor(task.priority))} />
          </div>
          {task.description ? (
            <p className="mt-1 truncate text-sm font-mono text-slate-400" title={task.description}>
              {task.description}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-3 text-xs text-slate-500">
          <span className="hidden font-mono sm:inline">{task.due_date_label || "No date"}</span>
          <div className="flex space-x-1">
            {(task.tags ?? []).slice(0, 1).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="border-0 px-1.5 py-0 text-xs text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          <TaskTimeTrackControls task={task} />
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="p-1 text-slate-400 hover:text-white"
              aria-label="Edit task"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              className="p-1 text-slate-400 hover:text-red-400"
              aria-label="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:bg-slate-700/50 hover:text-cyan-300"
            onClick={() => onEdit(task)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
