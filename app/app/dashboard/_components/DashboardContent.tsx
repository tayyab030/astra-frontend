"use client"

import Link from "next/link"
import { Cell, Pie, PieChart } from "recharts"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { DashboardPageSkeleton } from "@/components/skeletons"
import { ROUTES } from "@/constants/routes"
import { useCurrency } from "@/hooks/useCurrency"
import { useAiInsight } from "@/hooks/useAiInsight"
import { InsightHorizonBadge } from "@/components/insights/InsightHorizonBadge"
import { useAppSelector } from "@/store/hooks"
import {
  CheckSquare,
  Clock,
  DollarSign,
  Droplets,
  Flame,
  Star,
  Zap,
} from "lucide-react"
import { useDailyQuote } from "../_hooks/useDailyQuote"
import { useDashboard } from "../_hooks/useDashboard"
import { QuickActions } from "./QuickActions"
import type { DashboardView } from "../_utils/computeDashboard"

const expenseChartConfig = {
  value: { label: "Spent", color: "hsl(var(--primary))" },
} satisfies ChartConfig

const chartClassName =
  "h-48 w-full aspect-auto [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/40"

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function formatFocusHours(hours: number) {
  if (hours <= 0) return "0h"
  if (hours < 10) return `${hours.toFixed(1)}h`
  return `${Math.round(hours)}h`
}

function buildDashboardInsightContext(dashboard: DashboardView) {
  return {
    lifeScoreOverall: dashboard.lifeScoreOverall,
    tasksDueToday: dashboard.tasksDueToday,
    tasksCompletedToday: dashboard.tasksCompletedToday,
    spendingToday: dashboard.spendingToday,
    budgetToday: dashboard.budgetToday,
    waterGlasses: dashboard.waterGlasses,
    waterGoal: dashboard.waterGoal,
    waterProgress: dashboard.waterProgress,
    focusHours: dashboard.focusHours,
    sessionCount: dashboard.sessionCount,
    topHabitStreaks: dashboard.habitStreaks.slice(0, 5).map((h) => ({
      name: h.name,
      streak: h.streak,
      completed: h.completed,
    })),
    expenseCategories: dashboard.expenseDistribution.slice(0, 5).map((s) => ({
      category: s.category,
      value: s.value,
    })),
  }
}

export function DashboardContent() {
  const { formatCurrency } = useCurrency()
  const user = useAppSelector((state) => state.user.user)
  const { dashboard, isLoading, isError, refetch } = useDashboard()
  const { quote } = useDailyQuote()

  const insightContext = dashboard ? buildDashboardInsightContext(dashboard) : undefined
  const {
    data: insightData,
    hasInsight,
    isLoading: insightLoading,
    enabled: insightsEnabled,
  } = useAiInsight("dashboard", insightContext, { enabled: Boolean(dashboard) })

  const firstName = user?.first_name?.trim() || user?.username || "there"
  const greeting = getGreeting(new Date().getHours())

  if (isLoading) {
    return <DashboardPageSkeleton />
  }

  if (isError || !dashboard) {
    return (
      <div className="astra-page">
        <Card className="astra-card">
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">Couldn&apos;t load dashboard.</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const maxHabitStreak = Math.max(...dashboard.habitStreaks.map((h) => h.streak), 1)
  const showInsights = insightsEnabled && (hasInsight || insightLoading)

  return (
    <div className="astra-page">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="astra-title">
            {greeting}, {firstName}
          </h1>
          <p className="astra-subtitle mt-1">&quot;{quote}&quot;</p>
        </div>
        <Link href={ROUTES.APP.LIFE_SCORE}>
          <Badge
            variant="secondary"
            className="astra-score-badge text-lg px-4 py-2 cursor-pointer hover:opacity-90"
          >
            <Star className="mr-2 h-4 w-4" />
            Life Score: {dashboard.lifeScoreOverall}
          </Badge>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href={ROUTES.APP.TASKS} className="block">
          <Card className="astra-card h-full transition-colors hover:border-primary/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary flex items-center">
                <CheckSquare className="mr-2 h-4 w-4" />
                Tasks Due Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {dashboard.tasksDueToday}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboard.tasksCompletedToday} completed
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href={ROUTES.APP.WEALTH} className="block">
          <Card className="astra-card h-full transition-colors hover:border-primary/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Daily Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(dashboard.spendingToday)}
              </div>
              <p className="text-xs text-muted-foreground">
                Budget: {formatCurrency(dashboard.budgetToday)}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href={ROUTES.APP.HEALTH} className="block">
          <Card className="astra-card h-full transition-colors hover:border-primary/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary flex items-center">
                <Droplets className="mr-2 h-4 w-4" />
                Health Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Water</span>
                  <span>
                    {dashboard.waterGlasses}/{dashboard.waterGoal} glasses
                  </span>
                </div>
                <Progress value={dashboard.waterProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={ROUTES.APP.TIME_TRACK} className="block">
          <Card className="astra-card h-full transition-colors hover:border-primary/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Focus Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatFocusHours(dashboard.focusHours)}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboard.sessionCount}{" "}
                {dashboard.sessionCount === 1 ? "session" : "sessions"}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="text-primary">Weekly Expenses</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your spending by category this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboard.expenseDistribution.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                No expenses this week
              </div>
            ) : (
              <ChartContainer config={expenseChartConfig} className={chartClassName}>
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        nameKey="label"
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                    }
                  />
                  <Pie
                    data={dashboard.expenseDistribution}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                    stroke="transparent"
                  >
                    {dashboard.expenseDistribution.map((slice) => (
                      <Cell key={slice.category} fill={slice.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <Flame className="mr-2 h-5 w-5" />
              Habit Streaks
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your consistency over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboard.habitStreaks.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center gap-3 text-muted-foreground text-sm">
                <p>No habits yet</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`${ROUTES.APP.HABITS}?action=add`}>Add Habit</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard.habitStreaks.map((habit) => (
                  <div key={habit.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-foreground truncate">
                        {habit.name}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {habit.streak}-day streak
                      </span>
                    </div>
                    <Progress
                      value={Math.min(100, Math.round((habit.streak / maxHabitStreak) * 100))}
                      className="h-2"
                    />
                  </div>
                ))}
                <Button asChild variant="ghost" size="sm" className="w-full text-primary">
                  <Link href={ROUTES.APP.HABITS}>View all habits</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showInsights ? (
        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-primary" />
              <span className="text-primary">Smart Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insightLoading && !hasInsight ? (
              <div className="space-y-3">
                <div className="h-12 rounded-lg astra-panel animate-pulse" />
                <div className="h-12 rounded-lg astra-panel animate-pulse" />
              </div>
            ) : (
              <div className="space-y-3">
                {(insightData?.items ?? []).map((item, index) => (
                  <div key={`${item.message}-${index}`} className="p-3 astra-panel space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <InsightHorizonBadge horizon={item.horizon} />
                      {item.title ? (
                        <span className="text-xs font-medium text-primary">{item.title}</span>
                      ) : null}
                    </div>
                    <p className="text-sm">{item.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      <QuickActions />
    </div>
  )
}
