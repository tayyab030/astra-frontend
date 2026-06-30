export type HealthTabId =
  | "overview"
  | "weight"
  | "tracking"
  | "habits"
  | "exercise"
  | "wellness"
  | "insights"

export type HealthPeriodMode = "day" | "week" | "month" | "year"

export type HeightUnit = "cm" | "ftin"

export type BmiTone = "green" | "yellow" | "red" | "neutral"

export type TrackableMetric = "water" | "sleep" | "exercise"

export interface HealthProfile {
  heightCm: number | null
  heightUnit: HeightUnit
}

export interface HealthTargets {
  waterGlasses: number
  sleepHours: number
  exerciseMinutes: number
}

export interface TodayMetrics {
  waterGlasses: number
  sleepHours: number
  exerciseMinutes: number
}

export interface WeightEntry {
  id: string
  date: string
  weightKg: number
}

export interface DailyMetricEntry {
  date: string
  waterGlasses: number
  sleepHours: number
  exerciseMinutes: number
}

export interface Habit {
  id: number
  name: string
  streak: number
  completed: boolean
  target: number
  current: number
}

export interface Workout {
  id: number
  type: string
  duration: number
  calories: number
  date: string
}

export type MoodValue = "great" | "good" | "okay" | "bad" | "terrible"

export interface MoodEntry {
  id: string
  date: string
  mood: MoodValue
  notes?: string
}

export interface HealthPeriodFilter {
  mode: HealthPeriodMode
  selectedDay: string
  selectedMonth: string
  selectedYear: string
}

export interface ChartPoint {
  key: string
  label: string
  value: number
  formatted: string
}

export interface BmiStatus {
  bmi: number | null
  label: string
  tone: BmiTone
}
