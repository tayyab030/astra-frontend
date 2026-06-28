export function getBudgetStatus(spent: number, limit: number) {
  const percentage = limit > 0 ? (spent / limit) * 100 : 0

  if (percentage >= 100) {
    return { color: "text-red-400", status: "Over Budget" as const }
  }

  if (percentage >= 80) {
    return { color: "text-yellow-400", status: "Near Limit" as const }
  }

  return { color: "text-green-400", status: "On Track" as const }
}

export function formatBudgetPeriod(
  periodType: "month" | "year",
  year: number,
  month?: number,
) {
  if (periodType === "year") {
    return String(year)
  }

  const date = new Date(year, (month ?? 1) - 1, 1)
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}
