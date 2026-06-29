"use client"

import React, { useMemo } from "react"
import dynamic from "next/dynamic"
import type { TaskPeriodFilter, TasksListParams } from "@/lib/api/tasks"
import { useTasksSummary } from "../_hooks/useTasks"

const SelectField = dynamic(() => import("@/components/common/SelectField"), {
  ssr: false,
})

const periodOptions = [
  { value: "week", label: "My week" },
  { value: "month", label: "My month" },
  { value: "year", label: "My year" },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

interface HeaderProps {
  period: TaskPeriodFilter
  onPeriodChange: (period: TaskPeriodFilter) => void
  listParams: Omit<TasksListParams, "filter">
}

const Header = ({ period, onPeriodChange, listParams }: HeaderProps) => {
  const { data: summary } = useTasksSummary(listParams)

  const formattedDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    [],
  )

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-white mb-1">{formattedDate}</h1>
        <p className="text-gray-400 text-lg">{getGreeting()}</p>
      </div>

      <div className="flex items-center gap-6">
        <SelectField
          value={period}
          onValueChange={(value) => onPeriodChange(value as TaskPeriodFilter)}
          placeholder="My month"
          options={periodOptions}
          triggerClassName="w-[140px] bg-slate-800/50 border-slate-700 text-white"
        />

        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-300">
            {summary?.completed ?? 0} task{summary?.completed === 1 ? "" : "s"} completed
          </span>
        </div>
      </div>
    </div>
  )
}

export default Header
