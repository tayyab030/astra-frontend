"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  Bot,
  CheckSquare,
  Clock,
  DollarSign,
  Dumbbell,
  FileText,
  Flame,
  Scale,
  Smile,
  Target,
  Wallet,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"

interface QuickActionItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
}

const DASHBOARD_QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: "add-task",
    label: "Add Task",
    href: `${ROUTES.APP.TASKS}?action=create`,
    icon: CheckSquare,
  },
  {
    id: "log-expense",
    label: "Log Expense",
    href: `${ROUTES.APP.WEALTH}?tab=transactions&action=add`,
    icon: DollarSign,
  },
  {
    id: "add-habit",
    label: "Add Habit",
    href: `${ROUTES.APP.HABITS}?action=add`,
    icon: Flame,
  },
  {
    id: "quick-note",
    label: "Quick Note",
    href: `${ROUTES.APP.NOTES}?tab=quick-notes&action=create`,
    icon: FileText,
  },
  {
    id: "add-goal",
    label: "Add Goal",
    href: `${ROUTES.APP.GOALS}?action=add`,
    icon: Target,
  },
  {
    id: "log-workout",
    label: "Log Workout",
    href: `${ROUTES.APP.HEALTH}?tab=exercise&action=log-workout`,
    icon: Dumbbell,
  },
  {
    id: "log-weight",
    label: "Log Weight",
    href: `${ROUTES.APP.HEALTH}?tab=weight`,
    icon: Scale,
  },
  {
    id: "mood-checkin",
    label: "Mood Check-in",
    href: `${ROUTES.APP.HEALTH}?tab=wellness`,
    icon: Smile,
  },
  {
    id: "track-time",
    label: "Track Time",
    href: `${ROUTES.APP.TIME_TRACK}?tab=timer&action=add-task`,
    icon: Clock,
  },
  {
    id: "ask-assistant",
    label: "Ask Assistant",
    href: ROUTES.APP.ASSISTANT,
    icon: Bot,
  },
  {
    id: "set-budget",
    label: "Set Budget",
    href: `${ROUTES.APP.WEALTH}?tab=budget&action=set-limit`,
    icon: Wallet,
  },
]

export function QuickActions() {
  return (
    <Card className="astra-card">
      <CardHeader>
        <CardTitle className="text-primary">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DASHBOARD_QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                asChild
                variant="outline"
                className="h-20 flex-col astra-panel text-primary hover:text-primary"
              >
                <Link href={action.href}>
                  <Icon className="h-5 w-5 mb-2" />
                  <span className="text-center text-xs sm:text-sm leading-tight">
                    {action.label}
                  </span>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
