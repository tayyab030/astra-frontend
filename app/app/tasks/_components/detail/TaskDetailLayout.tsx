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
import { ChevronDown, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { TaskItem, TasksListParams } from "@/lib/api/tasks"
import { useTasks } from "../../_hooks/useTasks"
import { TaskFormDialog } from "../TaskFormDialog"
import DetailTaskRow from "./DetailTaskRow"
import DetailBoardCard from "./DetailBoardCard"
import TaskDashboardChart from "./TaskDashboardChart"
import TaskCalendarView from "./TaskCalendarView"
import NavigationTabs from "./NavigationTabs"
import { TASK_SECTIONS, type TaskStatusValue } from "./constants"

const Wrapper = dynamic(() => import("../Wrapper"), { ssr: false })

const BOARD_COLUMN_CLASS =
  "flex h-[70vh] max-h-[720px] min-h-[320px] flex-col rounded-lg border border-slate-700/30 bg-slate-800/30 p-4 transition-all duration-200"
const BOARD_TASKS_SCROLL_CLASS =
  "min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden overscroll-y-contain pr-1"

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
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const draggedTaskIdRef = useRef<string | null>(null)
  const dropHandledRef = useRef(false)
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

  const activeView = ["list", "board", "calendar", "dashboard"].includes(currentView)
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

  const handleDragStart = (taskId: string) => {
    dropHandledRef.current = false
    draggedTaskIdRef.current = taskId
    setDraggedTaskId(taskId)
  }

  const handleDragEnd = () => {
    window.setTimeout(() => {
      if (!dropHandledRef.current) {
        draggedTaskIdRef.current = null
        setDraggedTaskId(null)
      }
    }, 200)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (event: React.DragEvent, sectionStatus: TaskStatusValue) => {
    event.preventDefault()

    const taskId =
      event.dataTransfer.getData("text/plain") || draggedTaskIdRef.current || draggedTaskId
    if (!taskId) return

    const task = tasks.find((entry) => entry.id === taskId)
    if (!task) return

    const currentStatus = normalizeTaskStatus(task.status)
    const isDone = sectionStatus === "done"
    const alreadyInSection =
      sectionStatus === "done"
        ? task.completed || currentStatus === "done"
        : !task.completed && currentStatus === sectionStatus

    dropHandledRef.current = true
    draggedTaskIdRef.current = null
    setDraggedTaskId(null)

    if (alreadyInSection) return

    await updateTask({
      id: task.id,
      data: {
        status: sectionStatus,
        completed: isDone,
      },
    })
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

  const renderListSection = (section: (typeof taskSections)[number]) => {
    const isExpanded = expandedSections[section.id]

    return (
      <div
        key={section.id}
        className="rounded-lg border border-slate-700/30 bg-slate-800/20 transition-all duration-200"
      >
        <button
          type="button"
          onClick={() => toggleSection(section.id)}
          className="flex w-full shrink-0 items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex min-w-0 items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
            )}
            <h3 className="truncate font-mono font-semibold text-slate-200">{section.name}</h3>
          </div>
          <span className="shrink-0 rounded bg-slate-700/50 px-2 py-1 text-xs text-slate-400">
            {section.tasks.length}
          </span>
        </button>

        {isExpanded ? (
          <div className="space-y-2 px-3 pb-2">
            {section.tasks.map((task) => (
              <DetailTaskRow
                key={task.id}
                task={task}
                onToggleComplete={(entry) => toggleTaskComplete(entry.id, !entry.completed)}
                onEdit={openEdit}
                onDelete={setTaskToDelete}
              />
            ))}
          </div>
        ) : null}
      </div>
    )
  }

  const renderBoardSection = (section: (typeof taskSections)[number]) => {
    const isExpanded = expandedSections[section.id]
    const isActiveDropTarget = Boolean(draggedTaskId)

    return (
      <div
        key={section.id}
        className={cn(BOARD_COLUMN_CLASS, isActiveDropTarget && "border-cyan-500/50 bg-slate-800/50")}
      >
        <button
          type="button"
          onClick={() => toggleSection(section.id)}
          className={cn(
            "mb-3 flex w-full shrink-0 items-center justify-between px-0 py-0 text-left",
            isActiveDropTarget && "pointer-events-none",
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
            )}
            <h3 className="truncate font-mono font-semibold text-slate-200">{section.name}</h3>
          </div>
          <span className="shrink-0 rounded bg-slate-700/50 px-2 py-1 text-xs text-slate-400">
            {section.tasks.length}
          </span>
        </button>

        {isExpanded ? (
          <div
            onDragEnter={handleDragOver}
            onDragOver={handleDragOver}
            onDrop={(event) => void handleDrop(event, section.status)}
            className={BOARD_TASKS_SCROLL_CLASS}
          >
            {section.tasks.map((task) => (
              <DetailBoardCard
                key={task.id}
                task={task}
                isDragging={draggedTaskId === task.id}
                isDragActive={isActiveDropTarget}
                onEdit={openEdit}
                onDelete={setTaskToDelete}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
            {draggedTaskId && section.tasks.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-cyan-500/30 p-6 text-center">
                <p className="font-mono text-sm text-slate-400">Drop task here</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div
            onDragEnter={handleDragOver}
            onDragOver={handleDragOver}
            onDrop={(event) => void handleDrop(event, section.status)}
            className="min-h-[80px] flex-1"
          />
        )}
      </div>
    )
  }

  const hasTasks = tasks.length > 0

  const isBoardView = activeView === "board"

  return (
    <Wrapper className="h-full min-h-0 overflow-hidden">
      <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden">
        <div className="shrink-0">
          {header}
          <NavigationTabs activeTab={currentView} onTabChange={setCurrentView} />
        </div>

        <div
          className={cn(
            "min-h-0 flex-1",
            isBoardView ? "overflow-hidden" : "overflow-y-auto overscroll-y-contain scrollbar-thin",
          )}
        >
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
                  {taskSections.map(renderListSection)}
                </div>
              ) : (
                <div className="py-12 text-center font-mono text-sm text-slate-400">
                  No tasks yet. Create one to get started.
                </div>
              )}
            </TabsContent>

            <TabsContent value="board" className="mt-0 overflow-hidden p-6">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-[70vh] max-h-[720px] min-h-[320px] w-full bg-slate-900/50" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-4">
                  {taskSections.map(renderBoardSection)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="calendar" className="mt-0 p-6 pb-10">
              {isLoading ? (
                <Skeleton className="h-[640px] w-full bg-slate-900/50" />
              ) : (
                <TaskCalendarView tasks={tasks} onEditTask={openEdit} />
              )}
            </TabsContent>

            <TabsContent value="dashboard" className="mt-0 p-6 pb-10">
              <Card className="border-slate-600/30 bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="mb-6 font-mono text-xl font-semibold text-slate-200">Task Dashboard</h3>
                  <TaskDashboardChart sections={taskSections} totalTasks={tasks.length} />
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
