"use client"

import { Calendar, Flag, FolderKanban, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TrackedTask } from "../../_types/timeTrack.types"
import { TASK_PRIORITY_COLORS } from "../constants"

function dueDateColor(label: string | null) {
  if (!label) return "text-slate-500"
  if (label === "Today" || label === "Tomorrow") return "text-emerald-400"
  if (label === "Yesterday" || label.toLowerCase().includes("ago")) return "text-red-400"
  return "text-slate-400"
}

interface TaskMetaBadgesProps {
  task: Pick<
    TrackedTask,
    | "linkType"
    | "projectTitle"
    | "projectColor"
    | "goalTitle"
    | "goalCategoryLabel"
    | "dueDateLabel"
    | "priority"
    | "status"
  >
  className?: string
  compact?: boolean
}

export function TaskMetaBadges({ task, className, compact = false }: TaskMetaBadgesProps) {
  const sourceLabel =
    task.linkType === "project" && task.projectTitle
      ? task.projectTitle
      : task.linkType === "goal" && task.goalTitle
        ? task.goalTitle
        : "Personal"

  const SourceIcon = task.linkType === "goal" ? Target : FolderKanban

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <Badge
        variant="outline"
        className={cn(
          "gap-1 font-mono font-normal border-slate-600/80 text-slate-300",
          compact ? "text-[10px] px-1.5 py-0" : "text-xs"
        )}
      >
        {task.linkType === "project" && task.projectColor ? (
          <span
            className="h-2 w-2 shrink-0 rounded-sm"
            style={{ backgroundColor: task.projectColor }}
          />
        ) : (
          <SourceIcon className={cn("shrink-0", compact ? "h-2.5 w-2.5" : "h-3 w-3")} />
        )}
        <span className="truncate max-w-[140px]">{sourceLabel}</span>
      </Badge>

      {task.goalCategoryLabel && task.linkType === "goal" && (
        <Badge
          variant="outline"
          className={cn(
            "font-mono font-normal border-slate-600/80 text-slate-400",
            compact ? "text-[10px] px-1.5 py-0" : "text-xs"
          )}
        >
          {task.goalCategoryLabel}
        </Badge>
      )}

      <Badge
        variant="outline"
        className={cn(
          "gap-1 font-mono font-normal",
          compact ? "text-[10px] px-1.5 py-0" : "text-xs",
          TASK_PRIORITY_COLORS[task.priority] ?? TASK_PRIORITY_COLORS.low
        )}
      >
        <Flag className={cn("shrink-0", compact ? "h-2.5 w-2.5" : "h-3 w-3")} />
        {task.priority}
      </Badge>

      <Badge
        variant="outline"
        className={cn(
          "gap-1 font-mono font-normal border-slate-600/80",
          compact ? "text-[10px] px-1.5 py-0" : "text-xs",
          dueDateColor(task.dueDateLabel)
        )}
      >
        <Calendar className={cn("shrink-0", compact ? "h-2.5 w-2.5" : "h-3 w-3")} />
        {task.dueDateLabel || "No due date"}
      </Badge>

      {task.status && task.status !== "todo" && (
        <Badge
          variant="outline"
          className={cn(
            "font-mono font-normal border-slate-600/80 text-slate-400 capitalize",
            compact ? "text-[10px] px-1.5 py-0" : "text-xs"
          )}
        >
          {task.status.replace(/_/g, " ")}
        </Badge>
      )}
    </div>
  )
}
