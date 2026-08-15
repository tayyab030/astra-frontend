import type { AnalyticsComputed } from "../../analytics/_utils/computeAnalytics"

export const LIFE_SCORE_WEIGHTS = [
  { name: "Productivity", maxScore: 25, weightLabel: "25%", color: "blue" },
  { name: "Health", maxScore: 25, weightLabel: "25%", color: "green" },
  { name: "Wealth", maxScore: 25, weightLabel: "25%", color: "yellow" },
  { name: "Knowledge", maxScore: 15, weightLabel: "15%", color: "purple" },
  { name: "Communication", maxScore: 10, weightLabel: "10%", color: "pink" },
] as const

export interface WeightedCategory {
  name: string
  score: number
  maxScore: number
  weightLabel: string
  color: string
  trendDelta: number
  percent: number
}

export interface LifeScoreBoost {
  action: string
  points: number
  achieved: boolean
  description: string
}

export interface LifeScorePenalty {
  issue: string
  points: number
  active: boolean
  description: string
}

export interface LifeScoreBadge {
  name: string
  description: string
  earned: boolean
  color: string
}

export function getScoreLevel(score: number) {
  if (score >= 90) return { level: "Master", key: "master" as const }
  if (score >= 70) return { level: "Achiever", key: "achiever" as const }
  if (score >= 40) return { level: "Builder", key: "builder" as const }
  return { level: "Survivor", key: "survivor" as const }
}

export function computeLifeScoreView(analytics: AnalyticsComputed) {
  const periodLabel = analytics.periodLabel
  const weightedCategories: WeightedCategory[] = LIFE_SCORE_WEIGHTS.map((weight) => {
    const category = analytics.categories.find((item) => item.name === weight.name)
    const percent = category?.score ?? 0
    const score = Math.round((percent / 100) * weight.maxScore)
    const trendDelta =
      category?.trend === "up" ? 3 : category?.trend === "down" ? -3 : 0
    return {
      name: weight.name,
      score,
      maxScore: weight.maxScore,
      weightLabel: weight.weightLabel,
      color: weight.color,
      trendDelta,
      percent,
    }
  })

  const weightedOverall = Math.round(
    weightedCategories.reduce((sum, category) => sum + category.score, 0)
  )

  const snapshot = analytics.dailySnapshot
  const tasksDue = snapshot.tasksCompleted + snapshot.tasksPending
  const allTasksDone = tasksDue === 0 || snapshot.tasksPending === 0
  const healthLogged =
    snapshot.exerciseMinutes > 0 ||
    (periodLabel === "day" && analytics.summary.sleepHoursToday > 0)
  const underBudget =
    snapshot.budget <= 0 ? snapshot.spending === 0 : snapshot.spending <= snapshot.budget
  const noteCreated = snapshot.notesCreated > 0
  const noOverdue = analytics.summary.overdueTasks === 0

  const dailyBoosts: LifeScoreBoost[] = [
    {
      action: `Complete all tasks due this ${periodLabel}`,
      points: 5,
      achieved: allTasksDone,
      description:
        tasksDue === 0
          ? `No tasks due this ${periodLabel}`
          : `${snapshot.tasksCompleted}/${tasksDue} completed`,
    },
    {
      action:
        periodLabel === "day" ? "Log workout or sleep" : "Log exercise this period",
      points: 3,
      achieved: healthLogged,
      description: healthLogged
        ? periodLabel === "day"
          ? `${snapshot.exerciseMinutes} min exercise · ${analytics.summary.sleepHoursToday}h sleep`
          : `${snapshot.exerciseMinutes} min exercise`
        : "Track health activity",
    },
    {
      action: `Stay within ${periodLabel} budget`,
      points: 2,
      achieved: underBudget,
      description:
        snapshot.budget > 0
          ? `Spend vs budget this ${periodLabel}`
          : "Set category budgets for a stronger signal",
    },
    {
      action: `Create a note this ${periodLabel}`,
      points: 1,
      achieved: noteCreated,
      description: noteCreated
        ? `${snapshot.notesCreated} note(s)`
        : "Capture a note or journal entry",
    },
    {
      action: "Clear overdue tasks",
      points: 2,
      achieved: noOverdue,
      description: noOverdue
        ? "Queue is clear"
        : `${analytics.summary.overdueTasks} overdue`,
    },
  ]

  const penalties: LifeScorePenalty[] = [
    {
      issue: "Multiple overdue tasks",
      points: -5,
      active: analytics.summary.overdueTasks >= 3,
      description:
        analytics.summary.overdueTasks >= 3
          ? `${analytics.summary.overdueTasks} tasks past deadline`
          : "Triggered at 3+ overdue tasks",
    },
    {
      issue: "No sleep log today",
      points: -2,
      active: analytics.summary.sleepHoursToday <= 0,
      description:
        analytics.summary.sleepHoursToday > 0
          ? `${analytics.summary.sleepHoursToday}h logged today`
          : "Missing sleep tracking today",
    },
    {
      issue: `Overspending 20%+ ${periodLabel} budget`,
      points: -5,
      active: snapshot.budget > 0 && snapshot.spending > snapshot.budget * 1.2,
      description:
        snapshot.budget > 0
          ? `Spend vs budget this ${periodLabel}`
          : "Needs a budget baseline",
    },
    {
      issue: `No notes this ${periodLabel}`,
      points: -2,
      active: analytics.summary.notesInPeriod <= 0,
      description:
        analytics.summary.notesInPeriod > 0
          ? `${analytics.summary.notesInPeriod} note(s)`
          : "Knowledge stagnation",
    },
  ]

  const badges: LifeScoreBadge[] = [
    {
      name: "Wealth Wizard",
      description: "All budgets on track",
      earned: analytics.achievements.some((item) => item.kind === "wealth" && item.earned),
      color: "yellow",
    },
    {
      name: "Focus Master",
      description: "7+ day habit streak",
      earned: analytics.summary.habitStreak >= 7,
      color: "blue",
    },
    {
      name: "Health Champion",
      description: "Health score 80+",
      earned: (analytics.categories.find((c) => c.name === "Health")?.score ?? 0) >= 80,
      color: "green",
    },
    {
      name: "Knowledge Seeker",
      description: "50+ notes in your library",
      earned: analytics.achievements.some((item) => item.kind === "notes" && item.earned),
      color: "purple",
    },
  ]

  const previousScore = analytics.previousLifeScoreOverall
  const trendDelta = weightedOverall - previousScore

  return {
    lifeScore: weightedOverall,
    unweightedAverage: analytics.lifeScoreOverall,
    previousScore,
    trendDelta,
    trend: trendDelta > 0 ? ("up" as const) : trendDelta < 0 ? ("down" as const) : ("flat" as const),
    level: getScoreLevel(weightedOverall),
    weightedCategories,
    dailyBoosts,
    penalties,
    badges,
    habitStreak: analytics.summary.habitStreak,
    badgesEarned: badges.filter((badge) => badge.earned).length,
    periodLabel,
  }
}

export const STATIC_LIFE_SCORE_AI_INSIGHT =
  "Your Health is strong, but Productivity needs attention. Clear overdue tasks and protect focus blocks to lift your score."

export const STATIC_LIFE_SCORE_FORECAST = {
  score: 80,
  label: "At current pace, ~2 months",
}
