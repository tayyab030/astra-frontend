"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Target, Trophy, Star, Flame } from "lucide-react"
import type { Goal, GoalsFilter } from "@/lib/api/goals"
import { WealthFilters } from "../wealth/_components/WealthFilters"
import { useGoals } from "./_hooks/useGoals"
import { AiGoalInsights } from "./_components/AiGoalInsights"
import { GoalFormDialog } from "./_components/GoalFormDialog"
import { GoalCard } from "./_components/GoalCard"
import { LifeBalanceWheel } from "./_components/LifeBalanceWheel"
import { WealthEmptyState } from "../wealth/_components/WealthEmptyState"

type StatusFilter = "all" | "in_progress" | "completed"

function getInitialFilter(): GoalsFilter {
  const now = new Date()
  return {
    mode: "month",
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

export default function GoalsPage() {
  const [filter, setFilter] = useState<GoalsFilter>(getInitialFilter)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const {
    dashboard,
    isLoading,
    createGoal,
    updateGoal,
    deleteGoal,
    updateMilestone,
    createMilestone,
    deleteMilestone,
    isCreatingGoal,
    isUpdatingGoal,
    isDeletingGoal,
    isUpdatingMilestone,
  } = useGoals(filter)

  const filteredGoals = useMemo(() => {
    const goals = dashboard?.goals ?? []
    if (statusFilter === "in_progress") {
      return goals.filter((goal) => goal.progress < 100)
    }
    if (statusFilter === "completed") {
      return goals.filter((goal) => goal.progress >= 100)
    }
    return goals
  }, [dashboard?.goals, statusFilter])

  const summary = dashboard?.summary

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
      <div
        className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000"
      />
      <div
        className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-2xl animate-pulse delay-2000"
      />

      <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-cyan-500/20 rounded-full animate-spin-slow" />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-blue-500/20 rounded-full animate-spin-slow delay-1000" />

      <div className="relative z-10 p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-cyan-300">Goals Dashboard 🎯</h1>
            <p className="text-slate-300 font-inter mt-1">
              &quot;A goal is a dream with a deadline.&quot; - Track your journey to success.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <WealthFilters onChange={setFilter} />
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25"
              onClick={() => setIsAddGoalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Active Goals",
              value: summary?.active_goals ?? 0,
              subtitle: `${summary?.high_priority_active ?? 0} high priority`,
              titleClass: "text-cyan-300",
              valueClass: "text-cyan-400",
              subtitleClass: "text-cyan-500",
              borderClass: "border-cyan-500/30",
            },
            {
              title: "Avg Progress",
              value: `${summary?.avg_progress ?? 0}%`,
              subtitle: "for selected period",
              titleClass: "text-blue-300",
              valueClass: "text-blue-400",
              subtitleClass: "text-blue-500",
              borderClass: "border-blue-500/30",
            },
            {
              title: "Longest Streak",
              value: summary?.longest_streak ?? 0,
              subtitle: "days",
              titleClass: "text-cyan-300",
              valueClass: "text-cyan-400",
              subtitleClass: "text-cyan-500",
              borderClass: "border-cyan-500/30",
            },
            {
              title: "Completed Goals",
              value: summary?.completed_goals ?? 0,
              subtitle: "in selected period",
              titleClass: "text-blue-300",
              valueClass: "text-blue-400",
              subtitleClass: "text-blue-500",
              borderClass: "border-blue-500/30",
            },
          ].map((card) => (
            <Card
              key={card.title}
              className={`bg-gradient-to-br from-slate-800/50 to-slate-700/50 ${card.borderClass} backdrop-blur-sm`}
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-inter ${card.titleClass}`}>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-16 mb-2 bg-slate-900/50" />
                    <Skeleton className="h-3 w-24 bg-slate-900/50" />
                  </>
                ) : (
                  <>
                    <div className={`text-2xl font-bold font-poppins ${card.valueClass}`}>{card.value}</div>
                    <p className={`text-xs ${card.subtitleClass}`}>{card.subtitle}</p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <AiGoalInsights />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold font-poppins text-cyan-300">Your Goals</h2>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: "all", label: "All" },
                    { value: "in_progress", label: "In Progress" },
                    { value: "completed", label: "Completed" },
                  ] as const
                ).map((option) => (
                  <Button
                    key={option.value}
                    variant={statusFilter === option.value ? "outline" : "ghost"}
                    size="sm"
                    className={
                      statusFilter === option.value
                        ? "border-slate-600 text-slate-300 hover:bg-slate-700/50 bg-transparent"
                        : "text-slate-400 hover:bg-slate-700/50"
                    }
                    onClick={() => setStatusFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-48 w-full bg-slate-900/50" />
                ))}
              </div>
            ) : filteredGoals.length === 0 ? (
              <WealthEmptyState
                icon={Target}
                title="No goals for this period"
                description="Create a goal or adjust the month/year filter to see goals that overlap this period."
              />
            ) : (
              <div className="space-y-4">
                {filteredGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={setEditingGoal}
                    onDelete={deleteGoal}
                    onUpdateMilestone={updateMilestone}
                    isDeleting={isDeletingGoal}
                    isUpdatingMilestone={isUpdatingMilestone}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <LifeBalanceWheel goals={dashboard?.goals ?? []} isLoading={isLoading} />

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-poppins flex items-center text-cyan-300">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Goal Crusher</p>
                      <p className="text-xs text-slate-400">Completed 5 goals this year</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <Flame className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Streak Master</p>
                      <p className="text-xs text-slate-400">45-day consistency streak</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <GoalFormDialog
        open={isAddGoalOpen}
        onOpenChange={setIsAddGoalOpen}
        mode="add"
        onCreate={createGoal}
        onUpdate={updateGoal}
        onCreateMilestone={createMilestone}
        onUpdateMilestone={updateMilestone}
        onDeleteMilestone={deleteMilestone}
        isSubmitting={isCreatingGoal}
      />
      <GoalFormDialog
        open={editingGoal !== null}
        onOpenChange={(open) => {
          if (!open) setEditingGoal(null)
        }}
        mode="edit"
        goal={editingGoal}
        onCreate={createGoal}
        onUpdate={updateGoal}
        onCreateMilestone={createMilestone}
        onUpdateMilestone={updateMilestone}
        onDeleteMilestone={deleteMilestone}
        isSubmitting={isUpdatingGoal}
      />
    </div>
  )
}
