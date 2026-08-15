"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getLocalDateString } from "../../health/_utils/date"
import { analyticsKeys } from "./queryKeys"
import { fetchAnalyticsBundle } from "./fetchAnalyticsBundle"
import { getAnalyticsRanges, type AnalyticsPeriod } from "../_utils/dateRanges"
import { computeAnalytics } from "../_utils/computeAnalytics"

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
