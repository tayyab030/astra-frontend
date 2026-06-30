"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import type { AvailableTask } from "../../_types/timeTrack.types"
import { TASK_PRIORITY_COLORS } from "../constants"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableTasks: AvailableTask[]
  onAddTask: (task: AvailableTask) => void
}

export function AddTaskDialog({
  open,
  onOpenChange,
  availableTasks,
  onAddTask,
}: AddTaskDialogProps) {
  const [search, setSearch] = useState("")

  const filtered = availableTasks.filter((task) => {
    const query = search.toLowerCase()
    return (
      task.title.toLowerCase().includes(query) ||
      (task.project_title?.toLowerCase().includes(query) ?? false)
    )
  })

  const handleAdd = (task: AvailableTask) => {
    onAddTask(task)
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
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-800/50 border-slate-600 text-white font-mono"
          />
        </div>
        <div className="max-h-64 overflow-y-auto space-y-2 mt-2">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 text-sm font-mono py-4">
              No tasks available
            </p>
          ) : (
            filtered.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => handleAdd(task)}
                className="w-full flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/30 p-3 text-left hover:bg-slate-700/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-white font-mono">{task.title}</p>
                  {task.project_title && (
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{task.project_title}</p>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={`font-mono text-xs ${TASK_PRIORITY_COLORS[task.priority] ?? TASK_PRIORITY_COLORS.low}`}
                >
                  {task.priority}
                </Badge>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
