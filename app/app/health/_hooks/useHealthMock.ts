"use client"

import { useCallback, useMemo, useState } from "react"
import { format } from "date-fns"
import {
  DEFAULT_PROFILE,
  DEFAULT_TARGETS,
  DEFAULT_TODAY,
  MOCK_DAILY_HISTORY,
  MOCK_HABITS,
  MOCK_HEALTH_SCORE,
  MOCK_WEIGHT_LOG,
  MOCK_WORKOUTS,
  getLatestWeight,
} from "../_data/mockHealthData"
import type {
  DailyMetricEntry,
  Habit,
  HealthPeriodFilter,
  HealthProfile,
  HealthTargets,
  HeightUnit,
  MoodValue,
  TodayMetrics,
  TrackableMetric,
  WeightEntry,
  Workout,
} from "../_types/health.types"
import { calculateBmi, getBmiStatus } from "../_utils/bmi"
import { buildMetricChartData, buildWeightChartData, getInitialPeriodFilter } from "../_utils/healthCharts"
import { METRIC_STEP } from "../_components/constants"

export function useHealthMock() {
  const [profile, setProfile] = useState<HealthProfile>(DEFAULT_PROFILE)
  const [today, setToday] = useState<TodayMetrics>(DEFAULT_TODAY)
  const [targets, setTargets] = useState<HealthTargets>(DEFAULT_TARGETS)
  const [weightLog, setWeightLog] = useState<WeightEntry[]>(MOCK_WEIGHT_LOG)
  const [dailyHistory, setDailyHistory] = useState<DailyMetricEntry[]>(MOCK_DAILY_HISTORY)
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS)
  const [workouts] = useState<Workout[]>(MOCK_WORKOUTS)
  const [moodToday, setMoodToday] = useState<MoodValue | "">("")
  const [moodNotes, setMoodNotes] = useState("")
  const [periodFilter, setPeriodFilter] = useState<HealthPeriodFilter>(getInitialPeriodFilter)

  const latestWeight = useMemo(() => getLatestWeight(weightLog), [weightLog])

  const bmiStatus = useMemo(() => {
    if (!profile.heightCm || !latestWeight) return getBmiStatus(null)
    return getBmiStatus(calculateBmi(latestWeight, profile.heightCm))
  }, [profile.heightCm, latestWeight])

  const incrementMetric = useCallback((metric: TrackableMetric) => {
    const step = METRIC_STEP[metric]
    setToday((prev) => ({
      ...prev,
      [metric === "water" ? "waterGlasses" : metric === "sleep" ? "sleepHours" : "exerciseMinutes"]:
        metric === "water"
          ? prev.waterGlasses + step
          : metric === "sleep"
            ? Math.round((prev.sleepHours + step) * 2) / 2
            : prev.exerciseMinutes + step,
    }))
  }, [])

  const decrementMetric = useCallback((metric: TrackableMetric) => {
    const step = METRIC_STEP[metric]
    setToday((prev) => ({
      ...prev,
      [metric === "water" ? "waterGlasses" : metric === "sleep" ? "sleepHours" : "exerciseMinutes"]:
        metric === "water"
          ? Math.max(0, prev.waterGlasses - step)
          : metric === "sleep"
            ? Math.max(0, Math.round((prev.sleepHours - step) * 2) / 2)
            : Math.max(0, prev.exerciseMinutes - step),
    }))
  }, [])

  const setTarget = useCallback((metric: TrackableMetric, value: number) => {
    setTargets((prev) => ({
      ...prev,
      [metric === "water" ? "waterGlasses" : metric === "sleep" ? "sleepHours" : "exerciseMinutes"]: value,
    }))
  }, [])

  const setHeight = useCallback((heightCm: number | null) => {
    setProfile((prev) => ({ ...prev, heightCm }))
  }, [])

  const setHeightUnit = useCallback((heightUnit: HeightUnit) => {
    setProfile((prev) => ({ ...prev, heightUnit }))
  }, [])

  const logWeight = useCallback((weightKg: number) => {
    const date = format(new Date(), "yyyy-MM-dd")
    setWeightLog((prev) => {
      const existing = prev.findIndex((e) => e.date === date)
      if (existing >= 0) {
        const next = [...prev]
        next[existing] = { ...next[existing], weightKg }
        return next
      }
      return [...prev, { id: `w-${date}-${Date.now()}`, date, weightKg }]
    })
  }, [])

  const toggleHabit = useCallback((id: number) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    )
  }, [])

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

  return {
    healthScore: MOCK_HEALTH_SCORE,
    profile,
    today,
    targets,
    weightLog,
    dailyHistory,
    habits,
    workouts,
    moodToday,
    moodNotes,
    periodFilter,
    latestWeight,
    bmiStatus,
    weightChartData,
    waterChartData,
    sleepChartData,
    exerciseChartData,
    incrementMetric,
    decrementMetric,
    setTarget,
    setHeight,
    setHeightUnit,
    logWeight,
    toggleHabit,
    setMoodToday,
    setMoodNotes,
    setPeriodFilter,
  }
}

export type UseHealthMockReturn = ReturnType<typeof useHealthMock>
