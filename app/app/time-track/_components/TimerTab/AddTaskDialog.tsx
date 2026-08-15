"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { AvailableTask } from "../../_types/timeTrack.types"
import { TaskMetaBadges } from "./TaskMetaBadges"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableTasks: AvailableTask[]
  onAddTask: (task: AvailableTask) => void | Promise<void>
  isAdding?: boolean
}

function toTrackedMeta(task: AvailableTask) {
  return {
    linkType: task.link_type,
    projectTitle: task.project_title,
    projectColor: task.project_color,
    goalTitle: task.goal_title,
    goalCategoryLabel: task.goal_category_label,
    dueDateLabel: task.due_date_label,
    priority: task.priority,
    status: task.status,
  }
}

export function AddTaskDialog({
  open,
  onOpenChange,
  availableTasks,
  onAddTask,
  isAdding = false,
}: AddTaskDialogProps) {
  const [search, setSearch] = useState("")

  const filtered = availableTasks.filter((task) => {
    const query = search.toLowerCase()
    return (
      task.title.toLowerCase().includes(query) ||
      (task.project_title?.toLowerCase().includes(query) ?? false) ||
      (task.goal_title?.toLowerCase().includes(query) ?? false) ||
      (task.due_date_label?.toLowerCase().includes(query) ?? false)
    )
  })

  const handleAdd = async (task: AvailableTask) => {
    await onAddTask(task)
    onOpenChange(false)
    setSearch("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono">Add Task to Track</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by title, project, goal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-800/50 border-slate-600 text-white font-mono"
          />
        </div>
        <div className="max-h-72 overflow-y-auto space-y-2 mt-2">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 text-sm font-mono py-4">
              No tasks available
            </p>
          ) : (
            filtered.map((task) => (
              <button
                key={task.id}
                type="button"
                disabled={isAdding}
                onClick={() => void handleAdd(task)}
                className="w-full rounded-lg border border-slate-700/50 bg-slate-800/30 p-3 text-left hover:bg-slate-700/50 transition-colors disabled:opacity-50"
              >
                <p className="text-sm font-medium text-white font-mono">{task.title}</p>
                <TaskMetaBadges task={toTrackedMeta(task)} compact className="mt-2" />
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
