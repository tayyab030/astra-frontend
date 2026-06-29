"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchGoalsDashboard } from "@/lib/api/goals"
import type { GoalCategoryValue } from "@/lib/api/goals"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/constants/routes"
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from "@/app/app/goals/_components/constants"

interface GoalHeaderProps {
  goalId?: string
  goalName?: string
  category?: GoalCategoryValue
}

export default function GoalHeader({
  goalId,
  goalName = "Goal Tasks",
  category,
}: GoalHeaderProps) {
  const router = useRouter()
  const CategoryIcon = category ? CATEGORY_ICONS[category] : Target

  const goalsQuery = useQuery({
    queryKey: ["goals", "goal-header"],
    queryFn: () => {
      const now = new Date()
      return fetchGoalsDashboard({
        mode: "year",
        startYear: now.getFullYear() - 1,
        endYear: now.getFullYear() + 1,
      })
    },
  })

  const goals = goalsQuery.data?.goals ?? []

  return (
    <div className="flex w-full items-center justify-between border-b border-slate-700/50 bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
          onClick={() => router.push(ROUTES.APP.TASKS)}
          aria-label="Back to tasks"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r text-white",
            category ? CATEGORY_COLORS[category] : "from-cyan-500 to-blue-600",
          )}
        >
          <CategoryIcon className="h-5 w-5" />
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex min-w-0 items-center gap-2 rounded-md px-1 py-0.5 text-left transition-colors hover:bg-slate-800/40"
            >
              <h1 className="truncate text-lg font-semibold text-white">{goalName}</h1>
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="z-[100] w-72 border-slate-600/50 bg-slate-800 p-1 text-slate-200"
          >
            <div className="max-h-64 overflow-y-auto overflow-x-hidden overscroll-y-contain scrollbar-thin">
              {goalsQuery.isLoading ? (
                <div className="space-y-1 p-1">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-full bg-slate-900/50" />
                  ))}
                </div>
              ) : goals.length > 0 ? (
                goals.map((goal) => {
                  const GoalIcon = CATEGORY_ICONS[goal.category as GoalCategoryValue]
                  const isActive = goal.id === goalId

                  return (
                    <DropdownMenuItem
                      key={goal.id}
                      asChild
                      className={cn(
                        "cursor-pointer font-mono focus:bg-slate-700 focus:text-slate-100",
                        isActive && "bg-cyan-500/10 text-cyan-200",
                      )}
                    >
                      <Link
                        href={`${ROUTES.APP.TASKS}/goals/${goal.id}`}
                        className="flex min-w-0 items-center gap-2"
                      >
                        <div
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-r text-white",
                            CATEGORY_COLORS[goal.category as GoalCategoryValue],
                          )}
                        >
                          <GoalIcon className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate">{goal.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  )
                })
              ) : (
                <div className="px-3 py-4 text-center font-mono text-xs text-slate-400">
                  No goals found
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden items-center gap-1 sm:flex">
          <span className="text-sm text-slate-400">Goal progress</span>
          <div className="h-4 w-4 rounded-full border border-cyan-400/50" />
        </div>
      </div>
    </div>
  )
}
