"use client"

import React, { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Target } from "lucide-react"
import Link from "next/link"
import SelectField from "@/components/common/SelectField"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { fetchGoalsDashboard } from "@/lib/api/goals"
import type { GoalCategoryValue } from "@/lib/api/goals"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/constants/routes"
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from "@/app/app/goals/_components/constants"
import { CardTaskSummary } from "../CardTaskSummary"

const GOALS_GRID_CLASSES = "grid grid-cols-2 md:grid-cols-4 gap-4"
const CARD_GRID_MAX_HEIGHT = "max-h-72 overflow-y-auto overflow-x-hidden pr-1"

const Goals = () => {
  const [filter, setFilter] = useState("all")

  const goalsQuery = useQuery({
    queryKey: ["goals", "tasks-page"],
    queryFn: () => {
      const now = new Date()
      return fetchGoalsDashboard({
        mode: "year",
        startYear: now.getFullYear() - 1,
        endYear: now.getFullYear() + 1,
      })
    },
  })

  const goals = useMemo(() => {
    const allGoals = goalsQuery.data?.goals ?? []
    if (filter === "in_progress") {
      return allGoals.filter((goal) => goal.progress < 100)
    }
    if (filter === "completed") {
      return allGoals.filter((goal) => goal.progress >= 100)
    }
    return allGoals
  }, [filter, goalsQuery.data?.goals])

  const selectOptions = [
    { value: "all", label: "All" },
    { value: "in_progress", label: "In progress" },
    { value: "completed", label: "Completed" },
  ]

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4.5 border border-slate-700/50 mb-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white">Goals</h2>
          <SelectField
            value={filter}
            onValueChange={setFilter}
            placeholder="All"
            options={selectOptions}
          />
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-slate-600 text-slate-200 hover:bg-slate-700/50"
        >
          <Link href={ROUTES.APP.GOALS}>Manage goals</Link>
        </Button>
      </div>

      {goalsQuery.isLoading ? (
        <div className={CARD_GRID_MAX_HEIGHT}>
          <div className={GOALS_GRID_CLASSES}>
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="w-full h-32" />
            ))}
          </div>
        </div>
      ) : goals.length > 0 ? (
        <div className={CARD_GRID_MAX_HEIGHT}>
          <div className={GOALS_GRID_CLASSES}>
            {goals.map((goal) => {
              const CategoryIcon = CATEGORY_ICONS[goal.category as GoalCategoryValue]

              return (
                <Link
                  key={goal.id}
                  href={`${ROUTES.APP.TASKS}/goals/${goal.id}`}
                  className={cn(
                    "bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 transition-colors cursor-pointer group relative h-32 flex justify-center items-center w-full hover:bg-slate-700/50",
                  )}
                >
                  <div className="flex flex-col items-center text-center px-2">
                    <div
                      className={cn(
                        "mb-3 rounded-full p-2 bg-gradient-to-r text-white group-hover:scale-110 transition-transform",
                        CATEGORY_COLORS[goal.category as GoalCategoryValue],
                      )}
                    >
                      <CategoryIcon size={22} />
                    </div>
                    <h3 className="text-sm font-medium text-white mb-1 leading-tight line-clamp-2">
                      {goal.title}
                    </h3>
                    <CardTaskSummary summary={goal.linked_tasks} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="bg-slate-700/30 rounded-full p-6 mb-6 border border-slate-600/50">
            <Target className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {filter === "all" ? "No goals yet" : `No ${filter.replace("_", " ")} goals`}
          </h3>
          <p className="text-slate-400 text-center mb-6 max-w-md">
            Create goals on the goals page, then link tasks to track progress here.
          </p>
          <Button asChild variant="outline" className="border-slate-600 text-slate-200">
            <Link href={ROUTES.APP.GOALS}>Go to goals</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default Goals
