"use client"

import { useTimeTrackCore, type UseTimeTrackCoreReturn } from "./useTimeTrackCore"
import type { UseTimeTrackPageDataReturn } from "./useTimeTrackPageData"

export function useTimeTrack() {
  return useTimeTrackCore()
}

export type UseTimeTrackReturn = UseTimeTrackCoreReturn & UseTimeTrackPageDataReturn

export { useTimeTrackCore } from "./useTimeTrackCore"
export { useTimeTrackPageData } from "./useTimeTrackPageData"
export type { UseTimeTrackCoreReturn } from "./useTimeTrackCore"
export type { UseTimeTrackPageDataReturn } from "./useTimeTrackPageData"
