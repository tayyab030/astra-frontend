"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import {
    ClipboardList,
    Hand,
    List,
    Calendar,
    Network,
    Workflow,
    MessageSquare,
    Paperclip,
    Clock,
    Plus,
    Timer
} from "lucide-react"

interface NavigationTabsProps {
    activeTab?: string
    onTabChange?: (tab: string) => void
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
    activeTab = "list",
    onTabChange
}) => {
    const navigationItems = [
        { id: "overview", label: "Overview", icon: ClipboardList },
        { id: "board", label: "Board", icon: Hand },
        { id: "list", label: "List", icon: List },
        { id: "calendar", label: "Calendar", icon: Calendar },
        { id: "timeline", label: "Timeline", icon: Timer },
        { id: "dashboard", label: "Dashboard", icon: Network },
        { id: "workflow", label: "Workflow", icon: Workflow },
        { id: "messages", label: "Messages", icon: MessageSquare },
        { id: "files", label: "Files", icon: Paperclip },
        { id: "workload", label: "Workload", icon: Clock }
    ]

    return (
        <div className="flex items-center space-x-1 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 px-4 py-2">
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
              ${isActive
                                ? "text-white border-b-2 border-white bg-transparent"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            }
            `}
                    >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                    </Button>
                )
            })}

            {/* Add new view button */}
            <div className="ml-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white hover:bg-slate-800/50 p-2"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default NavigationTabs
