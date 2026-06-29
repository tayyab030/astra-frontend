"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TaskItem } from "@/lib/api/tasks"

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const
const WEEKDAY_MINI = ["S", "M", "T", "W", "T", "F", "S"] as const

const MONTH_DAY_CLASS = "min-h-[150px] border border-slate-700/30 p-2"
const WEEK_DAY_CLASS = "min-h-[480px] border border-slate-700/30 px-3 py-4"
const YEAR_DAY_CLASS = "min-h-[52px] border border-slate-700/20 p-0.5"

const VISIBLE_TASKS_MONTH = 4
const VISIBLE_TASKS_YEAR = 3

type CalendarViewMode = "month" | "week" | "year"

function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function getFirstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

function toLocalDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getWeekDays(date: Date) {
  const startOfWeek = new Date(date)
  const day = startOfWeek.getDay()
  startOfWeek.setDate(startOfWeek.getDate() - day)

  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(startOfWeek)
    next.setDate(startOfWeek.getDate() + index)
    return next
  })
}

function getPriorityColor(priority: string, completed?: boolean) {
  if (completed) {
    return "bg-emerald-500/25 text-emerald-200/90"
  }

  switch (priority) {
    case "high":
      return "bg-red-500/30 text-red-200"
    case "medium":
      return "bg-yellow-500/30 text-yellow-200"
    case "low":
      return "bg-green-500/30 text-green-200"
    default:
      return "bg-slate-500/30 text-slate-200"
  }
}

function isTaskCompleted(task: TaskItem) {
  return task.completed || task.status === "done"
}

function normalizeDueDate(value: string | null) {
  if (!value) return null
  return value.slice(0, 10)
}

function sortTasksForCalendar(tasks: TaskItem[]) {
  return [...tasks].sort((a, b) => {
    const aCompleted = isTaskCompleted(a)
    const bCompleted = isTaskCompleted(b)
    if (aCompleted !== bCompleted) return aCompleted ? 1 : -1
    return a.title.localeCompare(b.title)
  })
}

function getVisibleTasks(tasks: TaskItem[], limit: number) {
  const sorted = sortTasksForCalendar(tasks)
  const pending = sorted.filter((task) => !isTaskCompleted(task))
  const completed = sorted.filter((task) => isTaskCompleted(task))

  if (completed.length === 0) {
    return {
      visible: pending.slice(0, limit),
      overflow: Math.max(0, pending.length - limit),
    }
  }

  if (pending.length === 0) {
    return {
      visible: completed.slice(0, limit),
      overflow: Math.max(0, completed.length - limit),
    }
  }

  const completedSlots = Math.min(completed.length, Math.max(1, Math.ceil(limit / 3)))
  const pendingSlots = Math.max(1, limit - completedSlots)
  const visible = [
    ...pending.slice(0, pendingSlots),
    ...completed.slice(0, completedSlots),
  ].slice(0, limit)

  return {
    visible,
    overflow: Math.max(0, tasks.length - visible.length),
  }
}

function getCalendarTitle(view: CalendarViewMode, date: Date) {
  if (view === "year") {
    return String(date.getFullYear())
  }

  if (view === "week") {
    const weekDays = getWeekDays(date)
    const start = weekDays[0]
    const end = weekDays[6]
    const sameMonth = start.getMonth() === end.getMonth()
    const startLabel = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    const endLabel = end.toLocaleDateString("en-US", {
      month: sameMonth ? undefined : "short",
      day: "numeric",
      year: "numeric",
    })
    return `${startLabel} – ${endLabel}`
  }

  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

interface TaskCalendarViewProps {
  tasks: TaskItem[]
  onEditTask: (task: TaskItem) => void
}

interface TaskChipProps {
  task: TaskItem
  onEdit: (task: TaskItem) => void
  compact?: boolean
  className?: string
}

function TaskChip({ task, onEdit, compact, className }: TaskChipProps) {
  const maxLength = compact ? 12 : 22
  const completed = isTaskCompleted(task)

  return (
    <button
      type="button"
      onClick={() => onEdit(task)}
      title={completed ? `${task.title} (completed)` : task.title}
      className={cn(
        "w-full truncate rounded px-1.5 py-0.5 text-left font-mono transition-opacity hover:opacity-80",
        compact ? "text-[10px] leading-tight" : "text-xs",
        getPriorityColor(task.priority, completed),
        completed && "line-through decoration-emerald-300/70",
        className,
      )}
    >
      {task.title.length > maxLength ? `${task.title.slice(0, maxLength)}…` : task.title}
    </button>
  )
}

function TaskOverflow({ count }: { count: number }) {
  if (count <= 0) return null
  return <div className="font-mono text-[10px] text-slate-400">+{count}</div>
}

function DayTaskList({
  tasks,
  limit,
  onEditTask,
  compact,
}: {
  tasks: TaskItem[]
  limit?: number
  onEditTask: (task: TaskItem) => void
  compact?: boolean
}) {
  const { visible, overflow } = getVisibleTasks(tasks, limit ?? tasks.length)

  return (
    <div className={cn("space-y-1", compact && "space-y-0.5")}>
      {visible.map((task) => (
        <TaskChip key={task.id} task={task} onEdit={onEditTask} compact={compact} />
      ))}
      <TaskOverflow count={overflow} />
    </div>
  )
}

export default function TaskCalendarView({ tasks, onEditTask }: TaskCalendarViewProps) {
  const [calendarView, setCalendarView] = useState<CalendarViewMode>("month")
  const [currentDate, setCurrentDate] = useState(new Date())

  const today = new Date()

  const getTasksForDate = (date: Date) => {
    const dateStr = toLocalDateString(date)
    return tasks.filter((task) => normalizeDueDate(task.due_date) === dateStr)
  }

  const navigateCalendar = (direction: "prev" | "next") => {
    const next = new Date(currentDate)
    if (calendarView === "month") {
      next.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    } else if (calendarView === "week") {
      next.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      next.setFullYear(currentDate.getFullYear() + (direction === "next" ? 1 : -1))
    }
    setCurrentDate(next)
  }

  const renderDayHeader = () => (
    <div className="grid grid-cols-7 gap-0">
      {WEEKDAY_LABELS.map((day) => (
        <div
          key={day}
          className="flex h-10 items-center justify-center border border-slate-700/30 bg-slate-800/50"
        >
          <span className="font-mono text-sm text-slate-300">{day}</span>
        </div>
      ))}
    </div>
  )

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const cells = []

    for (let index = 0; index < firstDay; index++) {
      cells.push(<div key={`empty-${index}`} className={MONTH_DAY_CLASS} />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const tasksForDay = getTasksForDate(date)
      const isToday = isSameDay(date, today)

      cells.push(
        <div
          key={day}
          className={cn(
            MONTH_DAY_CLASS,
            isToday ? "border-cyan-500/30 bg-cyan-500/10" : "hover:bg-slate-800/30",
          )}
        >
          <div
            className={cn(
              "mb-2 font-mono text-sm font-medium",
              isToday ? "text-cyan-300" : "text-slate-300",
            )}
          >
            {day}
          </div>
          <DayTaskList
            tasks={tasksForDay}
            limit={VISIBLE_TASKS_MONTH}
            onEditTask={onEditTask}
          />
        </div>,
      )
    }

    return (
      <div>
        {renderDayHeader()}
        <div className="grid grid-cols-7 gap-0">{cells}</div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate)

    return (
      <div>
        {renderDayHeader()}
        <div className="grid grid-cols-7 gap-0">
          {weekDays.map((date) => {
            const tasksForDay = getTasksForDate(date)
            const isToday = isSameDay(date, today)

            return (
              <div
                key={toLocalDateString(date)}
                className={cn(
                  WEEK_DAY_CLASS,
                  isToday ? "border-cyan-500/30 bg-cyan-500/10" : "hover:bg-slate-800/30",
                )}
              >
                <div
                  className={cn(
                    "mb-2 font-mono text-sm font-medium",
                    isToday ? "text-cyan-300" : "text-slate-300",
                  )}
                >
                  {date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
                </div>
                <div className="max-h-[420px] space-y-2 overflow-y-auto overscroll-y-contain pr-1 scrollbar-thin">
                  {tasksForDay.length === 0 ? (
                    <p className="font-mono text-xs text-slate-500">No tasks</p>
                  ) : (
                    sortTasksForCalendar(tasksForDay).map((task) => {
                      const completed = isTaskCompleted(task)

                      return (
                      <Card
                        key={task.id}
                        className={cn(
                          "cursor-pointer overflow-hidden border-slate-600/30 bg-slate-900/50 backdrop-blur-sm transition-colors hover:border-cyan-500/30",
                          completed && "border-emerald-500/30 bg-emerald-500/10",
                        )}
                        onClick={() => onEditTask(task)}
                      >
                        <CardContent className="min-w-0 p-2">
                          <div className="flex min-w-0 items-start gap-2">
                            <div
                              className={cn(
                                "mt-1 h-2 w-2 shrink-0 rounded-full",
                                completed
                                  ? "bg-emerald-500"
                                  : task.priority === "high"
                                    ? "bg-red-500"
                                    : task.priority === "medium"
                                      ? "bg-yellow-500"
                                      : task.priority === "low"
                                        ? "bg-green-500"
                                        : "bg-gray-500",
                              )}
                            />
                            <span
                              title={task.title}
                              className={cn(
                                "min-w-0 flex-1 truncate font-mono text-xs text-slate-200",
                                completed && "text-emerald-200/80 line-through",
                              )}
                            >
                              {task.title}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderYearView = () => {
    const year = currentDate.getFullYear()
    const months = Array.from({ length: 12 }, (_, month) => {
      const monthDate = new Date(year, month, 1)
      const daysInMonth = getDaysInMonth(monthDate)
      const firstDay = getFirstDayOfMonth(monthDate)
      const isCurrentMonth =
        month === today.getMonth() && year === today.getFullYear()

      const dayCells = []

      for (let index = 0; index < firstDay; index++) {
        dayCells.push(<div key={`empty-${index}`} className={YEAR_DAY_CLASS} />)
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const tasksForDay = getTasksForDate(date)
        const isToday = isSameDay(date, today)

        dayCells.push(
          <div
            key={day}
            className={cn(
              YEAR_DAY_CLASS,
              isToday ? "border-cyan-500/40 bg-cyan-500/10" : "hover:bg-slate-800/40",
            )}
          >
            <div
              className={cn(
                "mb-0.5 text-center font-mono text-[10px] font-medium",
                isToday ? "text-cyan-300" : "text-slate-400",
              )}
            >
              {day}
            </div>
            <DayTaskList
              tasks={tasksForDay}
              limit={VISIBLE_TASKS_YEAR}
              onEditTask={onEditTask}
              compact
            />
          </div>,
        )
      }

      const tasksInMonth = tasks.filter((task) => {
        const dueDate = normalizeDueDate(task.due_date)
        if (!dueDate) return false
        const [taskYear, taskMonth] = dueDate.split("-").map(Number)
        return taskYear === year && taskMonth === month + 1
      }).length

      return (
        <button
          key={month}
          type="button"
          onClick={() => {
            setCurrentDate(new Date(year, month, 1))
            setCalendarView("month")
          }}
          className={cn(
            "rounded-lg border border-slate-700/30 p-3 text-left backdrop-blur-sm transition-all duration-200",
            isCurrentMonth
              ? "border-cyan-500/30 bg-cyan-500/10"
              : "bg-slate-900/30 hover:bg-slate-800/50",
          )}
        >
          <div
            className={cn(
              "mb-2 font-mono text-sm font-semibold",
              isCurrentMonth ? "text-cyan-300" : "text-slate-300",
            )}
          >
            {monthDate.toLocaleDateString("en-US", { month: "long" })}
          </div>

          <div className="grid grid-cols-7 gap-px">
            {WEEKDAY_MINI.map((label, index) => (
              <div
                key={`${month}-${label}-${index}`}
                className="flex h-4 items-center justify-center font-mono text-[10px] text-slate-500"
              >
                {label}
              </div>
            ))}
            {dayCells}
          </div>

          {tasksInMonth > 0 ? (
            <div className="mt-2 flex justify-center">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                {tasksInMonth} tasks
              </span>
            </div>
          ) : null}
        </button>
      )
    })

    return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{months}</div>
  }

  return (
    <Card className="border-slate-600/30 bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm">
      <CardContent className={cn("px-6", calendarView === "week" ? "py-4" : "p-6")}>
        <div
          className={cn(
            "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
            calendarView === "week" ? "mb-4" : "mb-6",
          )}
        >
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-mono text-xl font-semibold text-slate-200">
              {getCalendarTitle(calendarView, currentDate)}
            </h3>
            <div className="flex items-center gap-2">
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
                onClick={() => {
                  setCurrentDate(new Date())
                }}
                className="border-slate-600/50 bg-transparent font-mono text-xs text-slate-300 hover:bg-slate-800/50"
              >
                Today
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

          <div className="flex items-center gap-2">
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

        {calendarView === "month" && renderMonthView()}
        {calendarView === "week" && renderWeekView()}
        {calendarView === "year" && renderYearView()}
      </CardContent>
    </Card>
  )
}
