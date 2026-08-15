"use client"

import { useCallback, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useOpenActionParam } from "@/hooks/useOpenActionParam"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CardGridSkeleton } from "@/components/skeletons"
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

  const openAddGoal = useCallback(() => {
    setIsAddGoalOpen(true)
  }, [])

  useOpenActionParam("add", openAddGoal)

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
    <div className="astra-page">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="astra-title">Goals Dashboard 🎯</h1>
            <p className="astra-subtitle mt-1">
              &quot;A goal is a dream with a deadline.&quot; - Track your journey to success.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <WealthFilters onChange={setFilter} />
            <Button
              className="astra-btn-primary"
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
            },
            {
              title: "Avg Progress",
              value: `${summary?.avg_progress ?? 0}%`,
              subtitle: "for selected period",
            },
            {
              title: "Longest Streak",
              value: summary?.longest_streak ?? 0,
              subtitle: "days",
            },
            {
              title: "Completed Goals",
              value: summary?.completed_goals ?? 0,
              subtitle: "in selected period",
            },
          ].map((card) => (
            <Card key={card.title} className="astra-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-primary">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-primary">{card.value}</div>
                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
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
              <h2 className="astra-title-sm">Your Goals</h2>
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
                        ? "border-border text-foreground hover:bg-accent bg-transparent"
                        : "text-muted-foreground hover:bg-accent"
                    }
                    onClick={() => setStatusFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <CardGridSkeleton count={3} className="sm:grid-cols-1 lg:grid-cols-1" />
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

            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
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
                      <p className="text-sm font-medium">Goal Crusher</p>
                      <p className="text-xs text-muted-foreground">Completed 5 goals this year</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <Flame className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Streak Master</p>
                      <p className="text-xs text-muted-foreground">45-day consistency streak</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
