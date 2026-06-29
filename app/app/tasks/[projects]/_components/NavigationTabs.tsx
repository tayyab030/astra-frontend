"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Hand, List, Network } from "lucide-react"

interface NavigationTabsProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const navigationItems = [
  { id: "list", label: "List", icon: List },
  { id: "board", label: "Board", icon: Hand },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "dashboard", label: "Dashboard", icon: Network },
]

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab = "list",
  onTabChange,
}) => {
  return (
    <div className="flex items-center space-x-1 border-b border-slate-700/50 bg-slate-900/50 px-4 py-2 backdrop-blur-sm">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id

        return (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange?.(item.id)}
            className={`
              flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "border-b-2 border-white bg-transparent text-white"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }
            `}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Button>
        )
      })}
    </div>
  )
}

export default NavigationTabs
