"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getLocalDateString } from "../../health/_utils/date"
import { analyticsKeys } from "../../analytics/_hooks/queryKeys"
import { fetchAnalyticsBundle } from "../../analytics/_hooks/fetchAnalyticsBundle"
import { computeAnalytics } from "../../analytics/_utils/computeAnalytics"
import { computeDashboard } from "../_utils/computeDashboard"

export function useDashboard() {
  const today = getLocalDateString()

  const query = useQuery({
    queryKey: analyticsKeys.bundle(today),
    queryFn: () => fetchAnalyticsBundle(today),
    staleTime: 30_000,
  })

  const dashboard = useMemo(() => {
    if (!query.data) return null
    const day = computeAnalytics({ ...query.data, period: "day" })
    const week = computeAnalytics({ ...query.data, period: "week" })
    return computeDashboard({ day, week, bundle: query.data })
  }, [query.data])

  return {
    dashboard,
    isLoading: query.isLoading && !query.data,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
