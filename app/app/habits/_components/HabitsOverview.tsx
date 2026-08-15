"use client"

import { useMemo } from "react"
import { BarChart3, Flame, PieChart as PieChartIcon, Trophy } from "lucide-react"
import { Cell, Pie, PieChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Habit } from "../_types/habits.types"
import {
  HABIT_ACHIEVEMENTS,
  WEEKLY_CONSISTENCY_DATA,
  completionChartConfig,
  streakChartConfig,
  weeklyConsistencyChartConfig,
} from "./constants"

const chartClassName =
  "h-56 w-full aspect-auto [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/40"

interface HabitsOverviewProps {
  habits: Habit[]
  completedCount: number
  highCompleted: number
  highTotal: number
  longestStreak: number
  longestStreakHabitName?: string | null
  isLoading?: boolean
}

export function HabitsOverview({
  habits,
  completedCount,
  highCompleted,
  highTotal,
  longestStreak,
  longestStreakHabitName,
  isLoading,
}: HabitsOverviewProps) {
  const completionRate = habits.length
    ? Math.round((completedCount / habits.length) * 100)
    : 0
  const highRate = highTotal
    ? Math.round((highCompleted / highTotal) * 100)
    : 0

  const packCount = useMemo(() => {
    const keys = new Set(habits.map((habit) => habit.groupKey).filter(Boolean))
    return keys.size
  }, [habits])

  const completionData = useMemo(() => {
    const remaining = Math.max(0, habits.length - completedCount)
    return [
      { name: "done", value: completedCount, fill: "var(--color-done)" },
      { name: "remaining", value: remaining, fill: "var(--color-remaining)" },
    ]
  }, [completedCount, habits.length])

  const streakData = useMemo(() => {
    return [...habits]
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 6)
      .map((habit) => ({
        name: habit.name.length > 14 ? `${habit.name.slice(0, 14)}…` : habit.name,
        streak: habit.streak,
      }))
  }, [habits])

  const packProgress = useMemo(() => {
    const packs = new Map<string, { title: string; total: number; done: number }>()
    for (const habit of habits) {
      if (!habit.groupKey) continue
      const current = packs.get(habit.groupKey) ?? {
        title: habit.groupName?.trim() || "Habit pack",
        total: 0,
        done: 0,
      }
      current.total += 1
      if (habit.completed) current.done += 1
      packs.set(habit.groupKey, current)
    }
    return Array.from(packs.entries()).map(([key, value]) => ({
      key,
      ...value,
      percent: value.total ? Math.round((value.done / value.total) * 100) : 0,
    }))
  }, [habits])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="astra-card">
          <CardContent className="py-5 text-center">
            <p className="text-2xl font-bold text-primary">{completionRate}%</p>
            <p className="text-xs text-muted-foreground">Today completion</p>
          </CardContent>
        </Card>
        <Card className="astra-card">
          <CardContent className="py-5 text-center">
            <p className="text-2xl font-bold text-primary">{highRate}%</p>
            <p className="text-xs text-muted-foreground">High priority done</p>
          </CardContent>
        </Card>
        <Card className="astra-card">
          <CardContent className="py-5 text-center">
            <p className="text-2xl font-bold text-primary">{packCount}</p>
            <p className="text-xs text-muted-foreground">Habit packs</p>
          </CardContent>
        </Card>
        <Card className="astra-card">
          <CardContent className="py-5 text-center">
            <p className="text-2xl font-bold text-primary">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">
              {longestStreak > 0 && longestStreakHabitName
                ? `Best · ${longestStreakHabitName}`
                : "Best streak"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <PieChartIcon className="mr-2 h-5 w-5" />
              Today&apos;s completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            {habits.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">
                Add habits to see completion breakdown
              </div>
            ) : (
              <ChartContainer config={completionChartConfig} className={chartClassName}>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={completionData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    strokeWidth={2}
                  >
                    {completionData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Flame className="mr-2 h-5 w-5 text-orange-500" />
              Top streaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {streakData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">
                Streaks will appear once habits are tracked
              </div>
            ) : (
              <ChartContainer config={streakChartConfig} className={chartClassName}>
                <BarChart data={streakData} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="streak" fill="var(--color-streak)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="astra-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <BarChart3 className="mr-2 h-5 w-5" />
              Weekly consistency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={weeklyConsistencyChartConfig}
              className={chartClassName}
            >
              <BarChart data={WEEKLY_CONSISTENCY_DATA} margin={{ left: 0, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
              </BarChart>
            </ChartContainer>
            <p className="mt-2 text-xs text-muted-foreground">
              Sample weekly trend — live history will replace this when habit logs are available.
            </p>
          </CardContent>
        </Card>

        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {HABIT_ACHIEVEMENTS.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r ${item.gradient}`}
                >
                  <Flame className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {packProgress.length > 0 ? (
        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="text-primary">Pack progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {packProgress.map((pack) => (
              <div key={pack.key} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground truncate">{pack.title}</span>
                  <span className="text-muted-foreground shrink-0">
                    {pack.done}/{pack.total} · {pack.percent}%
                  </span>
                </div>
                <Progress value={pack.percent} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
