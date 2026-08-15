"use client"

import { useCallback, useMemo, useState } from "react"
import { useOpenActionParam } from "@/hooks/useOpenActionParam"
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Clock,
  Flame,
  LayoutDashboard,
  ListChecks,
  Minus,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ListRowsSkeleton } from "@/components/skeletons"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type {
  Habit,
  HabitCreateMode,
  HabitFrequency,
  HabitMetricType,
  HabitMissBehavior,
  HabitPackItemDraft,
  HabitPriority,
  HabitTimeOfDay,
} from "../_types/habits.types"
import { MISS_BEHAVIOR_OPTIONS, PRIORITY_OPTIONS, TIME_OF_DAY_OPTIONS } from "../_types/habits.types"
import { useHabits } from "../_hooks/useHabits"
import { AiHabitInsights } from "./AiHabitInsights"
import { HabitDateNav } from "./HabitDateNav"
import { HabitScheduleFields, type HabitScheduleValue } from "./HabitScheduleFields"
import { HabitsOverview } from "./HabitsOverview"
import { getLocalDateString } from "../../health/_utils/date"

function defaultSchedule(): HabitScheduleValue {
  return {
    frequency: "daily",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    periodTarget: 3,
    intervalDays: 2,
    startDate: getLocalDateString(),
    endDate: null,
    timeOfDay: "anytime",
    reminderTime: null,
  }
}

function schedulePayload(schedule: HabitScheduleValue) {
  return {
    frequency: schedule.frequency,
    repeat_days: schedule.frequency === "daily" ? schedule.repeatDays : undefined,
    period_target:
      schedule.frequency === "weekly" || schedule.frequency === "monthly"
        ? schedule.periodTarget
        : undefined,
    interval_days: schedule.frequency === "interval" ? schedule.intervalDays : undefined,
    start_date: schedule.startDate,
    end_date: schedule.endDate,
    time_of_day: schedule.timeOfDay,
    reminder_time: schedule.reminderTime,
  }
}

type HabitsTab = "overview" | "habits" | "missed"

function newPackItem(
  name = "",
  priority: HabitPriority = "medium",
  missBehavior: HabitMissBehavior = "carry"
): HabitPackItemDraft {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    priority,
    missBehavior,
  }
}

function unitLabel(habit: Habit) {
  if (habit.unit) return habit.unit
  if (habit.metricType === "duration") return "min"
  if (habit.metricType === "count") return "units"
  return ""
}

function habitOccurrenceDate(habit: Habit, fallback: string) {
  return habit.occurrenceDate || habit.overdueFrom || fallback
}

/** Reason prompt only for overdue / past-day habits — not today or future. */
function shouldPromptDelayReason(habit: Habit, today: string, selectedDate: string) {
  if (habit.isOverdueCarry) return true
  const occurrence = habitOccurrenceDate(habit, selectedDate)
  return occurrence < today
}

function formatCarryLabel(overdueFrom: string, today: string) {
  const yesterday = (() => {
    const [y, m, d] = today.split("-").map(Number)
    const dt = new Date(Date.UTC(y, m - 1, d, 12))
    dt.setUTCDate(dt.getUTCDate() - 1)
    return dt.toISOString().slice(0, 10)
  })()
  if (overdueFrom === yesterday) return "From yesterday"
  const [year, month, day] = overdueFrom.split("-").map(Number)
  const label = new Date(Date.UTC(year, month - 1, day, 12)).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
  return `From ${label}`
}

function formatCannotDoLabel(overdueFrom: string | null | undefined, today: string) {
  if (!overdueFrom) return "Cannot do · you marked this"
  const yesterday = (() => {
    const [y, m, d] = today.split("-").map(Number)
    const dt = new Date(Date.UTC(y, m - 1, d, 12))
    dt.setUTCDate(dt.getUTCDate() - 1)
    return dt.toISOString().slice(0, 10)
  })()
  if (overdueFrom === yesterday) return "Cannot do · yesterday"
  const [year, month, day] = overdueFrom.split("-").map(Number)
  const label = new Date(Date.UTC(year, month - 1, day, 12)).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
  return `Cannot do · ${label}`
}

function priorityBadgeClass(priority: HabitPriority) {
  if (priority === "high") return "border-red-500/50 text-red-700 dark:text-red-300"
  if (priority === "low") return "border-border text-muted-foreground"
  return "border-amber-500/50 text-amber-700 dark:text-amber-300"
}

function habitRowClass(habit: Habit) {
  if (habit.status === "late" || (habit.completed && habit.isLate)) {
    return "border-amber-500/70 bg-amber-500/10"
  }
  if (habit.status === "done" || habit.completed) {
    return "border-emerald-500/70 bg-emerald-500/10 shadow-[0_0_16px_rgba(16,185,129,0.45)]"
  }
  if (habit.cannotDo || habit.isLockedMissed) {
    return "border-amber-500/50 bg-amber-500/5 opacity-80"
  }
  if (habit.isOverdueCarry || habit.status === "missed") {
    return "border-sky-500/50 bg-sky-500/5"
  }
  if (habit.status === "upcoming") {
    return "border-dashed border-border bg-secondary/20"
  }
  return "border-border bg-secondary/30"
}

function HabitRow({

  habit,

  today,

  isSaving,

  onToggle,

  onAdjust,

  onCannotDo,

  onMarkLate,

  onEdit,

  onDelete,

}: {

  habit: Habit

  today: string

  isSaving: boolean

  onToggle: (habit: Habit) => void

  onAdjust: (habit: Habit, direction: -1 | 1) => void

  onCannotDo: (habit: Habit) => void

  onMarkLate: (habit: Habit) => void

  onEdit: (habit: Habit) => void

  onDelete: (id: string) => void

}) {

  const isBoolean = habit.metricType === "boolean" || !habit.metricType

  const progress = habit.target ? Math.min(100, (habit.current / habit.target) * 100) : 0

  const isDone = habit.completed || habit.status === "done" || habit.status === "late"

  const isLate = Boolean(habit.isLate || habit.status === "late")

  const upcoming = habit.status === "upcoming"

  const isCannotDo = Boolean(habit.cannotDo || habit.isLockedMissed)

  const isCarry = Boolean(habit.isOverdueCarry) && !isCannotDo

  const interactive =

    !upcoming &&

    !isCannotDo &&

    (isDone || habit.canComplete !== false || habit.canUndo !== false)



  return (

    <div

      className={cn(

        "flex items-center justify-between gap-3 rounded-lg border p-3 transition-shadow",

        habitRowClass(habit)

      )}

    >

      <div className="flex items-center space-x-3 min-w-0">

        {isBoolean ? (

          <Button

            size="sm"

            variant={isDone ? "default" : "outline"}

            className={

              isDone

                ? isLate

                  ? "shrink-0 bg-amber-600 text-white hover:bg-amber-600"

                  : "shrink-0 bg-emerald-600 text-white hover:bg-emerald-600"

                : "shrink-0 border-border"

            }

            onClick={() => onToggle(habit)}

            disabled={isSaving || !interactive}

            title={isDone ? "Mark incomplete" : "Mark done"}

            aria-label={isDone ? `Mark ${habit.name} incomplete` : `Mark ${habit.name} done`}

          >

            <CheckCircle2 className="h-4 w-4" />

          </Button>

        ) : (

          <div className="flex items-center gap-1 shrink-0">

            <Button

              size="icon"

              variant="outline"

              className="h-8 w-8"

              onClick={() => onAdjust(habit, -1)}

              disabled={isSaving || !interactive || habit.current <= 0}

              title="Decrease / mark incomplete"

              aria-label={`Decrease ${habit.name}`}

            >

              <Minus className="h-3.5 w-3.5" />

            </Button>

            <Button

              size="icon"

              variant="outline"

              className="h-8 w-8"

              onClick={() => onAdjust(habit, 1)}

              disabled={isSaving || !interactive}

              title="Increase progress"

              aria-label={`Increase ${habit.name}`}

            >

              <Plus className="h-3.5 w-3.5" />

            </Button>

          </div>

        )}

        <div className="min-w-0">

          <div className="flex items-center gap-2 flex-wrap">

            <p className="font-medium text-foreground truncate">{habit.name}</p>

            <Badge variant="outline" className={cn("text-[10px] capitalize", priorityBadgeClass(habit.priority))}>

              {habit.priority}

            </Badge>

            <Badge variant="secondary" className="text-[10px]">

              {habit.missBehavior === "reset" ? "Reset" : "Carry"}

            </Badge>

            {isLate && isDone ? (

              <Badge variant="outline" className="text-[10px] border-amber-500/60 text-amber-700 dark:text-amber-300">

                Late

              </Badge>

            ) : null}

            {isCannotDo && !isDone ? (

              <Badge variant="outline" className="text-[10px] border-amber-500/60 text-amber-700 dark:text-amber-300">

                {formatCannotDoLabel(habit.overdueFrom || habit.occurrenceDate, today)}

              </Badge>

            ) : null}

            {isCarry && !isDone ? (

              <Badge variant="outline" className="text-[10px] border-sky-500/60 text-sky-700 dark:text-sky-300">

                {habit.overdueFrom || habit.occurrenceDate

                  ? formatCarryLabel(habit.overdueFrom || habit.occurrenceDate!, today)

                  : "Still open"}

              </Badge>

            ) : null}

          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">

            <Flame className="h-3 w-3 text-orange-500" />

            <span>{habit.streak} day streak</span>

            {habit.reminderTime ? <span>· {habit.reminderTime}</span> : null}

            {habit.groupName ? <span>· {habit.groupName}</span> : null}

          </div>

          {habit.delayReason ? (

            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">

              {isLate || habit.isOverdueCarry ? "Late / overdue: " : "Reason: "}

              {habit.delayReason}

            </p>

          ) : null}

        </div>

      </div>

      <div className="flex items-center gap-1 shrink-0">

        <div className="text-right mr-1 min-w-[4.5rem]">

          <p className="text-sm font-medium text-foreground">

            {isDone

              ? isLate

                ? "Late"

                : "Done"

              : isCannotDo

                ? "Skipped"

                : upcoming

                  ? "Upcoming"

                  : isBoolean

                    ? isCarry

                      ? "Open"

                      : "Due"

                    : `${habit.current}/${habit.target} ${unitLabel(habit)}`}

          </p>

          {isDone && isBoolean ? (

            <p className="text-[10px] text-muted-foreground">Tap to undo</p>

          ) : null}

          {!isBoolean && !isCannotDo ? (

            <Progress value={progress} className="w-16 h-1 mt-1 ml-auto" />

          ) : null}

        </div>

        {!isDone && !upcoming && !isCannotDo ? (

          <Button

            size="icon"

            variant="ghost"

            className="h-8 w-8 text-muted-foreground hover:text-amber-600"

            onClick={() => onMarkLate(habit)}

            disabled={isSaving}

            title="Complete as late"

            aria-label={`Mark ${habit.name} late`}

          >

            <Clock className="h-4 w-4" />

          </Button>

        ) : null}

        {!isDone && !upcoming ? (

          <Button

            size="icon"

            variant="ghost"

            className={cn(

              "h-8 w-8",

              isCannotDo

                ? "text-amber-600 hover:text-amber-700"

                : "text-muted-foreground hover:text-amber-600"

            )}

            onClick={() => onCannotDo(habit)}

            disabled={isSaving}

            title={isCannotDo ? "Allow doing this again" : "Cannot do today"}

            aria-label={

              isCannotDo ? `Reopen ${habit.name}` : `Mark ${habit.name} as cannot do today`

            }

          >

            <Ban className="h-4 w-4" />

          </Button>

        ) : null}

        <Button

          size="icon"

          variant="ghost"

          className="h-8 w-8 text-muted-foreground hover:text-primary"

          onClick={() => onEdit(habit)}

          aria-label={`Edit ${habit.name}`}

        >

          <Pencil className="h-4 w-4" />

        </Button>

        <Button

          size="icon"

          variant="ghost"

          className="h-8 w-8 text-muted-foreground hover:text-destructive"

          onClick={() => onDelete(habit.id)}

          aria-label={`Delete ${habit.name}`}

        >

          <Trash2 className="h-4 w-4" />

        </Button>

      </div>

    </div>

  )

}




export function HabitsContent() {
  const {
    habits,
    dayHabits,
    dayView,
    selectedDate,
    setSelectedDate,
    completedCount,
    highCompleted,
    highTotal,
    longestStreak,
    longestStreakHabitName,
    isLoading,
    isDayLoading,
    isSaving,
    toggleHabit,
    adjustHabit,
    createHabit,
    createPack,
    updateHabit,
    deleteHabit,
  } = useHabits()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<HabitsTab>("habits")
  const [createMode, setCreateMode] = useState<HabitCreateMode>("single")

  const openAddHabit = useCallback(() => {
    setDialogOpen(true)
  }, [])

  useOpenActionParam("add", openAddHabit)
  const [habitName, setHabitName] = useState("")
  const [packName, setPackName] = useState("")
  const [packItems, setPackItems] = useState<HabitPackItemDraft[]>([
    newPackItem(),
    newPackItem(),
  ])
  const [schedule, setSchedule] = useState<HabitScheduleValue>(defaultSchedule)
  const [target, setTarget] = useState("1")
  const [metricType, setMetricType] = useState<HabitMetricType>("boolean")
  const [unit, setUnit] = useState("")
  const [priority, setPriority] = useState<HabitPriority>("medium")
  const [missBehavior, setMissBehavior] = useState<HabitMissBehavior>("carry")

  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [editName, setEditName] = useState("")
  const [editSchedule, setEditSchedule] = useState<HabitScheduleValue>(defaultSchedule)
  const [editTarget, setEditTarget] = useState("1")
  const [editPriority, setEditPriority] = useState<HabitPriority>("medium")
  const [editMissBehavior, setEditMissBehavior] = useState<HabitMissBehavior>("carry")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [delayHabit, setDelayHabit] = useState<Habit | null>(null)
  const [delayPromptMode, setDelayPromptMode] = useState<"overdue" | "late">("overdue")
  const [delayReason, setDelayReason] = useState("")
  const [pendingAdjust, setPendingAdjust] = useState<{
    habit: Habit
    direction: -1 | 1
  } | null>(null)

  const grouped = useMemo(() => {
    const cannotDo = dayHabits.filter((habit) => habit.cannotDo || habit.isLockedMissed)
    const carry = dayHabits.filter(
      (habit) => habit.isOverdueCarry && !(habit.cannotDo || habit.isLockedMissed)
    )
    const scheduled = dayHabits.filter(
      (habit) =>
        !habit.isOverdueCarry && !(habit.cannotDo || habit.isLockedMissed)
    )

    const byTime = new Map<string, Habit[]>()
    for (const option of TIME_OF_DAY_OPTIONS) {
      byTime.set(option.value, [])
    }

    for (const habit of scheduled) {
      const key = (habit.timeOfDay || "anytime") as string
      const list = byTime.get(key) ?? byTime.get("anytime")!
      list.push(habit)
      if (!byTime.has(key)) byTime.set(key, list)
    }

    const sections: { key: string; title: string; habits: Habit[] }[] = []
    if (carry.length) {
      sections.push({
        key: "carry",
        title: "Still open from earlier",
        habits: carry,
      })
    }
    if (cannotDo.length) {
      sections.push({
        key: "cannot-do",
        title: "Cannot do · you decided",
        habits: cannotDo,
      })
    }
    for (const option of TIME_OF_DAY_OPTIONS) {
      const habits = byTime.get(option.value) ?? []
      if (habits.length) {
        sections.push({ key: option.value, title: option.label, habits })
      }
    }
    return sections
  }, [dayHabits])

  const missedStats = useMemo(() => {
    const cannotDo = dayHabits.filter((habit) => habit.cannotDo || habit.isLockedMissed)
    const stillOpen = dayHabits.filter(
      (habit) =>
        (habit.isOverdueCarry || habit.status === "missed") &&
        !(habit.cannotDo || habit.isLockedMissed) &&
        !habit.completed
    )
    const lateDone = dayHabits.filter(
      (habit) =>
        habit.completed &&
        (habit.isLate || habit.status === "late") &&
        !(habit.cannotDo || habit.isLockedMissed)
    )
    const allMissed = [...stillOpen, ...cannotDo]
    const byPriority = {
      high: allMissed.filter((habit) => habit.priority === "high").length,
      medium: allMissed.filter((habit) => habit.priority === "medium").length,
      low: allMissed.filter((habit) => habit.priority === "low").length,
    }
    return {
      stillOpen,
      cannotDo,
      lateDone,
      allMissed,
      total: allMissed.length + lateDone.length,
      stillOpenCount: stillOpen.length,
      cannotDoCount: cannotDo.length,
      lateCount: lateDone.length,
      byPriority,
    }
  }, [dayHabits])

  const resetCreateForm = () => {
    setCreateMode("single")
    setHabitName("")
    setPackName("")
    setPackItems([newPackItem(), newPackItem()])
    setSchedule(defaultSchedule())
    setTarget("1")
    setMetricType("boolean")
    setUnit("")
    setPriority("medium")
    setMissBehavior("carry")
  }

  const validPackItems = packItems.filter((item) => item.name.trim())

  const handleCreate = async () => {
    if (schedule.frequency === "daily" && schedule.repeatDays.length === 0) return
    const timing = schedulePayload(schedule)

    if (createMode === "pack") {
      if (!packName.trim() || validPackItems.length === 0) return
      await createPack({
        name: packName.trim(),
        ...timing,
        items: validPackItems.map((item) => ({
          name: item.name.trim(),
          priority: item.priority,
          miss_behavior: item.missBehavior,
        })),
        miss_behavior: missBehavior,
      })
    } else {
      if (!habitName.trim()) return
      await createHabit({
        name: habitName.trim(),
        ...timing,
        target: metricType === "boolean" ? 1 : Number(target) || 1,
        domain: "custom",
        metric_type: metricType,
        priority,
        miss_behavior: missBehavior,
        unit:
          metricType === "boolean"
            ? null
            : unit.trim() || (metricType === "duration" ? "minutes" : null),
      })
    }
    setDialogOpen(false)
    resetCreateForm()
  }

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setEditName(habit.name)
    setEditSchedule({
      frequency: (habit.frequency === "custom" ? "daily" : habit.frequency) as HabitFrequency,
      repeatDays: habit.repeatDays?.length ? habit.repeatDays : [0, 1, 2, 3, 4, 5, 6],
      periodTarget: habit.periodTarget || 3,
      intervalDays: habit.intervalDays || 2,
      startDate: habit.startDate || getLocalDateString(),
      endDate: habit.endDate,
      timeOfDay: (habit.timeOfDay || "anytime") as HabitTimeOfDay,
      reminderTime: habit.reminderTime,
    })
    setEditTarget(String(habit.target))
    setEditPriority(habit.priority)
    setEditMissBehavior(habit.missBehavior ?? "carry")
  }

  const handleUpdateHabit = async () => {
    if (!editingHabit || !editName.trim() || !editSchedule.startDate) return
    if (editSchedule.frequency === "daily" && editSchedule.repeatDays.length === 0) return
    await updateHabit(editingHabit.id, {
      name: editName.trim(),
      ...schedulePayload(editSchedule),
      target: Number(editTarget) || editingHabit.target,
      priority: editPriority,
      miss_behavior: editMissBehavior,
    })
    setEditingHabit(null)
  }

  const handleDeleteHabit = async () => {
    if (!deleteId) return
    await deleteHabit(deleteId)
    setDeleteId(null)
  }

  const requestToggle = async (habit: Habit) => {
    if ((habit.cannotDo || habit.isLockedMissed) && !(habit.completed || habit.status === "done")) {
      return
    }
    const date = habitOccurrenceDate(habit, selectedDate)
    const isDone = habit.completed || habit.status === "done" || habit.status === "late"
    if (isDone) {
      await toggleHabit(habit.id, { date })
      return
    }
    const today = dayView?.today ?? selectedDate
    if (shouldPromptDelayReason(habit, today, selectedDate)) {
      setDelayHabit(habit)
      setDelayPromptMode("late")
      setPendingAdjust(null)
      setDelayReason(habit.delayReason ?? "")
      return
    }
    await toggleHabit(habit.id, { date })
  }

  const requestAdjust = async (habit: Habit, direction: -1 | 1) => {
    if ((habit.cannotDo || habit.isLockedMissed) && direction > 0) {
      return
    }
    const date = habitOccurrenceDate(habit, selectedDate)
    const isDone = habit.completed || habit.status === "done" || habit.status === "late"
    if (direction < 0 || isDone) {
      await adjustHabit(habit.id, { direction, date })
      return
    }
    const step = habit.metricType === "duration" ? 5 : 1
    const next = Math.max(0, habit.current + direction * step)
    const willComplete = next >= habit.target && !isDone
    const today = dayView?.today ?? selectedDate
    if (willComplete && shouldPromptDelayReason(habit, today, selectedDate)) {
      setDelayHabit(habit)
      setDelayPromptMode("late")
      setPendingAdjust({ habit, direction })
      setDelayReason(habit.delayReason ?? "")
      return
    }
    await adjustHabit(habit.id, { direction, date })
  }

  const requestCannotDo = async (habit: Habit) => {
    const date = habitOccurrenceDate(habit, selectedDate)
    const next = !(habit.cannotDo || habit.isLockedMissed)
    await toggleHabit(habit.id, { date, cannotDo: next })
  }

  const requestMarkLate = (habit: Habit) => {
    setDelayHabit(habit)
    setDelayPromptMode("late")
    setPendingAdjust(null)
    setDelayReason(habit.delayReason ?? "")
  }

  const clearDelayPrompt = () => {
    setDelayHabit(null)
    setPendingAdjust(null)
    setDelayReason("")
    setDelayPromptMode("overdue")
  }

  const renderHabitSections = (
    sections: { key: string; title: string; habits: Habit[] }[]
  ) =>
    sections.map((section) => (
      <Card key={section.key} className="astra-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-primary">
            <span className="flex items-center min-w-0">
              <Flame className="mr-2 h-5 w-5 shrink-0 text-orange-500" />
              <span className="truncate">{section.title}</span>
            </span>
            <Badge variant="secondary" className="shrink-0 tabular-nums">
              {section.habits.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {section.habits.map((habit) => (
            <HabitRow
              key={`${habit.id}-${habit.occurrenceDate ?? selectedDate}-${habit.cannotDo || habit.isLockedMissed ? "skip" : habit.isOverdueCarry ? "carry" : "day"}`}
              habit={habit}
              today={dayView?.today ?? selectedDate}
              isSaving={isSaving}
              onToggle={requestToggle}
              onAdjust={requestAdjust}
              onCannotDo={requestCannotDo}
              onMarkLate={requestMarkLate}
              onEdit={openEdit}
              onDelete={setDeleteId}
            />
          ))}
        </CardContent>
      </Card>
    ))

  const submitDelayReason = async () => {
    if (!delayHabit) return
    const reason = delayReason.trim() || undefined
    const date = habitOccurrenceDate(delayHabit, selectedDate)
    // Late + overdue completions share the same reason and still count toward streak.
    if (pendingAdjust) {
      await adjustHabit(pendingAdjust.habit.id, {
        direction: pendingAdjust.direction,
        delay_reason: reason,
        date,
        is_late: true,
      })
    } else {
      await toggleHabit(delayHabit.id, {
        delayReason: reason,
        date,
        isLate: true,
      })
    }
    clearDelayPrompt()
  }

  const createDisabled =
    isSaving ||
    !schedule.startDate ||
    (schedule.frequency === "daily" && schedule.repeatDays.length === 0) ||
    (createMode === "single" && !habitName.trim()) ||
    (createMode === "single" && metricType !== "boolean" && Number(target) <= 0) ||
    (createMode === "pack" && (!packName.trim() || validPackItems.length === 0)) ||
    Boolean(schedule.endDate && schedule.endDate < schedule.startDate)

  return (
    <div className="astra-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="astra-title">Habits</h1>
          <p className="astra-subtitle mt-1">
            Choose carry-over (missed stays due, late when finished late) or reset (miss breaks
            streak). Priority is high, medium, or low.
          </p>
        </div>
        <Button className="astra-btn-primary" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: "Active Habits",
            value: habits.length,
            subtitle: "tracked routines",
          },
          {
            title: "Missed",
            value: missedStats.total,
            subtitle:
              missedStats.stillOpenCount > 0 || missedStats.lateCount > 0
                ? `${missedStats.stillOpenCount} overdue · ${missedStats.lateCount} late · ${missedStats.cannotDoCount} skipped`
                : missedStats.cannotDoCount > 0
                  ? `${missedStats.cannotDoCount} marked cannot do`
                  : "none for this day",
          },
          {
            title: "High priority",
            value: `${highCompleted}/${highTotal || 0}`,
            subtitle: `${completedCount} total done`,
          },
          {
            title: "Longest Streak",
            value: longestStreak,
            subtitle:
              longestStreak > 0 && longestStreakHabitName
                ? `${longestStreakHabitName} · ${longestStreak} days`
                : "No streak yet",
          },
        ].map((card) => (
          <Card
            key={card.title}
            className={cn(
              "astra-card",
              card.title === "Missed" ? "cursor-pointer transition-colors hover:border-primary/40" : null
            )}
            onClick={card.title === "Missed" ? () => setActiveTab("missed") : undefined}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-primary">{card.value}</div>
                  <p className="text-xs text-muted-foreground truncate" title={String(card.subtitle)}>
                    {card.subtitle}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-1 border-b border-border">
        {(
          [
            { id: "overview", label: "Overview", icon: LayoutDashboard, count: null as number | null },
            { id: "habits", label: "Habits", icon: ListChecks, count: null as number | null },
            {
              id: "missed",
              label: "Missed",
              icon: AlertCircle,
              count: missedStats.total,
            },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-none border-b-2 px-4 ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="mr-2 h-4 w-4" />
              {tab.label}
              {tab.count !== null && tab.count > 0 ? (
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className="ml-2 h-5 min-w-5 justify-center px-1.5 tabular-nums"
                >
                  {tab.count}
                </Badge>
              ) : null}
            </Button>
          )
        })}
      </div>

      {activeTab === "overview" ? (
        <div className="space-y-6">
          <AiHabitInsights />
          <HabitsOverview
            habits={habits}
            completedCount={habits.filter((habit) => habit.completed).length}
            highCompleted={habits.filter((habit) => habit.priority === "high" && habit.completed).length}
            highTotal={habits.filter((habit) => habit.priority === "high").length}
            longestStreak={longestStreak}
            longestStreakHabitName={longestStreakHabitName}
            isLoading={isLoading}
          />
        </div>
      ) : activeTab === "missed" ? (
        <div className="space-y-4">
          <Card className="astra-card">
            <CardContent className="pt-6 space-y-3">
              <HabitDateNav
                date={selectedDate}
                today={dayView?.today}
                relative={dayView?.relative}
                onChange={setSelectedDate}
              />
              <p className="text-xs text-muted-foreground">
                Missed counts for the selected day. Finish still-open habits or mark cannot do.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total", value: missedStats.total },
              { label: "Overdue", value: missedStats.stillOpenCount },
              { label: "Late", value: missedStats.lateCount },
              { label: "Cannot do", value: missedStats.cannotDoCount },
            ].map((card) => (
              <Card key={card.label} className="astra-card">
                <CardContent className="py-4 text-center">
                  <p className="text-xl font-bold text-primary tabular-nums">{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {isDayLoading ? (
            <Card className="astra-card">
              <CardContent className="pt-6 space-y-3">
                <ListRowsSkeleton count={4} />
              </CardContent>
            </Card>
          ) : missedStats.total === 0 ? (
            <Card className="astra-card">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
                <h3 className="text-lg text-foreground mb-2">No missed habits</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Nothing overdue, late, or skipped for this date.
                </p>
              </CardContent>
            </Card>
          ) : (
            renderHabitSections(
              [
                missedStats.stillOpen.length
                  ? {
                      key: "overdue",
                      title: "Overdue · still open",
                      habits: missedStats.stillOpen,
                    }
                  : null,
                missedStats.lateDone.length
                  ? {
                      key: "late",
                      title: "Late · counts in streak",
                      habits: missedStats.lateDone,
                    }
                  : null,
                missedStats.cannotDo.length
                  ? {
                      key: "cannot-do",
                      title: "Cannot do · you decided",
                      habits: missedStats.cannotDo,
                    }
                  : null,
              ].filter(Boolean) as { key: string; title: string; habits: Habit[] }[]
            )
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="astra-card">
            <CardContent className="pt-6 space-y-3">
              <HabitDateNav
                date={selectedDate}
                today={dayView?.today}
                relative={dayView?.relative}
                onChange={setSelectedDate}
              />
              {dayView?.relative === "past" || dayView?.relative === "yesterday" ? (
                <p className="text-xs text-muted-foreground">
                  Past day — you can still mark habits done, or use the ban icon for “cannot do”.
                </p>
              ) : null}
              {(dayView?.relative === "today" || !dayView?.relative) &&
              ((dayView?.summary.overdueCount ?? 0) > 0 ||
                (dayView?.summary.lockedMissedCount ?? 0) > 0) ? (
                <p className="text-xs text-muted-foreground">
                  Carry-over misses stay open with today. Clock icon marks late; ban marks cannot do.
                </p>
              ) : null}
              {dayView?.relative === "future" || dayView?.relative === "tomorrow" ? (
                <p className="text-xs text-muted-foreground">
                  Upcoming day preview — logging opens when the day arrives.
                </p>
              ) : null}
            </CardContent>
          </Card>

          {isDayLoading ? (
            <Card className="astra-card">
              <CardContent className="pt-6">
                <ListRowsSkeleton count={5} />
              </CardContent>
            </Card>
          ) : dayHabits.length === 0 ? (
            <Card className="astra-card">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Flame className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg text-foreground mb-2">Nothing scheduled</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  No habits repeat on this weekday. Create a habit or pick another date.
                </p>
                <Button className="astra-btn-primary" onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Habit
                </Button>
              </CardContent>
            </Card>
          ) : (
            renderHabitSections(grouped)
          )}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetCreateForm()
        }}
      >
        <DialogContent className="astra-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">Add habit</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Daily weekdays, weekly/monthly targets, interval, time of day,
              and optional reminder.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={createMode}
                onValueChange={(value) => setCreateMode(value as HabitCreateMode)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single habit</SelectItem>
                  <SelectItem value="pack">Habit pack (checklist)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {createMode === "pack" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pack-name">Pack name</Label>
                  <Input
                    id="pack-name"
                    placeholder="e.g., Morning routine, Skincare"
                    value={packName}
                    onChange={(e) => setPackName(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Label>Items</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setPackItems((items) => [...items, newPackItem("", "medium", missBehavior)])
                      }
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      Add item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {packItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 rounded-lg border border-border p-2"
                      >
                        <Input
                          placeholder={`Item ${index + 1}`}
                          value={item.name}
                          onChange={(e) =>
                            setPackItems((items) =>
                              items.map((row) =>
                                row.id === item.id ? { ...row, name: e.target.value } : row
                              )
                            )
                          }
                        />
                        <Select
                          value={item.priority}
                          onValueChange={(value) =>
                            setPackItems((items) =>
                              items.map((row) =>
                                row.id === item.id
                                  ? { ...row, priority: value as HabitPriority }
                                  : row
                              )
                            )
                          }
                        >
                          <SelectTrigger className="w-[100px] shrink-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PRIORITY_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={item.missBehavior}
                          onValueChange={(value) =>
                            setPackItems((items) =>
                              items.map((row) =>
                                row.id === item.id
                                  ? { ...row, missBehavior: value as HabitMissBehavior }
                                  : row
                              )
                            )
                          }
                        >
                          <SelectTrigger className="w-[110px] shrink-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MISS_BEHAVIOR_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          disabled={packItems.length <= 1}
                          onClick={() =>
                            setPackItems((items) => items.filter((row) => row.id !== item.id))
                          }
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="habit-name">Habit name</Label>
                  <Input
                    id="habit-name"
                    placeholder="e.g., Drink water, Read 20 pages"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Track as</Label>
                  <Select
                    value={metricType}
                    onValueChange={(value) => {
                      const next = value as HabitMetricType
                      setMetricType(next)
                      if (next === "boolean") setTarget("1")
                      else if (next === "duration") {
                        setTarget("30")
                        setUnit("minutes")
                      } else {
                        setTarget("20")
                        setUnit("")
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boolean">Checkbox (done / not done)</SelectItem>
                      <SelectItem value="count">Count (pages, reps, etc.)</SelectItem>
                      <SelectItem value="duration">Time (minutes)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {metricType !== "boolean" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="custom-target">Daily target</Label>
                      <Input
                        id="custom-target"
                        type="number"
                        min={1}
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-unit">Unit</Label>
                      <Input
                        id="custom-unit"
                        placeholder={metricType === "duration" ? "minutes" : "pages"}
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                      />
                    </div>
                  </div>
                ) : null}
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={priority}
                    onValueChange={(value) => setPriority(value as HabitPriority)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>If missed</Label>
                  <Select
                    value={missBehavior}
                    onValueChange={(value) => setMissBehavior(value as HabitMissBehavior)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MISS_BEHAVIOR_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {MISS_BEHAVIOR_OPTIONS.find((option) => option.value === missBehavior)?.hint}
                  </p>
                </div>
              </>
            )}

            {createMode === "pack" ? (
              <div className="space-y-2">
                <Label>Default if missed</Label>
                <Select
                  value={missBehavior}
                  onValueChange={(value) => setMissBehavior(value as HabitMissBehavior)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MISS_BEHAVIOR_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Used when creating the pack; each item can override it.
                </p>
              </div>
            ) : null}

            <HabitScheduleFields
              value={schedule}
              onChange={(next) => setSchedule((prev) => ({ ...prev, ...next }))}
            />

            <Button
              className="w-full astra-btn-primary"
              onClick={handleCreate}
              disabled={createDisabled}
            >
              {createMode === "pack" ? "Create pack" : "Create habit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingHabit)}
        onOpenChange={(open) => {
          if (!open) setEditingHabit(null)
        }}
      >
        <DialogContent className="astra-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">Edit Habit</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update name, schedule, priority, or miss behavior
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-habit-name">Habit Name</Label>
              <Input
                id="edit-habit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={editPriority}
                onValueChange={(value) => setEditPriority(value as HabitPriority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>If missed</Label>
              <Select
                value={editMissBehavior}
                onValueChange={(value) => setEditMissBehavior(value as HabitMissBehavior)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MISS_BEHAVIOR_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {
                  MISS_BEHAVIOR_OPTIONS.find((option) => option.value === editMissBehavior)
                    ?.hint
                }
              </p>
            </div>
            <HabitScheduleFields
              value={editSchedule}
              onChange={(next) => setEditSchedule((prev) => ({ ...prev, ...next }))}
            />
            {editingHabit && editingHabit.metricType !== "boolean" ? (
              <div className="space-y-2">
                <Label htmlFor="edit-habit-target">
                  Target ({unitLabel(editingHabit) || "units"})
                </Label>
                <Input
                  id="edit-habit-target"
                  type="number"
                  min={1}
                  value={editTarget}
                  onChange={(e) => setEditTarget(e.target.value)}
                />
              </div>
            ) : null}
            <Button
              className="w-full astra-btn-primary"
              onClick={handleUpdateHabit}
              disabled={
                !editName.trim() ||
                !editSchedule.startDate ||
                isSaving ||
                (editSchedule.frequency === "daily" && editSchedule.repeatDays.length === 0) ||
                Boolean(
                  editSchedule.endDate && editSchedule.endDate < editSchedule.startDate
                )
              }
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(delayHabit)}
        onOpenChange={(open) => {
          if (!open) clearDelayPrompt()
        }}
      >
        <DialogContent className="astra-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">
              Why late / overdue? (optional)
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {delayHabit
                ? delayHabit.isOverdueCarry ||
                  shouldPromptDelayReason(
                    delayHabit,
                    dayView?.today ?? selectedDate,
                    selectedDate
                  )
                  ? `"${delayHabit.name}" is overdue. Say how or why it was late — it still counts in your streak.`
                  : `"${delayHabit.name}" will be marked late. Say how or why — it still counts in your streak.`
                : "Say how or why it was late. Late and overdue completions still count in your streak."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="late-reason">How is it late?</Label>
              <Textarea
                id="late-reason"
                placeholder="e.g., Started after planned time, got interrupted, finished next morning…"
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                rows={4}
              />
            </div>
            <Button
              className="w-full astra-btn-primary"
              onClick={submitDelayReason}
              disabled={isSaving}
            >
              Mark as late
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="astra-card border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete habit?</AlertDialogTitle>
            <AlertDialogDescription>
              This habit and its streak will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteHabit}
              disabled={isSaving}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
