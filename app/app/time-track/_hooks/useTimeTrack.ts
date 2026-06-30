"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  addTrackedTask as addTrackedTaskApi,
  createTimeEntry,
  createTimeEntryKeepalive,
  fetchTimeTrackDashboard,
  getTimeTrackErrorMessage,
  mapTaskItemToAvailableTask,
  removeTrackedTask as removeTrackedTaskApi,
  deleteTimeEntry,
  updateTimeTrackSettings,
} from "@/lib/api/timeTrack"
import { fetchTasks } from "@/lib/api/tasks"
import { store } from "@/store/store"
import type {
  ActiveTimerState,
  AvailableTask,
  DateRangeFilter,
  TimeTrackSettings,
  TrackedTask,
} from "../_types/timeTrack.types"
import { DEFAULT_WEEKLY_TARGET_HOURS, TIMER_AUTO_SAVE_SECONDS } from "../_constants/config"
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

const DEFAULT_SETTINGS: TimeTrackSettings = {
  hoursPerWeek: DEFAULT_WEEKLY_TARGET_HOURS,
  activityBarVisible: true,
  lastSelectedTaskId: null,
}

function resolveTrackedTask(
  taskId: string,
  trackedTasks: TrackedTask[],
  allTasks: ReturnType<typeof mapTaskItemToAvailableTask>[] | undefined
): TrackedTask | null {
  const tracked = trackedTasks.find((t) => t.taskId === taskId)
  if (tracked) return tracked

  const task = allTasks?.find((t) => t.id === taskId)
  if (!task) return null

  return {
    taskId: task.id,
    title: task.title,
    projectTitle: task.project_title,
    totalSecondsToday: 0,
    isActive: false,
  }
}

export function useTimeTrack() {
  const queryClient = useQueryClient()
  const [activeTimer, setActiveTimer] = useState<ActiveTimerState>(DEFAULT_TIMER)
  const [dateRange, setDateRange] = useState<DateRangeFilter>(getInitialDateRange)
  const [reportsSearch, setReportsSearch] = useState("")
  const hasRestoredSelection = useRef(false)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const activeTimerRef = useRef(activeTimer)
  const isFlushingRef = useRef(false)
  const isSavingEntryRef = useRef(false)
  const flushRunningSessionRef = useRef<(() => Promise<void>) | null>(null)
  /** Saved + server total at session start, plus flushed chunks — keeps clock continuous across autosave */
  const runningDisplayBaseRef = useRef(0)
  const runningDisplayTaskIdRef = useRef<string | null>(null)
  const invalidateDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const today = getTodayString()
  const weekRange = getCurrentWeekRange()

  const invalidateTimeTrack = useCallback(async () => {
    await queryClient.refetchQueries({
      queryKey: ["time-track"],
      type: "all",
    })
  }, [queryClient])

  const scheduleInvalidateTimeTrack = useCallback(() => {
    if (invalidateDebounceRef.current) {
      clearTimeout(invalidateDebounceRef.current)
    }
    invalidateDebounceRef.current = setTimeout(() => {
      void invalidateTimeTrack()
    }, 300)
  }, [invalidateTimeTrack])

  const dashboardQuery = useQuery({
    queryKey: [
      "time-track",
      "dashboard",
      dateRange.startDate,
      dateRange.endDate,
      reportsSearch,
    ],
    queryFn: () =>
      fetchTimeTrackDashboard({
        start_date: dateRange.startDate,
        end_date: dateRange.endDate,
        ...(reportsSearch.trim() ? { search: reportsSearch.trim() } : {}),
      }),
  })

  const weekQuery = useQuery({
    queryKey: ["time-track", "week", weekRange.startDate, weekRange.endDate],
    queryFn: () =>
      fetchTimeTrackDashboard({
        start_date: weekRange.startDate,
        end_date: weekRange.endDate,
      }),
  })

  const tasksQuery = useQuery({
    queryKey: ["tasks", "all", "time-track-picker"],
    queryFn: () => fetchTasks({ filter: "all" }),
  })

  const trackedTasks = dashboardQuery.data?.trackedTasks ?? []
  const entries = dashboardQuery.data?.entries ?? []
  const settings: TimeTrackSettings = dashboardQuery.data?.settings ?? DEFAULT_SETTINGS
  const weeklyTarget = { hoursPerWeek: settings.hoursPerWeek }

  const weekEntries = useMemo(
    () => weekQuery.data?.entries ?? [],
    [weekQuery.data?.entries]
  )

  const weekTotalSeconds = weekEntries.reduce((sum, e) => sum + e.durationSeconds, 0)

  const allTasksForPicker = useMemo(
    () => tasksQuery.data?.tasks.map(mapTaskItemToAvailableTask) ?? [],
    [tasksQuery.data?.tasks]
  )

  const [isSavingEntry, setIsSavingEntry] = useState(false)

  const addTrackedTaskMutation = useMutation({
    mutationFn: addTrackedTaskApi,
    onSuccess: () => {
      invalidateTimeTrack()
      toast.success("Task added to today")
    },
    onError: (error) => {
      toast.error(getTimeTrackErrorMessage(error, "Failed to add task"))
    },
  })

  const removeTrackedTaskMutation = useMutation({
    mutationFn: (taskId: string) => removeTrackedTaskApi(taskId, today),
    onSuccess: async () => {
      await invalidateTimeTrack()
      toast.success("Task and today's time records deleted")
    },
    onError: (error) => {
      toast.error(getTimeTrackErrorMessage(error, "Failed to remove task"))
    },
  })

  const deleteEntryMutation = useMutation({
    mutationFn: deleteTimeEntry,
    onSuccess: async () => {
      await invalidateTimeTrack()
      toast.success("Time record deleted")
    },
    onError: (error) => {
      toast.error(getTimeTrackErrorMessage(error, "Failed to delete time record"))
    },
  })

  const updateSettingsMutation = useMutation({
    mutationFn: updateTimeTrackSettings,
    onSuccess: () => invalidateTimeTrack(),
    onError: (error) => {
      toast.error(getTimeTrackErrorMessage(error, "Failed to update settings"))
    },
  })

  const persistSelectedTask = useCallback(
    (taskId: string | null) => {
      updateSettingsMutation.mutate({ last_selected_task_id: taskId })
    },
    [updateSettingsMutation]
  )

  useEffect(() => {
    activeTimerRef.current = activeTimer
  }, [activeTimer])

  useEffect(() => {
    if (hasRestoredSelection.current || !dashboardQuery.data) return

    const lastTaskId = dashboardQuery.data.settings.lastSelectedTaskId
    if (lastTaskId) {
      setActiveTimer((prev) => {
        if (prev.taskId) return prev
        return {
          ...DEFAULT_TIMER,
          taskId: lastTaskId,
          status: "paused",
        }
      })
    }

    hasRestoredSelection.current = true
  }, [dashboardQuery.data])

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

  const saveSession = useCallback(
    async (taskId: string, durationSeconds: number, sessionStart: string) => {
      if (durationSeconds <= 0) return
      isSavingEntryRef.current = true
      setIsSavingEntry(true)
      try {
        await createTimeEntry({
          task_id: taskId,
          duration_seconds: durationSeconds,
          start_time: sessionStart,
          end_time: new Date().toISOString(),
          entry_date: today,
        })
        scheduleInvalidateTimeTrack()
      } catch (error) {
        toast.error(getTimeTrackErrorMessage(error, "Failed to save time entry"))
        throw error
      } finally {
        isSavingEntryRef.current = false
        setIsSavingEntry(false)
      }
    },
    [today, scheduleInvalidateTimeTrack]
  )

  const flushRunningSession = useCallback(async () => {
    if (isFlushingRef.current) return

    const timer = activeTimerRef.current
    if (timer.status !== "running" || !timer.taskId || !timer.sessionStartTime) return
    if (timer.elapsedSeconds <= 0) return

    const { taskId, elapsedSeconds, sessionStartTime } = timer

    isFlushingRef.current = true
    try {
      await saveSession(taskId, elapsedSeconds, sessionStartTime)
      if (runningDisplayTaskIdRef.current === taskId) {
        runningDisplayBaseRef.current += elapsedSeconds
      }
      setActiveTimer((prev) => {
        if (prev.status !== "running" || prev.taskId !== taskId) return prev
        return {
          ...prev,
          elapsedSeconds: 0,
          sessionStartTime: new Date().toISOString(),
        }
      })
    } catch {
      // Error toast is handled by callers that need it; autosave retries on next interval
    } finally {
      isFlushingRef.current = false
    }
  }, [saveSession])

  flushRunningSessionRef.current = flushRunningSession

  useEffect(() => {
    if (activeTimer.status !== "running") return
    if (activeTimer.elapsedSeconds <= 0) return
    if (activeTimer.elapsedSeconds % TIMER_AUTO_SAVE_SECONDS !== 0) return

    void flushRunningSessionRef.current?.()
  }, [activeTimer.status, activeTimer.taskId, activeTimer.elapsedSeconds])

  useEffect(() => {
    const flushOnExit = () => {
      const timer = activeTimerRef.current
      if (timer.status !== "running" || !timer.taskId || !timer.sessionStartTime) return
      if (timer.elapsedSeconds <= 0 || isSavingEntryRef.current) return

      const token = store.getState().auth?.accessToken
      if (!token) return

      createTimeEntryKeepalive(
        {
          task_id: timer.taskId,
          duration_seconds: timer.elapsedSeconds,
          start_time: timer.sessionStartTime,
          end_time: new Date().toISOString(),
          entry_date: getTodayString(),
        },
        token
      )
    }

    window.addEventListener("beforeunload", flushOnExit)
    window.addEventListener("pagehide", flushOnExit)

    return () => {
      window.removeEventListener("beforeunload", flushOnExit)
      window.removeEventListener("pagehide", flushOnExit)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (invalidateDebounceRef.current) {
        clearTimeout(invalidateDebounceRef.current)
      }
    }
  }, [])

  const activeTask = useMemo(() => {
    if (!activeTimer.taskId) return null
    return resolveTrackedTask(activeTimer.taskId, trackedTasks, allTasksForPicker)
  }, [activeTimer.taskId, trackedTasks, allTasksForPicker])

  const getRunningTaskDisplaySeconds = useCallback(
    (taskId: string, serverTotalSeconds: number, elapsedSeconds: number) => {
      if (runningDisplayTaskIdRef.current === taskId) {
        return runningDisplayBaseRef.current + elapsedSeconds
      }
      return serverTotalSeconds + elapsedSeconds
    },
    []
  )

  const displayClockSeconds = useMemo(() => {
    if (!activeTask || !activeTimer.taskId) return 0
    if (activeTimer.status === "running") {
      return getRunningTaskDisplaySeconds(
        activeTimer.taskId,
        activeTask.totalSecondsToday,
        activeTimer.elapsedSeconds
      )
    }
    return activeTask.totalSecondsToday
  }, [activeTask, activeTimer, getRunningTaskDisplaySeconds])

  const todayTotalSeconds = useMemo(() => {
    const fromTracked = trackedTasks.reduce((sum, t) => sum + t.totalSecondsToday, 0)
    if (activeTimer.status !== "running" || !activeTimer.taskId) return fromTracked

    const runningTask = trackedTasks.find((t) => t.taskId === activeTimer.taskId)
    if (!runningTask) return fromTracked

    const runningLive = getRunningTaskDisplaySeconds(
      activeTimer.taskId,
      runningTask.totalSecondsToday,
      activeTimer.elapsedSeconds
    )

    return fromTracked - runningTask.totalSecondsToday + runningLive
  }, [trackedTasks, activeTimer, getRunningTaskDisplaySeconds])

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

  const availableTasksToAdd = useMemo(
    () => allTasksForPicker.filter((task) => !trackedTasks.some((t) => t.taskId === task.id)),
    [allTasksForPicker, trackedTasks]
  )

  const selectTask = useCallback(
    async (taskId: string) => {
      if (activeTimer.status === "running" && activeTimer.taskId !== taskId) {
        await flushRunningSession()
      }

      setActiveTimer({
        taskId,
        status: "paused",
        elapsedSeconds: 0,
        sessionStartTime: null,
      })
      persistSelectedTask(taskId)
    },
    [activeTimer, flushRunningSession, persistSelectedTask]
  )

  const addTrackedTask = useCallback(
    async (task: AvailableTask) => {
      await addTrackedTaskMutation.mutateAsync({ task_id: task.id, track_date: today })
    },
    [addTrackedTaskMutation, today]
  )

  const removeTrackedTask = useCallback(
    async (taskId: string) => {
      if (activeTimer.taskId === taskId && activeTimer.status === "running") {
        await flushRunningSession()
      }
      if (activeTimer.taskId === taskId) {
        runningDisplayBaseRef.current = 0
        runningDisplayTaskIdRef.current = null
        setActiveTimer(DEFAULT_TIMER)
        persistSelectedTask(null)
      }
      await removeTrackedTaskMutation.mutateAsync(taskId)
    },
    [activeTimer, flushRunningSession, removeTrackedTaskMutation, persistSelectedTask]
  )

  const startTimer = useCallback(
    async (taskId: string) => {
      const task = resolveTrackedTask(taskId, trackedTasks, allTasksForPicker)
      if (!task) return

      if (
        activeTimer.status === "running" &&
        activeTimer.taskId &&
        activeTimer.taskId !== taskId
      ) {
        await flushRunningSession()
      }

      runningDisplayBaseRef.current = task.totalSecondsToday
      runningDisplayTaskIdRef.current = taskId

      setActiveTimer({
        taskId,
        status: "running",
        elapsedSeconds: 0,
        sessionStartTime: new Date().toISOString(),
      })
      persistSelectedTask(taskId)
    },
    [trackedTasks, allTasksForPicker, activeTimer, flushRunningSession, persistSelectedTask]
  )

  const pauseTimer = useCallback(async () => {
    if (!activeTimer.taskId || activeTimer.status !== "running") return

    const taskId = activeTimer.taskId

    await flushRunningSession()

    runningDisplayBaseRef.current = 0
    runningDisplayTaskIdRef.current = null

    setActiveTimer({
      taskId,
      status: "paused",
      elapsedSeconds: 0,
      sessionStartTime: null,
    })
    persistSelectedTask(taskId)
  }, [activeTimer, flushRunningSession, persistSelectedTask])

  const stopTimer = useCallback(() => {
    void pauseTimer()
  }, [pauseTimer])

  const playTask = useCallback(
    async (task: AvailableTask) => {
      const isTracked = trackedTasks.some((t) => t.taskId === task.id)
      if (!isTracked) {
        await addTrackedTaskMutation.mutateAsync({ task_id: task.id, track_date: today })
      }
      await startTimer(task.id)
    },
    [trackedTasks, addTrackedTaskMutation, today, startTimer]
  )

  const stopTask = useCallback(
    async (taskId: string) => {
      if (activeTimer.taskId !== taskId || activeTimer.status !== "running") return
      await pauseTimer()
    },
    [activeTimer, pauseTimer]
  )

  const resumeTimer = useCallback(
    (taskId: string) => {
      void startTimer(taskId)
    },
    [startTimer]
  )

  const setDateRangePreset = useCallback((preset: DateRangeFilter["preset"]) => {
    setDateRange((prev) => updateDateRangePreset(preset, prev))
  }, [])

  const setCustomDateRange = useCallback((startDate: string, endDate: string) => {
    setDateRange({ preset: "custom", startDate, endDate })
  }, [])

  const updateWeeklyTarget = useCallback(
    (hours: number) => {
      const normalized = Math.max(1, Math.min(168, hours))
      updateSettingsMutation.mutate({ hours_per_week: normalized })
    },
    [updateSettingsMutation]
  )

  const updateActivityBarVisible = useCallback(
    (visible: boolean) => {
      updateSettingsMutation.mutate({ activity_bar_visible: visible })
    },
    [updateSettingsMutation]
  )

  const deleteTimeEntryById = useCallback(
    (entryId: string) => deleteEntryMutation.mutateAsync(entryId),
    [deleteEntryMutation]
  )

  const isLoading = dashboardQuery.isLoading || tasksQuery.isLoading
  const isSaving =
    isSavingEntry ||
    addTrackedTaskMutation.isPending ||
    removeTrackedTaskMutation.isPending ||
    deleteEntryMutation.isPending

  return {
    trackedTasks,
    entries,
    activeTimer,
    activeTask,
    settings,
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
    isLoading,
    isSaving,
    isDeletingEntry: deleteEntryMutation.isPending,
    isWeekLoading: weekQuery.isLoading,
    addTrackedTask,
    removeTrackedTask,
    deleteTimeEntryById,
    selectTask,
    startTimer,
    pauseTimer,
    stopTimer,
    playTask,
    stopTask,
    resumeTimer,
    setDateRangePreset,
    setCustomDateRange,
    setReportsSearch,
    updateWeeklyTarget,
    updateActivityBarVisible,
  }
}

export type UseTimeTrackReturn = ReturnType<typeof useTimeTrack>
