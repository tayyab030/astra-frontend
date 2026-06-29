"use client"

import React from "react"
import { ChevronDown, Target } from "lucide-react"
import type { GoalCategoryValue } from "@/lib/api/goals"
import { cn } from "@/lib/utils"
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from "@/app/app/goals/_components/constants"

interface GoalHeaderProps {
  goalName?: string
  category?: GoalCategoryValue
}

export default function GoalHeader({
  goalName = "Goal Tasks",
  category,
}: GoalHeaderProps) {
  const CategoryIcon = category ? CATEGORY_ICONS[category] : Target

  return (
    <div className="flex items-center justify-between w-full bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 p-4">
      <div className="flex items-center space-x-4">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r text-white",
            category ? CATEGORY_COLORS[category] : "from-cyan-500 to-blue-600",
          )}
        >
          <CategoryIcon className="h-5 w-5" />
        </div>

        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-white">{goalName}</h1>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>

        <div className="flex items-center space-x-1">
          <span className="text-sm text-slate-400">Goal progress</span>
          <div className="w-4 h-4 border border-cyan-400/50 rounded-full" />
        </div>
      </div>
    </div>
  )
}
