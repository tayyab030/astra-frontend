import { CheckSquare, FileText, Moon, type LucideIcon } from "lucide-react"

/** Placeholder AI copy — kept static until insights API exists. */
export const STATIC_DAILY_AI_INSIGHT =
  "You're on track in Wealth & Health, but Productivity dropped 15% this week."

export const STATIC_MONTHLY_AI_INSIGHT =
  "You saved 12% more than last month but slept 30 min less per night."

export const STATIC_CROSS_DOMAIN_INSIGHTS: {
  title: string
  insight: string
  icon: LucideIcon
}[] = [
  {
    title: "Sleep & Spending Correlation",
    insight: "On weeks you sleep less, your food spending rises 25% (late-night snacks).",
    icon: Moon,
  },
  {
    title: "Tasks & Mood Connection",
    insight: "On days with fewer overdue tasks, you reported better mood.",
    icon: CheckSquare,
  },
  {
    title: "Notes & Goals Link",
    insight: "You wrote 4 notes about fitness — link them to your Health Goal?",
    icon: FileText,
  },
]

export const STATIC_AI_STORY_OF_WEEK =
  "This week you worked 20% more hours, slept 1 hour less per night, and spent 10% more on coffee ☕."

export const STATIC_AI_PREDICTIONS = [
  "If you keep this pace, your Life Score will reach 90/100 in 2 months.",
  "At this savings rate, you'll reach your savings goal by December.",
]

export const STATIC_AI_COACH = [
  {
    label: "Next Week Focus",
    text: "Prioritize sleep + budgeting for optimal performance.",
  },
  {
    label: "Scenario",
    text: "Cut dining spend + add 2 workouts = Life Score boost.",
  },
]

export const STATIC_GOAL_AI_PREDICTION =
  "Keep your top goal streak going — consistent daily progress compounds fastest."
