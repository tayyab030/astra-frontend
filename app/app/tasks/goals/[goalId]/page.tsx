"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { fetchGoal } from "@/lib/api/goals"
import type { GoalCategoryValue } from "@/lib/api/goals"
import GoalHeader from "../../_components/detail/GoalHeader"
import TaskDetailLayout from "../../_components/detail/TaskDetailLayout"

export default function GoalDetailPage() {
  const params = useParams()
  const goalId = params.goalId as string

  const goalQuery = useQuery({
    queryKey: ["goal", goalId],
    queryFn: () => fetchGoal(goalId),
    enabled: Boolean(goalId),
  })

  const goal = goalQuery.data

  return (
    <TaskDetailLayout
      header={
        <GoalHeader
          goalId={goalId}
          goalName={goal?.title ?? "Goal Tasks"}
          category={goal?.category as GoalCategoryValue | undefined}
        />
      }
      listParams={{ goal_id: goalId }}
      fixedGoalId={goalId}
    />
  )
}
