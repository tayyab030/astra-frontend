import {
  Activity,
  BarChart3,
  Brain,
  Droplets,
  Flame,
  LayoutDashboard,
  Scale,
  type LucideIcon,
} from "lucide-react"
import type { HealthTabId } from "../_types/health.types"

export const HEALTH_TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "weight", label: "Weight", icon: Scale },
  { id: "tracking", label: "Tracking", icon: Droplets },
  { id: "habits", label: "Habits", icon: Flame },
  { id: "exercise", label: "Exercise", icon: Activity },
  { id: "wellness", label: "Wellness", icon: Brain },
  { id: "insights", label: "Insights", icon: BarChart3 },
] as const satisfies readonly { id: HealthTabId; label: string; icon: LucideIcon }[]

export const CHART_CLASS_NAME =
  "h-64 w-full aspect-auto [&_.recharts-cartesian-axis-tick_text]:fill-slate-400 [&_.recharts-cartesian-grid_line]:stroke-slate-700/40"

export const MOOD_OPTIONS = [
  { value: "great", label: "Great", color: "text-green-400" },
  { value: "good", label: "Good", color: "text-blue-400" },
  { value: "okay", label: "Okay", color: "text-yellow-400" },
  { value: "bad", label: "Bad", color: "text-orange-400" },
  { value: "terrible", label: "Terrible", color: "text-red-400" },
] as const

export const METRIC_STEP = {
  water: 1,
  sleep: 0.5,
  exercise: 5,
} as const
