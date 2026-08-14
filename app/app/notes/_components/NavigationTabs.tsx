"use client"

import { Button } from "@/components/ui/button"
import { NOTES_TABS } from "./constants"
import type { NoteTabId } from "../_types/notes.types"

interface NavigationTabsProps {
  activeTab: NoteTabId
  onTabChange: (tab: NoteTabId) => void
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-700/50 bg-slate-900/50 px-2 py-2 backdrop-blur-sm rounded-t-lg scrollbar-thin">
      {NOTES_TABS.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id
        return (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(item.id)}
            className={`flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "border-b-2 border-cyan-400 bg-transparent text-cyan-300"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="font-mono whitespace-nowrap">{item.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
