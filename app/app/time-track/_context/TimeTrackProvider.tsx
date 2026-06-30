"use client"

import { createContext, useContext } from "react"
import { useTimeTrack, type UseTimeTrackReturn } from "../_hooks/useTimeTrack"

const TimeTrackContext = createContext<UseTimeTrackReturn | null>(null)

export function TimeTrackProvider({ children }: { children: React.ReactNode }) {
  const value = useTimeTrack()
  return <TimeTrackContext.Provider value={value}>{children}</TimeTrackContext.Provider>
}

export function useTimeTrackContext() {
  const context = useContext(TimeTrackContext)
  if (!context) {
    throw new Error("useTimeTrackContext must be used within TimeTrackProvider")
  }
  return context
}
