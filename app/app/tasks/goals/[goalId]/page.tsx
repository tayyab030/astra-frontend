"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchGoal } from "@/lib/api/goals"
import type { GoalCategoryValue } from "@/lib/api/goals"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from "@/app/app/goals/_components/constants"
import { CardTaskSummary } from "../../_components/CardTaskSummary"
import MyTasks from "../../_components/MyTasks"

const Wrapper = dynamic(() => import("../../_components/Wrapper"), { ssr: false })

export default function GoalDetailPage() {
  const params = useParams()
  const goalId = params.goalId as string

  const goalQuery = useQuery({
    queryKey: ["goal", goalId],
    queryFn: () => fetchGoal(goalId),
    enabled: Boolean(goalId),
  })

  const goal = goalQuery.data
  const CategoryIcon = goal ? CATEGORY_ICONS[goal.category as GoalCategoryValue] : null

  return (
    <Wrapper>
      <div className="relative z-10 flex flex-col p-6 pb-0 min-h-screen">
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-4 text-slate-400 hover:text-white hover:bg-slate-800/50 -ml-2"
          >
            <Link href={ROUTES.APP.TASKS}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to tasks
            </Link>
          </Button>

          {goalQuery.isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64 bg-slate-900/50" />
              <Skeleton className="h-4 w-full max-w-md bg-slate-900/50" />
              <Skeleton className="h-3 w-full max-w-lg bg-slate-900/50" />
            </div>
          ) : goal ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-start gap-4">
                <div
                  className={cn(
                    "rounded-full p-3 bg-gradient-to-r text-white shrink-0",
                    CATEGORY_COLORS[goal.category as GoalCategoryValue],
                  )}
                >
                  {CategoryIcon ? <CategoryIcon size={24} /> : null}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={cn(
                        "bg-gradient-to-r text-white border-0",
                        CATEGORY_COLORS[goal.category as GoalCategoryValue],
                      )}
                    >
                      {goal.category_label}
                    </Badge>
                    <Badge variant="outline" className="border-slate-600 text-slate-300 capitalize">
                      {goal.priority}
                    </Badge>
                  </div>
                  <h1 className="text-2xl font-semibold text-white">{goal.title}</h1>
                  {goal.motivation ? (
                    <p className="text-slate-400 text-sm max-w-2xl">{goal.motivation}</p>
                  ) : null}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-cyan-400">{goal.progress}%</div>
                  <CardTaskSummary summary={goal.linked_tasks} className="justify-end" />
                </div>
              </div>
              <Progress value={goal.progress} className="h-2 max-w-2xl" />
            </div>
          ) : (
            <p className="text-slate-400">Goal not found.</p>
          )}
        </div>

        <MyTasks listParams={{ goal_id: goalId }} />
      </div>
    </Wrapper>
  )
}
