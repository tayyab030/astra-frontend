import { BarChart3, CalendarDays, Clock, FileText, Settings } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { DateRangePreset } from "../_types/timeTrack.types"

export const TIME_TRACK_TABS = [
  { id: "timer", label: "Timer", icon: Clock },
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "weekly", label: "Weekly", icon: CalendarDays },
  { id: "settings", label: "Settings", icon: Settings },
] as const

export type TimeTrackTabId = (typeof TIME_TRACK_TABS)[number]["id"]

export const ACTIVITY_BAR_OPTIONS = [
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
] as const

export const DATE_RANGE_PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "custom", label: "Custom" },
]

export const TASK_PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-500/20 text-red-300 border-red-500/30",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  low: "bg-slate-500/20 text-slate-300 border-slate-500/30",
}

export const CHART_CLASS_NAME =
  "h-64 w-full aspect-auto [&_.recharts-cartesian-axis-tick_text]:fill-slate-400 [&_.recharts-cartesian-grid_line]:stroke-slate-700/40"

export const TAB_ICONS: Record<TimeTrackTabId, LucideIcon> = Object.fromEntries(
  TIME_TRACK_TABS.map((tab) => [tab.id, tab.icon])
) as Record<TimeTrackTabId, LucideIcon>
