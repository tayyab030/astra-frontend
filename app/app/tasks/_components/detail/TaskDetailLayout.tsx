"use client"

import type React from "react"
import { useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
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
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { TaskItem, TasksListParams } from "@/lib/api/tasks"
import { useTasks } from "../../_hooks/useTasks"
import { TaskFormDialog } from "../TaskFormDialog"
import DetailTaskRow from "./DetailTaskRow"
import DetailBoardCard from "./DetailBoardCard"
import NavigationTabs from "./NavigationTabs"
import { TASK_SECTIONS, type TaskStatusValue } from "./constants"

const Wrapper = dynamic(() => import("../Wrapper"), { ssr: false })

function normalizeTaskStatus(status: string): TaskStatusValue {
  if (status === "in-progress") return "in_progress"
  if (status === "todo" || status === "in_progress" || status === "review" || status === "done") {
    return status
  }
  return "todo"
}

function taskBelongsInSection(task: TaskItem, sectionStatus: TaskStatusValue) {
  const status = normalizeTaskStatus(task.status)

  if (sectionStatus === "done") {
    return task.completed || status === "done"
  }

  return !task.completed && status === sectionStatus
}

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

function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function getFirstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10)
}

interface TaskDetailLayoutProps {
  header: React.ReactNode
  listParams: Omit<TasksListParams, "filter">
  fixedGoalId?: string
  fixedProjectId?: string
}

export default function TaskDetailLayout({
  header,
  listParams,
  fixedGoalId,
  fixedProjectId,
}: TaskDetailLayoutProps) {
  const [currentView, setCurrentView] = useState("list")
  const [calendarView, setCalendarView] = useState<"month" | "week" | "year">("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const draggedTaskIdRef = useRef<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TASK_SECTIONS.map((section) => [section.id, true])),
  )
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null)

  const {
    tasks,
    isLoading,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    isDeletingTask,
  } = useTasks("all", listParams)

  const activeView = ["list", "board", "calendar"].includes(currentView)
    ? currentView
    : "list"

  const taskSections = useMemo(
    () =>
      TASK_SECTIONS.map((section) => ({
        ...section,
        tasks: tasks.filter((task) => taskBelongsInSection(task, section.status)),
      })),
    [tasks],
  )

  const getTasksForDate = (date: Date) => {
    const dateStr = toDateString(date)
    return tasks.filter((task) => task.due_date === dateStr)
  }

  const navigateCalendar = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (calendarView === "month") {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    } else if (calendarView === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setFullYear(currentDate.getFullYear() + (direction === "next" ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const handleDragStart = (taskId: string) => {
    draggedTaskIdRef.current = taskId
    setDraggedTaskId(taskId)
  }

  const handleDragEnd = () => {
    window.setTimeout(() => {
      draggedTaskIdRef.current = null
      setDraggedTaskId(null)
    }, 50)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (event: React.DragEvent, sectionStatus: TaskStatusValue) => {
    event.preventDefault()
    event.stopPropagation()

    const taskId =
      event.dataTransfer.getData("text/plain") || draggedTaskIdRef.current || draggedTaskId
    if (!taskId) return

    const task = tasks.find((entry) => entry.id === taskId)
    if (!task) return

    const isDone = sectionStatus === "done"
    await updateTask({
      id: task.id,
      data: {
        status: sectionStatus,
        completed: isDone,
      },
    })

    draggedTaskIdRef.current = null
    setDraggedTaskId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return
    await deleteTask(taskToDelete.id)
    setTaskToDelete(null)
  }

  const openCreate = () => {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const openEdit = (task: TaskItem) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const renderSectionDropZone = (section: (typeof taskSections)[number], variant: "list" | "board") => {
    const isExpanded = expandedSections[section.id]
    const isActiveDropTarget = Boolean(draggedTaskId)
    const dropHandlers = {
      onDragOver: handleDragOver,
      onDrop: (event: React.DragEvent) => void handleDrop(event, section.status),
    }

    const renderTaskItem = (task: TaskItem) => {
      const dragProps = {
        task,
        isDragging: draggedTaskId === task.id,
        onEdit: openEdit,
        onDelete: setTaskToDelete,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        onDragOverZone: handleDragOver,
        onDropInZone: (event: React.DragEvent) => {
          void handleDrop(event, section.status)
        },
      }

      if (variant === "board") {
        return <DetailBoardCard key={task.id} {...dragProps} />
      }

      return (
        <DetailTaskRow
          key={task.id}
          {...dragProps}
          onToggleComplete={(entry) => toggleTaskComplete(entry.id, !entry.completed)}
        />
      )
    }

    return (
      <div
        key={section.id}
        {...dropHandlers}
        className={cn(
          variant === "list"
            ? "rounded-lg border border-slate-700/30 bg-slate-800/20 transition-all duration-200"
            : "flex h-full min-h-0 flex-col rounded-lg border border-slate-700/30 bg-slate-800/30 p-4 transition-all duration-200",
          isActiveDropTarget && "border-cyan-500/50 bg-slate-800/50",
        )}
      >
        <button
          type="button"
          onClick={() => toggleSection(section.id)}
          className={cn(
            "flex w-full shrink-0 items-center justify-between text-left",
            variant === "list" ? "px-4 py-3" : "mb-3 px-0 py-0",
          )}
        >
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            )}
            <h3 className="font-semibold font-mono text-slate-200">{section.name}</h3>
          </div>
          <span className="text-xs bg-slate-700/50 text-slate-400 px-2 py-1 rounded">
            {section.tasks.length}
          </span>
        </button>

        {isExpanded ? (
          <div
            {...dropHandlers}
            className={cn(
              variant === "list"
                ? "space-y-2 px-3 pb-1"
                : "min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden overscroll-y-contain pr-1",
            )}
          >
            {section.tasks.map(renderTaskItem)}
            {draggedTaskId && section.tasks.length === 0 ? (
              <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-6 text-center">
                <p className="text-slate-400 font-mono text-sm">Drop task here</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div {...dropHandlers} className={cn(variant === "board" ? "flex-1 min-h-[80px]" : "min-h-12")} />
        )}
      </div>
    )
  }

  const renderMonthCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-slate-700/30" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const tasksForDay = getTasksForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div
          key={day}
          className={cn(
            "h-24 border border-slate-700/30 p-1",
            isToday ? "bg-cyan-500/10 border-cyan-500/30" : "hover:bg-slate-800/30",
          )}
        >
          <div className={cn("text-sm font-mono mb-1", isToday ? "text-cyan-300" : "text-slate-300")}>
            {day}
          </div>
          <div className="space-y-1">
            {tasksForDay.slice(0, 2).map((task) => (
              <div
                key={task.id}
                className={cn(
                  "text-xs p-1 rounded truncate bg-opacity-20 text-white font-mono",
                  getPriorityColor(task.priority),
                )}
                title={task.title}
              >
                {task.title.length > 20 ? `${task.title.substring(0, 20)}...` : task.title}
              </div>
            ))}
            {tasksForDay.length > 2 ? (
              <div className="text-xs text-slate-400 font-mono">+{tasksForDay.length - 2} more</div>
            ) : null}
          </div>
        </div>,
      )
    }

    return (
      <div className="grid grid-cols-7 gap-0">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="h-10 border border-slate-700/30 bg-slate-800/50 flex items-center justify-center"
          >
            <span className="text-sm text-slate-300 font-mono">{day}</span>
          </div>
        ))}
        {days}
      </div>
    )
  }

  const hasTasks = tasks.length > 0

  const isBoardView = activeView === "board"

  return (
    <Wrapper className={isBoardView ? "overflow-hidden min-h-full" : "min-h-full"}>
      <div
        className={cn(
          "relative z-10 flex flex-col",
          isBoardView ? "task-h-screen overflow-hidden" : "min-h-0",
        )}
      >
        {header}
        <NavigationTabs activeTab={currentView} onTabChange={setCurrentView} />

        <div className={cn("flex-1", isBoardView ? "min-h-0 overflow-hidden" : "")}>
          <Tabs value={activeView} className={cn(isBoardView && "flex h-full flex-col")}>
            <TabsContent value="list" className="mt-0 p-6 pb-10">
              <div className="mb-4 flex items-center justify-end">
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-mono text-sm"
                  onClick={openCreate}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full bg-slate-900/50" />
                  ))}
                </div>
              ) : hasTasks ? (
                <div className="space-y-4">
                  {taskSections.map((section) => renderSectionDropZone(section, "list"))}
                </div>
              ) : (
                <div className="py-12 text-center font-mono text-sm text-slate-400">
                  No tasks yet. Create one to get started.
                </div>
              )}
            </TabsContent>

            <TabsContent value="board" className="task-h-screen mt-0 overflow-hidden p-6">
              {isLoading ? (
                <div className="grid h-full min-h-0 grid-cols-1 gap-6 md:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-full min-h-[280px] w-full bg-slate-900/50" />
                  ))}
                </div>
              ) : (
                <div className="grid h-full min-h-0 grid-cols-1 gap-6 md:grid-cols-4">
                  {taskSections.map((section) => renderSectionDropZone(section, "board"))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="calendar" className="mt-0 p-6 pb-10">
              <Card className="border-slate-600/30 bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                      <h3 className="font-mono text-xl font-semibold text-slate-200">
                        {currentDate.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateCalendar("prev")}
                          className="border-slate-600/50 bg-transparent text-slate-300 hover:bg-slate-800/50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateCalendar("next")}
                          className="border-slate-600/50 bg-transparent text-slate-300 hover:bg-slate-800/50"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {(["month", "week", "year"] as const).map((view) => (
                        <Button
                          key={view}
                          variant={calendarView === view ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCalendarView(view)}
                          className={
                            calendarView === view
                              ? "bg-gradient-to-r from-cyan-500 to-blue-600 font-mono text-white"
                              : "border-slate-600/50 bg-transparent font-mono text-slate-300 hover:bg-slate-800/50"
                          }
                        >
                          {view.charAt(0).toUpperCase() + view.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {calendarView === "month" ? (
                    renderMonthCalendar()
                  ) : (
                    <div className="py-12 text-center font-mono text-slate-400">
                      {calendarView === "week" ? "Week" : "Year"} view coming soon.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={editingTask ? "edit" : "add"}
        task={editingTask}
        fixedGoalId={fixedGoalId}
        fixedProjectId={fixedProjectId}
      />

      <AlertDialog open={Boolean(taskToDelete)} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent className="border-red-500/20 bg-gradient-to-br from-slate-800/95 to-slate-700/95">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-slate-200">Delete task?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-slate-400">
              This will permanently delete &quot;{taskToDelete?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 font-mono hover:bg-red-700"
              disabled={isDeletingTask}
              onClick={() => void handleDeleteConfirm()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Wrapper>
  )
}
