import { format, subDays } from "date-fns"
import type {
  DailyMetricEntry,
  Habit,
  HealthProfile,
  HealthTargets,
  TodayMetrics,
  WeightEntry,
  Workout,
} from "../_types/health.types"

export const MOCK_HEALTH_SCORE = 78

export const DEFAULT_PROFILE: HealthProfile = {
  heightCm: 175,
  heightUnit: "cm",
}

export const DEFAULT_TARGETS: HealthTargets = {
  waterGlasses: 8,
  sleepHours: 7.5,
  exerciseMinutes: 60,
}

export const DEFAULT_TODAY: TodayMetrics = {
  waterGlasses: 6,
  sleepHours: 6.5,
  exerciseMinutes: 45,
}

export const MOCK_HABITS: Habit[] = [
  { id: 1, name: "Drink 8 glasses of water", streak: 12, completed: true, target: 8, current: 6 },
  { id: 2, name: "Meditate 10 minutes", streak: 5, completed: false, target: 10, current: 0 },
  { id: 3, name: "Walk 10,000 steps", streak: 8, completed: true, target: 10000, current: 8500 },
  { id: 4, name: "Sleep 7+ hours", streak: 3, completed: false, target: 7, current: 6.5 },
]

export const MOCK_WORKOUTS: Workout[] = [
  { id: 1, type: "Cardio", duration: 30, calories: 250, date: "Today" },
  { id: 2, type: "Strength", duration: 45, calories: 180, date: "Yesterday" },
  { id: 3, type: "Yoga", duration: 20, calories: 80, date: "2 days ago" },
]

export const AI_HEALTH_INSIGHTS = [
  "You're doing great with water intake! Keep it up.",
  "You've been sleeping 6h avg (target: 7.5h). Consider adjusting your bedtime.",
  "Your cardio workouts are consistent, but no strength training this week. Add a 20-min session?",
]

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateWeightLog(): WeightEntry[] {
  const entries: WeightEntry[] = []
  let weight = 74.2

  for (let i = 89; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd")
    const drift = (seededRandom(i * 7) - 0.48) * 0.3
    weight = Math.round((weight + drift) * 10) / 10
    weight = Math.max(70, Math.min(76, weight))

    if (i % 3 === 0 || i === 0) {
      entries.push({ id: `w-${date}`, date, weightKg: weight })
    }
  }

  return entries
}

function generateDailyHistory(): DailyMetricEntry[] {
  const entries: DailyMetricEntry[] = []

  for (let i = 89; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd")
    entries.push({
      date,
      waterGlasses: Math.round(4 + seededRandom(i * 3) * 5),
      sleepHours: Math.round((5.5 + seededRandom(i * 5) * 2.5) * 2) / 2,
      exerciseMinutes: Math.round(20 + seededRandom(i * 11) * 50),
    })
  }

  return entries
}

export const MOCK_WEIGHT_LOG = generateWeightLog()
export const MOCK_DAILY_HISTORY = generateDailyHistory()

export function getLatestWeight(entries: WeightEntry[]): number | null {
  if (entries.length === 0) return null
  return entries[entries.length - 1].weightKg
}
