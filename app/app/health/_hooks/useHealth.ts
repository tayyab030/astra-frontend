"use client"

import { useCallback, useMemo, useState } from "react"
import { format, subDays } from "date-fns"
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  adjustHealthMetric,
  createHealthHabit,
  createHealthWorkout,
  fetchHealthDashboard,
  getHealthErrorMessage,
  logHealthWeight,
  saveHealthMood,
  toggleHealthHabit,
  updateHealthProfile,
  updateHealthTargets,
} from "@/lib/api/health"
import type {
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

  const today = data?.today ?? { waterGlasses: 0, sleepHours: 0, exerciseMinutes: 0 }
  const targets = data?.targets ?? { waterGlasses: 8, sleepHours: 7.5, exerciseMinutes: 60 }
  const weightLog = data?.weightLog ?? []
  const dailyHistory = data?.dailyHistory ?? []
  const habits = data?.habits ?? []
  const workouts = data?.workouts ?? []
  const moodEntries = data?.moodEntries ?? []

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
    mutationFn: (payload: { metric: TrackableMetric; direction: -1 | 1 }) =>
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
    (metric: TrackableMetric) => {
      adjustMetricMutation.mutate({ metric, direction: 1 })
    },
    [adjustMetricMutation]
  )

  const decrementMetric = useCallback(
    (metric: TrackableMetric) => {
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
      createWorkoutMutation.isPending ||
      saveMoodMutation.isPending,
    incrementMetric,
    decrementMetric,
    setTarget,
    setHeight,
    setHeightUnit,
    logWeight,
    toggleHabit,
    createHabit,
    createWorkout,
    saveMood,
    setMoodToday,
    setMoodNotes,
    setPeriodFilter,
    refetch: dashboardQuery.refetch,
  }
}

export type UseHealthReturn = ReturnType<typeof useHealth>
