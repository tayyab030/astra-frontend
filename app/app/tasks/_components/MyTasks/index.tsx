"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Pencil, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { TaskFilter, TaskItem, TasksListParams } from "@/lib/api/tasks"
import { useTasks } from "../../_hooks/useTasks"
import { TaskFormDialog } from "../TaskFormDialog"
import { TaskTimeTrackControls } from "../TaskTimeTrackControls"

const VISIBLE_TASK_COUNT = 6
const TASK_LIST_MAX_HEIGHT = "max-h-64 overflow-y-auto overflow-x-hidden"
const CARD_GRID_MAX_HEIGHT = "max-h-72 overflow-y-auto overflow-x-hidden pr-1"

function getDueDateColor(label: string) {
  if (!label) return "text-gray-400"
  if (label === "Today" || label === "Tomorrow") return "text-green-400"
  if (label === "Yesterday") return "text-red-400"
  return "text-gray-400"
}

function TaskLinkBadge({ task }: { task: TaskItem }) {
  if (task.link_type === "project" && task.project_title) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-3 h-3 rounded shrink-0"
          style={{ backgroundColor: task.project_color ?? "#5EC5DC" }}
        />
        <span className="text-xs text-gray-400 truncate max-w-[80px]">
          {task.project_title}
        </span>
      </div>
    )
  }

  if (task.link_type === "goal" && task.goal_title) {
    return (
      <span className="text-xs text-cyan-400 truncate max-w-[100px]">
        {task.goal_title}
      </span>
    )
  }

  return <span className="text-xs text-slate-500">Personal</span>
}

function TaskTagBadges({ tags }: { tags: TaskItem["tags"] }) {
  if (!tags?.length) return null

  return (
    <div className="flex items-center gap-1 shrink-0">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant="outline"
          className="rounded-sm border-0 px-1.5 py-0 text-xs font-normal text-white"
          style={{ backgroundColor: tag.color }}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  )
}

function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
  isUpdating,
}: {
  task: TaskItem
  onToggle: (task: TaskItem) => void
  onEdit: (task: TaskItem) => void
  onDelete: (task: TaskItem) => void
  isUpdating?: boolean
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-700/50 px-3 hover:bg-slate-700/30 transition-colors group">
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => onToggle(task)}
        className="mt-1 shrink-0"
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
            task.completed
              ? "bg-green-500 border-green-500"
              : "border-gray-400 hover:border-gray-300",
          )}
        >
          {task.completed ? (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : null}
        </div>
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm",
            task.completed ? "line-through text-gray-500" : "text-white",
          )}
        >
          {task.title}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <TaskLinkBadge task={task} />
        <TaskTagBadges tags={task.tags ?? []} />
        {task.due_date_label ? (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className={cn("text-xs", getDueDateColor(task.due_date_label))}>
              {task.due_date_label}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center size-6 rounded-full border border-dashed border-gray-400">
            <Calendar className="size-3 text-gray-400" />
          </div>
        )}
        <TaskTimeTrackControls task={task} />
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
      </div>
    </div>
  )
}

const MyTasks = ({
  listParams,
  fixedGoalId,
}: {
  listParams: Omit<TasksListParams, "filter">
  fixedGoalId?: string
}) => {
  const [activeTab, setActiveTab] = useState<TaskFilter>("upcoming")
  const [expandedTabs, setExpandedTabs] = useState<Partial<Record<TaskFilter, boolean>>>({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null)

  const {
    tasks,
    summary,
    isLoading,
    toggleTaskComplete,
    deleteTask,
    isUpdatingTask,
    isDeletingTask,
  } = useTasks(activeTab, listParams)

  const openCreate = () => {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const openEdit = (task: TaskItem) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return
    await deleteTask(taskToDelete.id)
    setTaskToDelete(null)
  }

  return (
    <>
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4.5 border border-slate-700/50 mb-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TaskFilter)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 bg-slate-700/50 border-slate-600">
            <TabsTrigger
              value="upcoming"
              className="text-white data-[state=active]:bg-slate-600 data-[state=active]:text-white"
            >
              Upcoming{summary ? ` (${summary.upcoming})` : ""}
            </TabsTrigger>
            <TabsTrigger
              value="overdue"
              className="text-white data-[state=active]:bg-slate-600 data-[state=active]:text-white"
            >
              Overdue{summary ? ` (${summary.overdue})` : ""}
            </TabsTrigger>
            <TabsTrigger
              value="undated"
              className="text-white data-[state=active]:bg-slate-600 data-[state=active]:text-white"
            >
              No date{summary ? ` (${summary.undated})` : ""}
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="text-white data-[state=active]:bg-slate-600 data-[state=active]:text-white"
            >
              Completed{summary ? ` (${summary.completed})` : ""}
            </TabsTrigger>
          </TabsList>

          {(["upcoming", "overdue", "undated", "completed"] as const).map((tab) => {
            const isExpanded = expandedTabs[tab] ?? false
            const visibleTasks = isExpanded ? tasks : tasks.slice(0, VISIBLE_TASK_COUNT)
            const hasMore = tasks.length > VISIBLE_TASK_COUNT

            return (
            <TabsContent key={tab} value={tab} className="mt-2">
              <div className="space-y-3">
                {tab === "upcoming" ? (
                  <div className="flex items-start gap-3 pb-2 border-b border-slate-700/50 px-3">
                    <Button
                      variant="ghost"
                      type="button"
                      className="text-sm text-gray-400 hover:text-white hover:bg-slate-700/30"
                      size="sm"
                      onClick={openCreate}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create task
                    </Button>
                  </div>
                ) : null}

                {isLoading ? (
                  <div className="space-y-2 px-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-10 w-full bg-slate-900/50" />
                    ))}
                  </div>
                ) : tasks.length > 0 ? (
                  <div className={TASK_LIST_MAX_HEIGHT}>
                    {visibleTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={(item) =>
                          toggleTaskComplete(item.id, !item.completed)
                        }
                        onEdit={openEdit}
                        onDelete={setTaskToDelete}
                        isUpdating={isUpdatingTask || isDeletingTask}
                      />
                    ))}
                    {hasMore ? (
                      <div className="text-center mt-3 pb-1">
                        <button
                          type="button"
                          className="text-blue-400 hover:text-blue-300 text-sm"
                          onClick={() =>
                            setExpandedTabs((prev) => ({
                              ...prev,
                              [tab]: !isExpanded,
                            }))
                          }
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8 text-sm">
                    {tab === "upcoming"
                      ? "No upcoming tasks. Create one to get started."
                      : tab === "overdue"
                        ? "No overdue tasks."
                        : tab === "undated"
                          ? "No tasks without a due date."
                          : "No completed tasks yet."}
                  </div>
                )}
              </div>
            </TabsContent>
            )
          })}
        </Tabs>
      </div>

      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={editingTask ? "edit" : "add"}
        task={editingTask}
        fixedGoalId={fixedGoalId}
      />

      <AlertDialog open={Boolean(taskToDelete)} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-red-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-slate-200">Delete task?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-slate-400">
              This will permanently delete &quot;{taskToDelete?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="font-mono bg-red-600 hover:bg-red-700"
              disabled={isDeletingTask}
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default MyTasks
