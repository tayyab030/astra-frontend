"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { format, subDays } from "date-fns"
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  adjustHealthMetric,
  createHealthHabit,
  createHealthWorkout,
  deleteHealthHabit,
  deleteHealthSleepSession,
  fetchHealthDashboard,
  getHealthErrorMessage,
  logHealthWeight,
  saveHealthMood,
  toggleHealthHabit,
  toggleHealthSleep,
  createHealthSleepSession,
  updateHealthSleepSession,
  updateHealthHabit,
  updateHealthProfile,
  updateHealthTargets,
} from "@/lib/api/health"
import type {
  AdjustableMetric,
  HealthPeriodFilter,
  HeightUnit,
  MoodValue,
  TrackableMetric,
} from "../_types/health.types"
import { calculateBmi, getBmiStatus } from "../_utils/bmi"
import {
  buildMetricChartData,
  buildWeightChartData,
  getInitialPeriodFilter,
  getPeriodRange,
} from "../_utils/healthCharts"
import { getLocalDateString } from "../_utils/date"
import {
  applyPendingSleepToggles,
  enqueueSleepToggle,
  flushSleepToggleQueue,
  isNetworkError,
  readSleepToggleQueue,
  sumCompletedSleepHours,
  writeSleepToggleQueue,
} from "../_utils/sleepOfflineQueue"
import { healthKeys } from "./queryKeys"

const HEIGHT_UNIT_KEY = "health_height_unit"

function getStoredHeightUnit(): HeightUnit {
  if (typeof window === "undefined") return "cm"
  const stored = localStorage.getItem(HEIGHT_UNIT_KEY)
  return stored === "ftin" ? "ftin" : "cm"
}

export function useHealth() {
  const queryClient = useQueryClient()
  const [periodFilter, setPeriodFilter] = useState<HealthPeriodFilter>(getInitialPeriodFilter)
  const [heightUnit, setHeightUnitState] = useState<HeightUnit>(getStoredHeightUnit)
  const [moodToday, setMoodToday] = useState<MoodValue | "">("")
  const [moodNotes, setMoodNotes] = useState("")
  const [sleepQueueVersion, setSleepQueueVersion] = useState(0)

  const fetchRange = useMemo(() => {
    const today = getLocalDateString()
    const startDate = format(subDays(new Date(), 364), "yyyy-MM-dd")
    return { startDate, endDate: today, todayDate: today }
  }, [])

  const dashboardQuery = useQuery({
    queryKey: healthKeys.dashboard(fetchRange.startDate, fetchRange.endDate),
    queryFn: () =>
      fetchHealthDashboard({
        start_date: fetchRange.startDate,
        end_date: fetchRange.endDate,
        today_date: fetchRange.todayDate,
      }),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })

  const data = dashboardQuery.data

  const invalidateHealth = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: healthKeys.all })
  }, [queryClient])

  const profile = useMemo(
    () => ({
      heightCm: data?.profile.heightCm ?? null,
      heightUnit,
    }),
    [data?.profile.heightCm, heightUnit]
  )

  const todayBase = data?.today ?? {
    waterGlasses: 0,
    sleepHours: 0,
    exerciseMinutes: 0,
  }
  const targets = data?.targets ?? { waterGlasses: 8, sleepHours: 7.5, exerciseMinutes: 60 }
  const weightLog = data?.weightLog ?? []
  const dailyHistory = data?.dailyHistory ?? []
  const habits = data?.habits ?? []
  const workouts = data?.workouts ?? []
  const moodEntries = data?.moodEntries ?? []

  const pendingSleepQueue = useMemo(() => {
    void sleepQueueVersion
    return readSleepToggleQueue()
  }, [sleepQueueVersion])

  const sleepSessions = useMemo(
    () => applyPendingSleepToggles(data?.sleepSessions ?? [], pendingSleepQueue),
    [data?.sleepSessions, pendingSleepQueue]
  )

  const today = useMemo(() => {
    if (pendingSleepQueue.length === 0) return todayBase
    return {
      ...todayBase,
      sleepHours: sumCompletedSleepHours(sleepSessions),
    }
  }, [todayBase, pendingSleepQueue.length, sleepSessions])

  const pendingSleepSyncCount = pendingSleepQueue.length

  const periodRange = useMemo(() => getPeriodRange(periodFilter), [periodFilter])

  const summary = useMemo(() => {
    const filteredDaily = dailyHistory.filter(
      (entry) => entry.date >= periodRange.startDate && entry.date <= periodRange.endDate
    )
    const filteredWorkouts = workouts.filter(
      (workout) => workout.date >= periodRange.startDate && workout.date <= periodRange.endDate
    )

    const sleepEntries = filteredDaily.filter((entry) => entry.sleepHours > 0)
    const periodAvgSleepHours = sleepEntries.length
      ? Math.round(
          (sleepEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / sleepEntries.length) *
            10
        ) / 10
      : 0

    const periodExerciseMinutes =
      filteredDaily.reduce((sum, entry) => sum + entry.exerciseMinutes, 0) +
      filteredWorkouts.reduce((sum, workout) => sum + workout.duration, 0)

    const longestHabitStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0)

    return { longestHabitStreak, periodExerciseMinutes, periodAvgSleepHours }
  }, [dailyHistory, workouts, habits, periodRange])

  const latestWeight = data?.latestWeightKg ?? null

  const bmiStatus = useMemo(() => {
    if (!profile.heightCm || !latestWeight) return getBmiStatus(null)
    return getBmiStatus(calculateBmi(latestWeight, profile.heightCm))
  }, [profile.heightCm, latestWeight])

  const weightChartData = useMemo(
    () => buildWeightChartData(weightLog, periodFilter),
    [weightLog, periodFilter]
  )

  const waterChartData = useMemo(
    () => buildMetricChartData(dailyHistory, periodFilter, "waterGlasses", "glasses"),
    [dailyHistory, periodFilter]
  )

  const sleepChartData = useMemo(
    () => buildMetricChartData(dailyHistory, periodFilter, "sleepHours", "hours"),
    [dailyHistory, periodFilter]
  )

  const exerciseChartData = useMemo(
    () => buildMetricChartData(dailyHistory, periodFilter, "exerciseMinutes", "minutes"),
    [dailyHistory, periodFilter]
  )

  const adjustMetricMutation = useMutation({
    mutationFn: (payload: { metric: AdjustableMetric; direction: -1 | 1 }) =>
      adjustHealthMetric({ ...payload, date: getLocalDateString() }),
    onSuccess: () => invalidateHealth(),
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to update metric")),
  })

  const updateTargetsMutation = useMutation({
    mutationFn: updateHealthTargets,
    onSuccess: () => {
      toast.success("Target updated")
      invalidateHealth()
    },
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to update target")),
  })

  const updateProfileMutation = useMutation({
    mutationFn: updateHealthProfile,
    onSuccess: () => invalidateHealth(),
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to update profile")),
  })

  const logWeightMutation = useMutation({
    mutationFn: logHealthWeight,
    onSuccess: () => {
      toast.success("Weight logged")
      invalidateHealth()
    },
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to log weight")),
  })

  const toggleHabitMutation = useMutation({
    mutationFn: toggleHealthHabit,
    onSuccess: () => invalidateHealth(),
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to update habit")),
  })

  const createHabitMutation = useMutation({
    mutationFn: createHealthHabit,
    onSuccess: () => {
      toast.success("Habit created")
      invalidateHealth()
    },
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to create habit")),
  })

  const updateHabitMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; frequency?: string; target?: number } }) =>
      updateHealthHabit(id, payload),
    onSuccess: () => {
      toast.success("Habit updated")
      invalidateHealth()
    },
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to update habit")),
  })

  const deleteHabitMutation = useMutation({
    mutationFn: deleteHealthHabit,
    onSuccess: () => {
      toast.success("Habit deleted")
      invalidateHealth()
    },
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to delete habit")),
  })

  const toggleSleepMutation = useMutation({
    mutationFn: toggleHealthSleep,
    onSuccess: (session) => {
      toast.success(session.isActive ? "Goodnight — sleep started" : "You're awake — sleep logged")
      invalidateHealth()
    },
    onError: (error) => {
      if (!isNetworkError(error)) {
        toast.error(getHealthErrorMessage(error, "Failed to toggle sleep"))
      }
    },
  })

  const deleteSleepSessionMutation = useMutation({
    mutationFn: deleteHealthSleepSession,
    onSuccess: () => {
      toast.success("Sleep session deleted")
      invalidateHealth()
    },
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to delete sleep session")),
  })

  const createSleepSessionMutation = useMutation({
    mutationFn: createHealthSleepSession,
    onSuccess: () => {
      toast.success("Sleep session added")
      invalidateHealth()
    },
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to add sleep session")),
  })

  const updateSleepSessionMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { start_time?: string; end_time?: string; date?: string } }) =>
      updateHealthSleepSession(id, payload),
    onSuccess: () => {
      toast.success("Sleep session updated")
      invalidateHealth()
    },
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to update sleep session")),
  })

  const syncPendingSleep = useCallback(async () => {
    if (typeof window !== "undefined" && !navigator.onLine) return 0
    const pendingBefore = readSleepToggleQueue().length
    if (pendingBefore === 0) return 0

    try {
      const synced = await flushSleepToggleQueue()
      setSleepQueueVersion((version) => version + 1)
      if (synced > 0) {
        toast.success(
          synced === 1 ? "Offline sleep synced" : `${synced} offline sleep taps synced`
        )
        invalidateHealth()
      }
      return synced
    } catch (error) {
      // Partial successes already removed only uploaded taps inside flush.
      setSleepQueueVersion((version) => version + 1)
      const remaining = readSleepToggleQueue().length
      const synced = Math.max(0, pendingBefore - remaining)
      if (synced > 0) {
        toast.success(
          synced === 1
            ? "Synced 1 tap; others still waiting"
            : `Synced ${synced} taps; others still waiting`
        )
        invalidateHealth()
      }
      if (!isNetworkError(error)) {
        toast.error(getHealthErrorMessage(error, "Failed to sync offline sleep"))
      }
      return synced
    }
  }, [invalidateHealth])

  useEffect(() => {
    const onOnline = () => {
      void syncPendingSleep()
    }
    window.addEventListener("online", onOnline)
    void syncPendingSleep()
    return () => window.removeEventListener("online", onOnline)
  }, [syncPendingSleep])

  const createWorkoutMutation = useMutation({
    mutationFn: createHealthWorkout,
    onSuccess: () => {
      toast.success("Workout logged")
      invalidateHealth()
    },
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to log workout")),
  })

  const saveMoodMutation = useMutation({
    mutationFn: saveHealthMood,
    onSuccess: () => {
      toast.success("Mood saved")
      invalidateHealth()
    },
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to save mood")),
  })

  const incrementMetric = useCallback(
    (metric: AdjustableMetric) => {
      adjustMetricMutation.mutate({ metric, direction: 1 })
    },
    [adjustMetricMutation]
  )

  const decrementMetric = useCallback(
    (metric: AdjustableMetric) => {
      adjustMetricMutation.mutate({ metric, direction: -1 })
    },
    [adjustMetricMutation]
  )

  const setTarget = useCallback(
    (metric: TrackableMetric, value: number) => {
      const payload =
        metric === "water"
          ? { water_glasses: value }
          : metric === "sleep"
            ? { sleep_hours: value }
            : { exercise_minutes: value }
      updateTargetsMutation.mutate(payload)
    },
    [updateTargetsMutation]
  )

  const toggleSleep = useCallback(async () => {
    const payload = {
      timestamp: new Date().toISOString(),
      local_date: getLocalDateString(),
    }

    const saveOffline = () => {
      enqueueSleepToggle(payload)
      setSleepQueueVersion((version) => version + 1)
      toast.message("Saved offline — will sync when you're back online")
    }

    if (typeof window !== "undefined" && !navigator.onLine) {
      saveOffline()
      return
    }

    // Keep order: flush any queued taps before a new online tap
    if (readSleepToggleQueue().length > 0) {
      await syncPendingSleep()
      if (readSleepToggleQueue().length > 0) {
        saveOffline()
        return
      }
    }

    try {
      await toggleSleepMutation.mutateAsync(payload)
    } catch (error) {
      if (isNetworkError(error)) {
        saveOffline()
        return
      }
      throw error
    }
  }, [syncPendingSleep, toggleSleepMutation])

  const createSleepSession = useCallback(
    (startTime: string, endTime: string) => {
      return createSleepSessionMutation.mutateAsync({
        start_time: startTime,
        end_time: endTime,
        date: getLocalDateString(),
      })
    },
    [createSleepSessionMutation]
  )

  const updateSleepSession = useCallback(
    (id: string, payload: { startTime?: string; endTime?: string }) => {
      return updateSleepSessionMutation.mutateAsync({
        id,
        payload: {
          start_time: payload.startTime,
          end_time: payload.endTime,
          date: getLocalDateString(),
        },
      })
    },
    [updateSleepSessionMutation]
  )

  const deleteSleepSession = useCallback(
    async (id: string) => {
      if (id.startsWith("local-")) {
        const tapId = id.slice("local-".length)
        const queue = readSleepToggleQueue()
        const index = queue.findIndex((item) => item.id === tapId)
        if (index >= 0) {
          const session = sleepSessions.find((item) => item.id === id)
          const removeCount = session?.isActive ? 1 : 2
          writeSleepToggleQueue([...queue.slice(0, index), ...queue.slice(index + removeCount)])
          setSleepQueueVersion((version) => version + 1)
          toast.success("Removed offline sleep")
          return
        }
      }
      return deleteSleepSessionMutation.mutateAsync(id)
    },
    [deleteSleepSessionMutation, sleepSessions]
  )

  const setHeight = useCallback(
    (heightCm: number | null) => {
      updateProfileMutation.mutate({ height_cm: heightCm })
    },
    [updateProfileMutation]
  )

  const setHeightUnit = useCallback((unit: HeightUnit) => {
    setHeightUnitState(unit)
    localStorage.setItem(HEIGHT_UNIT_KEY, unit)
  }, [])

  const logWeight = useCallback(
    (weightKg: number) => {
      logWeightMutation.mutate({ weight_kg: weightKg, date: getLocalDateString() })
    },
    [logWeightMutation]
  )

  const toggleHabit = useCallback(
    (id: string) => {
      toggleHabitMutation.mutate(id)
    },
    [toggleHabitMutation]
  )

  const createHabit = useCallback(
    (name: string, frequency?: string, target?: number) => {
      return createHabitMutation.mutateAsync({ name, frequency, target })
    },
    [createHabitMutation]
  )

  const updateHabit = useCallback(
    (id: string, payload: { name?: string; frequency?: string; target?: number }) => {
      return updateHabitMutation.mutateAsync({ id, payload })
    },
    [updateHabitMutation]
  )

  const deleteHabit = useCallback(
    (id: string) => {
      return deleteHabitMutation.mutateAsync(id)
    },
    [deleteHabitMutation]
  )

  const createWorkout = useCallback(
    (type: string, duration: number, calories?: number) => {
      return createWorkoutMutation.mutateAsync({
        type,
        duration,
        calories,
        date: getLocalDateString(),
      })
    },
    [createWorkoutMutation]
  )

  const saveMood = useCallback(
    (mood: MoodValue, notes?: string) => {
      return saveMoodMutation.mutateAsync({ mood, notes, date: getLocalDateString() })
    },
    [saveMoodMutation]
  )

  const effectiveMoodToday = moodToday || (data?.moodToday.mood as MoodValue | "") || ""
  const effectiveMoodNotes = moodNotes || data?.moodToday.notes || ""

  return {
    healthScore: data?.healthScore ?? 0,
    summary,
    profile,
    today,
    targets,
    weightLog,
    dailyHistory,
    habits,
    sleepSessions,
    pendingSleepSyncCount,
    workouts,
    moodEntries,
    moodToday: effectiveMoodToday,
    moodNotes: effectiveMoodNotes,
    periodFilter,
    latestWeight,
    bmiStatus,
    weightChartData,
    waterChartData,
    sleepChartData,
    exerciseChartData,
    isLoading: dashboardQuery.isLoading && !dashboardQuery.data,
    isFetching: dashboardQuery.isFetching,
    isError: dashboardQuery.isError,
    isSaving:
      adjustMetricMutation.isPending ||
      updateTargetsMutation.isPending ||
      updateProfileMutation.isPending ||
      logWeightMutation.isPending ||
      toggleHabitMutation.isPending ||
      createHabitMutation.isPending ||
      updateHabitMutation.isPending ||
      deleteHabitMutation.isPending ||
      toggleSleepMutation.isPending ||
      createSleepSessionMutation.isPending ||
      updateSleepSessionMutation.isPending ||
      deleteSleepSessionMutation.isPending ||
      createWorkoutMutation.isPending ||
      saveMoodMutation.isPending,
    incrementMetric,
    decrementMetric,
    setTarget,
    toggleSleep,
    createSleepSession,
    updateSleepSession,
    deleteSleepSession,
    setHeight,
    setHeightUnit,
    logWeight,
    toggleHabit,
    createHabit,
    updateHabit,
    deleteHabit,
    createWorkout,
    saveMood,
    setMoodToday,
    setMoodNotes,
    setPeriodFilter,
    refetch: dashboardQuery.refetch,
  }
}

export type UseHealthReturn = ReturnType<typeof useHealth>
