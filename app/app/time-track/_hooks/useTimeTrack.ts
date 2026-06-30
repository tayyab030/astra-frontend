"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MOCK_AVAILABLE_TASKS, MOCK_TIME_ENTRIES } from "../_data/mockData"
import type {
  ActiveTimerState,
  AvailableTask,
  DateRangeFilter,
  TimeEntry,
  TimeTrackPersistedState,
  TrackedTask,
  WeeklyTarget,
} from "../_types/timeTrack.types"
import { DEFAULT_WEEKLY_TARGET_HOURS, STORAGE_KEY } from "../_constants/config"
import {
  filterEntriesByDateRange,
  getCurrentWeekRange,
  getInitialDateRange,
  getTodayString,
  updateDateRangePreset,
} from "../_utils/dateRange"

const DEFAULT_TIMER: ActiveTimerState = {
  taskId: null,
  status: "idle",
  elapsedSeconds: 0,
  sessionStartTime: null,
}

function loadPersistedState(): Partial<TimeTrackPersistedState> | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Partial<TimeTrackPersistedState>
  } catch {
    return null
  }
}

function mergeEntries(persisted: TimeEntry[], seed: TimeEntry[]): TimeEntry[] {
  const map = new Map<string, TimeEntry>()
  for (const entry of seed) map.set(entry.id, entry)
  for (const entry of persisted) map.set(entry.id, entry)
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  )
}

function normalizePersistedState(
  persisted: Partial<TimeTrackPersistedState> | null
): TimeTrackPersistedState {
  const activeTimer = persisted?.activeTimer ?? DEFAULT_TIMER

  return {
    trackedTasks: Array.isArray(persisted?.trackedTasks) ? persisted.trackedTasks : [],
    entries: mergeEntries(
      Array.isArray(persisted?.entries) ? persisted.entries : [],
      MOCK_TIME_ENTRIES
    ),
    activeTimer: {
      ...DEFAULT_TIMER,
      ...activeTimer,
      status: "idle",
      elapsedSeconds: 0,
      sessionStartTime: null,
    },
    weeklyTarget: {
      hoursPerWeek:
        persisted?.weeklyTarget?.hoursPerWeek ?? DEFAULT_WEEKLY_TARGET_HOURS,
    },
  }
}

const DEFAULT_STATE: TimeTrackPersistedState = {
  trackedTasks: [],
  entries: MOCK_TIME_ENTRIES,
  activeTimer: DEFAULT_TIMER,
  weeklyTarget: { hoursPerWeek: DEFAULT_WEEKLY_TARGET_HOURS },
}

export function useTimeTrack() {
  const [trackedTasks, setTrackedTasks] = useState<TrackedTask[]>(DEFAULT_STATE.trackedTasks)
  const [entries, setEntries] = useState<TimeEntry[]>(DEFAULT_STATE.entries)
  const [activeTimer, setActiveTimer] = useState<ActiveTimerState>(DEFAULT_STATE.activeTimer)
  const [weeklyTarget, setWeeklyTarget] = useState<WeeklyTarget>(DEFAULT_STATE.weeklyTarget)
  const [dateRange, setDateRange] = useState<DateRangeFilter>(getInitialDateRange)
  const [reportsSearch, setReportsSearch] = useState("")
  const [isHydrated, setIsHydrated] = useState(false)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const today = getTodayString()

  useEffect(() => {
    const state = normalizePersistedState(loadPersistedState())
    setTrackedTasks(state.trackedTasks)
    setEntries(state.entries)
    setActiveTimer(state.activeTimer)
    setWeeklyTarget(state.weeklyTarget)
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    const state: TimeTrackPersistedState = {
      trackedTasks,
      entries,
      activeTimer,
      weeklyTarget,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [trackedTasks, entries, activeTimer, weeklyTarget, isHydrated])

  useEffect(() => {
    if (activeTimer.status === "running") {
      tickRef.current = setInterval(() => {
        setActiveTimer((prev) => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }))
      }, 1000)
    } else if (tickRef.current) {
      clearInterval(tickRef.current)
      tickRef.current = null
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [activeTimer.status])

  const activeTask = useMemo(() => {
    if (activeTimer.taskId) {
      return trackedTasks.find((t) => t.taskId === activeTimer.taskId) ?? null
    }
    return trackedTasks.find((t) => t.isActive) ?? null
  }, [trackedTasks, activeTimer.taskId])

  const todayTotalSeconds = useMemo(() => {
    const fromTracked = trackedTasks.reduce((sum, t) => sum + t.totalSecondsToday, 0)
    const activeExtra = activeTimer.status === "running" ? activeTimer.elapsedSeconds : 0
    return fromTracked + activeExtra
  }, [trackedTasks, activeTimer])

  const entriesInDateRange = useMemo(
    () =>
      filterEntriesByDateRange(entries, dateRange).sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      ),
    [entries, dateRange]
  )

  const filteredEntries = useMemo(() => {
    if (!reportsSearch.trim()) return entriesInDateRange
    const query = reportsSearch.toLowerCase()
    return entriesInDateRange.filter((e) => e.taskTitle.toLowerCase().includes(query))
  }, [entriesInDateRange, reportsSearch])

  const weekRange = getCurrentWeekRange()
  const weekEntries = useMemo(
    () => filterEntriesByDateRange(entries, { preset: "week", ...weekRange }),
    [entries, weekRange.startDate, weekRange.endDate]
  )

  const weekTotalSeconds = weekEntries.reduce((sum, e) => sum + e.durationSeconds, 0)

  const addTrackedTask = useCallback((task: AvailableTask) => {
    setTrackedTasks((prev) => {
      if (prev.some((t) => t.taskId === task.id)) return prev
      const hasSelection = prev.some((t) => t.isActive) || activeTimer.taskId
      const newTask: TrackedTask = {
        taskId: task.id,
        title: task.title,
        projectTitle: task.project_title,
        totalSecondsToday: 0,
        isActive: !hasSelection,
      }
      return [...prev, newTask]
    })

    setActiveTimer((prev) => {
      if (prev.taskId) return prev
      return { ...DEFAULT_TIMER, taskId: task.id }
    })
  }, [activeTimer.taskId])

  const removeTrackedTask = useCallback(
    (taskId: string) => {
      if (activeTimer.taskId === taskId && activeTimer.status === "running") {
        setActiveTimer(DEFAULT_TIMER)
      }
      setTrackedTasks((prev) => prev.filter((t) => t.taskId !== taskId))
    },
    [activeTimer]
  )

  const saveSession = useCallback(
    (taskId: string, taskTitle: string, durationSeconds: number, sessionStart: string) => {
      if (durationSeconds <= 0) return
      const now = new Date()
      const entry: TimeEntry = {
        id: `entry-${Date.now()}`,
        taskId,
        taskTitle,
        date: today,
        startTime: sessionStart,
        endTime: now.toISOString(),
        durationSeconds,
      }
      setEntries((prev) => [entry, ...prev])
    },
    [today]
  )

  const startTimer = useCallback(
    (taskId: string) => {
      const task = trackedTasks.find((t) => t.taskId === taskId)
      if (!task) return

      if (activeTimer.status === "running" && activeTimer.taskId && activeTimer.taskId !== taskId) {
        const prevTask = trackedTasks.find((t) => t.taskId === activeTimer.taskId)
        if (prevTask && activeTimer.sessionStartTime) {
          saveSession(prevTask.taskId, prevTask.title, activeTimer.elapsedSeconds, activeTimer.sessionStartTime)
        }
        setTrackedTasks((prev) =>
          prev.map((t) =>
            t.taskId === activeTimer.taskId
              ? { ...t, totalSecondsToday: t.totalSecondsToday + activeTimer.elapsedSeconds, isActive: false }
              : t
          )
        )
      }

      setTrackedTasks((prev) =>
        prev.map((t) => ({
          ...t,
          isActive: t.taskId === taskId,
        }))
      )

      setActiveTimer({
        taskId,
        status: "running",
        elapsedSeconds: 0,
        sessionStartTime: new Date().toISOString(),
      })
    },
    [trackedTasks, activeTimer, saveSession]
  )

  const pauseTimer = useCallback(() => {
    if (!activeTimer.taskId || activeTimer.status !== "running") return
    const task = trackedTasks.find((t) => t.taskId === activeTimer.taskId)
    if (!task) return

    if (activeTimer.sessionStartTime) {
      saveSession(task.taskId, task.title, activeTimer.elapsedSeconds, activeTimer.sessionStartTime)
    }

    setTrackedTasks((prev) =>
      prev.map((t) =>
        t.taskId === activeTimer.taskId
          ? { ...t, totalSecondsToday: t.totalSecondsToday + activeTimer.elapsedSeconds, isActive: false }
          : t
      )
    )
    setActiveTimer(DEFAULT_TIMER)
  }, [activeTimer, trackedTasks, saveSession])

  const stopTimer = useCallback(() => {
    pauseTimer()
  }, [pauseTimer])

  const resumeTimer = useCallback(
    (taskId: string) => {
      startTimer(taskId)
    },
    [startTimer]
  )

  const setDateRangePreset = useCallback((preset: DateRangeFilter["preset"]) => {
    setDateRange((prev) => updateDateRangePreset(preset, prev))
  }, [])

  const setCustomDateRange = useCallback((startDate: string, endDate: string) => {
    setDateRange({ preset: "custom", startDate, endDate })
  }, [])

  const updateWeeklyTarget = useCallback((hours: number) => {
    setWeeklyTarget({ hoursPerWeek: Math.max(1, hours) })
  }, [])

  const availableTasksToAdd = useMemo(
    () => MOCK_AVAILABLE_TASKS.filter((t) => !trackedTasks.some((tt) => tt.taskId === t.id)),
    [trackedTasks]
  )

  const displayClockSeconds = activeTimer.status === "running" ? activeTimer.elapsedSeconds : 0

  return {
    trackedTasks,
    entries,
    activeTimer,
    activeTask,
    weeklyTarget,
    dateRange,
    reportsSearch,
    todayTotalSeconds,
    entriesInDateRange,
    filteredEntries,
    weekEntries,
    weekTotalSeconds,
    weekRange,
    displayClockSeconds,
    availableTasksToAdd,
    addTrackedTask,
    removeTrackedTask,
    startTimer,
    pauseTimer,
    stopTimer,
    resumeTimer,
    setDateRangePreset,
    setCustomDateRange,
    setReportsSearch,
    updateWeeklyTarget,
  }
}

export type UseTimeTrackReturn = ReturnType<typeof useTimeTrack>
