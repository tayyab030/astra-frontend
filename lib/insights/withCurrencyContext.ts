import { formatCurrencyAmount } from "@/lib/currency/format"

/** Context keys that hold money amounts (or nested money fields). */
const MONEY_KEYS = new Set([
  "spendingToday",
  "budgetToday",
  "spending",
  "budget",
  "monthlyIncome",
  "monthlyExpenses",
  "periodNet",
  "wasteSpending",
  "netSavings",
  "net_worth",
  "monthly_income",
  "monthly_expenses",
  "net_savings",
  "waste_spending",
  "income",
  "expenses",
  "total",
  "value",
  "amount",
  "limit",
  "spent",
  "remaining",
])

function transformValue(
  key: string | null,
  value: unknown,
  currencyCode: string
): unknown {
  if (value == null) return value

  if (Array.isArray(value)) {
    return value.map((item) => transformValue(null, item, currencyCode))
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>
    const next: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      next[k] = transformValue(k, v, currencyCode)
    }
    return next
  }

  if (typeof value === "number" && Number.isFinite(value) && key && MONEY_KEYS.has(key)) {
    return {
      amount: value,
      formatted: formatCurrencyAmount(value, currencyCode, undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
      currency: currencyCode,
    }
  }

  return value
}

/**
 * Enrich AI insight context with the user's account currency.
 * Amounts are already in that currency — no FX conversion.
 */
export function withCurrencyInsightContext(
  context: Record<string, unknown>,
  currencyCode: string,
  _rates?: Record<string, number>
): Record<string, unknown> {
  return transformValue(null, context, currencyCode) as Record<string, unknown>
}
