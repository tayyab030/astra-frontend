"use client"

import { Button } from "@/components/ui/button"
import { TIME_TRACK_TABS, type TimeTrackTabId } from "./constants"

interface NavigationTabsProps {
  activeTab?: TimeTrackTabId
  onTabChange?: (tab: TimeTrackTabId) => void
}

export default function NavigationTabs({
  activeTab = "timer",
  onTabChange,
}: NavigationTabsProps) {
  return (
    <div className="flex items-center space-x-1 overflow-x-auto border-b border-slate-700/50 bg-slate-900/50 px-4 py-2 backdrop-blur-sm">
      {TIME_TRACK_TABS.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id

        return (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange?.(item.id)}
            className={`flex shrink-0 items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "border-b-2 border-white bg-transparent text-white"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
