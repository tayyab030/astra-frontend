"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3 } from "lucide-react"
import type { Goal } from "@/lib/api/goals"
import { CATEGORY_COLORS } from "./constants"
import { buildLifeBalanceFromGoals, getLifeBalanceSummary } from "../_utils/lifeBalance"

interface LifeBalanceWheelProps {
  goals: Goal[]
  isLoading?: boolean
}

export function LifeBalanceWheel({ goals, isLoading }: LifeBalanceWheelProps) {
  const categories = useMemo(() => buildLifeBalanceFromGoals(goals), [goals])
  const summary = useMemo(() => getLifeBalanceSummary(categories, goals.length), [categories, goals.length])

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-poppins flex items-center text-cyan-300">
          <BarChart3 className="mr-2 h-5 w-5 text-cyan-400" />
          Life Balance Wheel
        </CardTitle>
        <CardDescription className="text-slate-300">
          {isLoading
            ? "Loading your goal balance..."
            : goals.length === 0
              ? "Add goals to see how your focus is spread across life areas."
              : `Average progress across ${goals.length} goal${goals.length === 1 ? "" : "s"} in this period · ${summary.overallProgress}% overall`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24 bg-slate-900/50" />
                  <Skeleton className="h-4 w-10 bg-slate-900/50" />
                </div>
                <Skeleton className="h-2 w-full bg-slate-900/50" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between text-sm gap-3">
                  <div className="min-w-0">
                    <span className="font-medium text-slate-200">{category.name}</span>
                    <span className="ml-2 text-xs text-slate-500">
                      {category.goalCount === 0
                        ? "No goals"
                        : `${category.goalCount} goal${category.goalCount === 1 ? "" : "s"}`}
                    </span>
                  </div>
                  <span className="text-cyan-400 shrink-0">{category.value}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-900/40 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${CATEGORY_COLORS[category.category]} transition-all duration-500 ease-out`}
                    style={{ width: `${category.value}%` }}
                  />
                </div>
              </div>
            ))}

            {goals.length > 0 && summary.insight ? (
              <p className="text-xs text-slate-400 pt-2 border-t border-slate-600/50">{summary.insight}</p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
