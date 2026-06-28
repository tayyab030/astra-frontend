export const WEALTH_TABS = [
  { value: "overview", label: "Overview" },
  { value: "categories", label: "Categories" },
  { value: "savings", label: "Savings" },
  { value: "transactions", label: "Transactions" },
] as const

export const WEALTH_CATEGORIES = [
  { value: "food", label: "Food & Dining" },
  { value: "transport", label: "Transportation" },
  { value: "housing", label: "Housing" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "waste", label: "Waste Spending" },
  { value: "other", label: "Other" },
  { value: "income", label: "Income" },
] as const

export type WealthCategoryValue = (typeof WEALTH_CATEGORIES)[number]["value"]

export function getCategoryLabel(value: string) {
  return WEALTH_CATEGORIES.find((category) => category.value === value)?.label ?? value
}

export function getCategoryValue(label: string) {
  return WEALTH_CATEGORIES.find((category) => category.label === label)?.value ?? "other"
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
