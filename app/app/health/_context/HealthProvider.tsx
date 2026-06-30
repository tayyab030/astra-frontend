"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useHealthMock, type UseHealthMockReturn } from "../_hooks/useHealthMock"

const HealthContext = createContext<UseHealthMockReturn | null>(null)

export function HealthProvider({ children }: { children: ReactNode }) {
  const value = useHealthMock()
  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>
}

export function useHealthContext() {
  const ctx = useContext(HealthContext)
  if (!ctx) throw new Error("useHealthContext must be used within HealthProvider")
  return ctx
}
