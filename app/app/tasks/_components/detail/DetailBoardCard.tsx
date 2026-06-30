"use client"

import type { DragEvent } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, GripVertical, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TaskItem } from "@/lib/api/tasks"

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

interface DetailBoardCardProps {
  task: TaskItem
  isDragging?: boolean
  isDragActive?: boolean
  onEdit: (task: TaskItem) => void
  onDelete: (task: TaskItem) => void
  onDragStart: (taskId: string) => void
  onDragEnd: () => void
}

export default function DetailBoardCard({
  task,
  isDragging,
  isDragActive,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}: DetailBoardCardProps) {
  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", task.id)
    event.dataTransfer.effectAllowed = "move"
    onDragStart(task.id)
  }

  const stopDragOnControls = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "group cursor-grab border-slate-600/30 bg-slate-900/50 backdrop-blur-sm transition-all duration-200 active:cursor-grabbing hover:bg-slate-800/50 hover:border-cyan-500/30",
        isDragging && "scale-[0.98] opacity-50",
        isDragActive && !isDragging && "pointer-events-none",
        task.completed && "opacity-80",
      )}
    >
      <CardContent className="p-3">
        <div className="mb-2 flex items-start gap-2 min-w-0">
          <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          <h4
            className={cn(
              "min-w-0 flex-1 truncate text-sm font-medium font-mono text-slate-200",
              task.completed && "text-slate-500 line-through",
            )}
            title={task.title}
          >
            {task.title}
          </h4>
          <div
            className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", getPriorityColor(task.priority))}
          />
        </div>

        {task.description ? (
          <p
            className="mb-3 line-clamp-2 text-xs font-mono text-slate-400"
            title={task.description}
          >
            {task.description}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1 text-xs text-slate-500">
            <Calendar className="h-3 w-3 shrink-0" />
            <span className="truncate font-mono">{task.due_date_label || "No date"}</span>
          </div>

          {(task.tags ?? []).slice(0, 1).map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="shrink-0 border-0 px-1.5 py-0 text-xs text-white"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            draggable={false}
            onDragStart={stopDragOnControls}
            onClick={() => onEdit(task)}
            className="rounded p-1 text-slate-400 hover:bg-slate-700/50 hover:text-white"
            aria-label="Edit task"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            draggable={false}
            onDragStart={stopDragOnControls}
            onClick={() => onDelete(task)}
            className="rounded p-1 text-slate-400 hover:bg-slate-700/50 hover:text-red-400"
            aria-label="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
