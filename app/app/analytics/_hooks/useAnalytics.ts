"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchTasks } from "@/lib/api/tasks"
import { fetchWealthDashboard } from "@/lib/api/wealth"
import { fetchHealthDashboard } from "@/lib/api/health"
import { fetchTimeTrackDashboard } from "@/lib/api/timeTrack"
import { fetchGoalsDashboard } from "@/lib/api/goals"
import { fetchNotesDashboard } from "@/lib/api/notes"
import { fetchHabits, fetchHabitsDay } from "@/lib/api/habits"
import { getLocalDateString } from "../../health/_utils/date"
import { analyticsKeys } from "./queryKeys"
import { getAnalyticsRanges, type AnalyticsPeriod } from "../_utils/dateRanges"
import { computeAnalytics } from "../_utils/computeAnalytics"

async function fetchAnalyticsBundle(today: string) {
  const ranges = getAnalyticsRanges(today)

  const [tasks, wealth, wealthPrev, health, time, goals, notes, habits, habitsToday] =
    await Promise.all([
      fetchTasks({ filter: "all" }),
      fetchWealthDashboard({
        mode: "month",
        year: ranges.year,
        month: ranges.month,
      }),
      fetchWealthDashboard({
        mode: "month",
        year: ranges.prevYear,
        month: ranges.prevMonth,
      }).catch(() => null),
      fetchHealthDashboard({
        start_date: ranges.lookbackStart,
        end_date: ranges.today,
        today_date: ranges.today,
      }),
      fetchTimeTrackDashboard({
        start_date: ranges.lookbackStart,
        end_date: ranges.today,
      }),
      fetchGoalsDashboard({
        mode: "month",
        year: ranges.year,
        month: ranges.month,
      }),
      fetchNotesDashboard({
        page: 1,
        page_size: 100,
        sort_field: "created_at",
        sort_order: "desc",
      }),
      fetchHabits(),
      fetchHabitsDay(ranges.today).catch(() => null),
    ])

  return {
    ranges,
    tasks,
    wealth,
    wealthPrev,
    health,
    time,
    goals,
    notes,
    habits,
    habitsToday,
  }
}

export function useAnalytics(period: AnalyticsPeriod = "week") {
  const today = getLocalDateString()

  const query = useQuery({
    queryKey: analyticsKeys.bundle(today),
    queryFn: () => fetchAnalyticsBundle(today),
    staleTime: 30_000,
  })

  const analytics = useMemo(() => {
    if (!query.data) return null
    return computeAnalytics({ ...query.data, period })
  }, [query.data, period])

  return {
    analytics,
    period,
    ranges: query.data?.ranges ?? getAnalyticsRanges(today),
    isLoading: query.isLoading && !query.data,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
