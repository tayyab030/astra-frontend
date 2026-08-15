import type { LucideIcon } from "lucide-react"
import { BookOpen, Briefcase, DollarSign, Heart, Users } from "lucide-react"
import type { GoalCategoryValue } from "@/lib/api/goals"

export const GOAL_CATEGORIES = [
  { value: "wealth", label: "Wealth" },
  { value: "health", label: "Health" },
  { value: "work", label: "Work" },
  { value: "knowledge", label: "Knowledge" },
  { value: "relationships", label: "Relationships" },
] as const

export const GOAL_PRIORITIES = ["high", "medium", "low"] as const

export const CATEGORY_COLORS: Record<GoalCategoryValue, string> = {
  wealth: "from-cyan-500 to-blue-600",
  health: "from-cyan-400 to-blue-500",
  work: "from-blue-500 to-cyan-600",
  knowledge: "from-cyan-500 to-blue-600",
  relationships: "from-blue-400 to-cyan-500",
}

export const CATEGORY_ICONS: Record<GoalCategoryValue, LucideIcon> = {
  wealth: DollarSign,
  health: Heart,
  work: Briefcase,
  knowledge: BookOpen,
  relationships: Users,
}
