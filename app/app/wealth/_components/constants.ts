import {
  AlertTriangle,
  Car,
  Coffee,
  Home,
  ShoppingBag,
  Smartphone,
  Tags,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const WEALTH_TABS = [
  { value: "overview", label: "Overview" },
  { value: "budget", label: "Budget" },
  { value: "categories", label: "Categories" },
  { value: "transactions", label: "Transactions" },
] as const

export const BUDGET_CATEGORY_STYLES: Record<
  string,
  { icon: LucideIcon; color: string }
> = {
  food: { icon: Coffee, color: "from-orange-500 to-red-500" },
  transport: { icon: Car, color: "from-blue-500 to-cyan-500" },
  housing: { icon: Home, color: "from-green-500 to-emerald-500" },
  shopping: { icon: ShoppingBag, color: "from-purple-500 to-pink-500" },
  entertainment: { icon: Smartphone, color: "from-indigo-500 to-purple-500" },
  waste: { icon: AlertTriangle, color: "from-orange-500 to-amber-500" },
  other: { icon: Tags, color: "from-slate-500 to-slate-600" },
}

export const WEALTH_EXPENSE_CATEGORIES = [
  { value: "food", label: "Food & Dining" },
  { value: "transport", label: "Transportation" },
  { value: "housing", label: "Housing" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "waste", label: "Waste Spending" },
  { value: "other", label: "Other" },
] as const

export const WEALTH_INCOME_CATEGORIES = [
  { value: "salary", label: "Salary" },
  { value: "freelancing", label: "Freelancing" },
  { value: "bonus", label: "Bonus" },
  { value: "gift", label: "Gift" },
  { value: "income_other", label: "Other" },
] as const

/** Legacy single income category — kept for existing records */
export const LEGACY_INCOME_CATEGORY = "income" as const

export const WEALTH_CATEGORIES = [...WEALTH_EXPENSE_CATEGORIES, ...WEALTH_INCOME_CATEGORIES] as const

export type WealthCategoryValue = (typeof WEALTH_CATEGORIES)[number]["value"] | typeof LEGACY_INCOME_CATEGORY

export const INCOME_CATEGORY_VALUES = [
  ...WEALTH_INCOME_CATEGORIES.map((category) => category.value),
  LEGACY_INCOME_CATEGORY,
] as const

export function isIncomeCategory(value: string) {
  return INCOME_CATEGORY_VALUES.includes(value as (typeof INCOME_CATEGORY_VALUES)[number])
}

export function getCategoryLabel(value: string) {
  if (value === LEGACY_INCOME_CATEGORY) {
    return "Income"
  }

  return WEALTH_CATEGORIES.find((category) => category.value === value)?.label ?? value
}

export function getCategoryValue(label: string): WealthCategoryValue {
  const match = WEALTH_CATEGORIES.find((category) => category.label === label)
  if (match) {
    return match.value
  }

  if (label === "Income") {
    return LEGACY_INCOME_CATEGORY
  }

  return "other"
}

export type AiInsightType = "success" | "warning" | "tip" | "prediction"

export interface AiInsight {
  type: AiInsightType
  message: string
}

export function getAiInsights(formatCurrency: (amount: number) => string): AiInsight[] {
  return [
    { type: "success", message: "🎉 You saved 20% more than last month! Keep up the great work." },
    {
      type: "warning",
      message: "⚠️ Your shopping expenses are 50% over budget. Consider reducing non-essential purchases.",
    },
    {
      type: "tip",
      message: `💡 You spent ${formatCurrency(125)} on coffee this month. Making coffee at home could save you ${formatCurrency(90)}/month.`,
    },
    {
      type: "prediction",
      message: "📈 At your current savings rate, you'll reach your emergency fund goal 2 months early!",
    },
  ]
}
