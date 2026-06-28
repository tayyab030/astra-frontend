import { authApi } from "./simpleApi"
import { API_ENDPOINTS } from "./endpoints"

const { WEALTH } = API_ENDPOINTS

export type WealthFilterMode = "month" | "year"

export interface WealthMonthFilter {
  mode: "month"
  year: number
  month: number
}

export interface WealthYearFilter {
  mode: "year"
  startYear: number
  endYear: number
}

export type WealthFilter = WealthMonthFilter | WealthYearFilter

export type WealthCategoryValue =
  | "food"
  | "transport"
  | "housing"
  | "shopping"
  | "entertainment"
  | "waste"
  | "other"
  | "income"

export interface WealthTransaction {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

export interface WealthSaving {
  id: string
  amount: number
  month: string
  type: "deposit" | "withdrawal"
  reason?: string
}

export interface WealthCategoryTotal {
  value: string
  label: string
  total: number
}

export interface WealthDashboard {
  filter:
    | { mode: "month"; year: number; month: number }
    | { mode: "year"; start_year: number; end_year: number }
  net_worth: number
  monthly_income: number
  monthly_expenses: number
  net_savings: number
  waste_spending: number
  savings_balance: number
  transactions: WealthTransaction[]
  savings: WealthSaving[]
  category_totals: WealthCategoryTotal[]
}

export interface CreateTransactionPayload {
  description: string
  amount: number
  category: WealthCategoryValue
  date: string
}

export interface UpdateTransactionPayload {
  description?: string
  amount?: number
  category?: WealthCategoryValue
  date?: string
}

export interface CreateSavingPayload {
  amount: number
  month: string
}

export interface WithdrawSavingPayload {
  amount: number
  month: string
  reason: string
}

export interface UpdateSavingPayload {
  amount?: number
  month?: string
  reason?: string
}

export function buildWealthFilterParams(filter: WealthFilter) {
  if (filter.mode === "month") {
    return {
      mode: filter.mode,
      year: filter.year,
      month: filter.month,
    }
  }

  return {
    mode: filter.mode,
    start_year: filter.startYear,
    end_year: filter.endYear,
  }
}

export function getWealthErrorMessage(error: unknown, fallback: string) {
  const responseData = (error as { response?: { data?: Record<string, unknown> } })?.response?.data

  if (!responseData) return fallback

  if (typeof responseData.detail === "string") return responseData.detail
  if (typeof responseData.message === "string") return responseData.message

  const firstFieldError = Object.values(responseData).find(
    (value) => Array.isArray(value) && typeof value[0] === "string"
  ) as string[] | undefined

  return firstFieldError?.[0] ?? fallback
}

export async function fetchWealthDashboard(filter: WealthFilter) {
  const response = await authApi.get<WealthDashboard>(WEALTH.DASHBOARD, {
    params: buildWealthFilterParams(filter),
  })
  return response.data
}

export async function createWealthTransaction(payload: CreateTransactionPayload) {
  const response = await authApi.post<WealthTransaction>(WEALTH.TRANSACTIONS, payload)
  return response.data
}

export async function updateWealthTransaction(id: string, payload: UpdateTransactionPayload) {
  const response = await authApi.patch<WealthTransaction>(WEALTH.TRANSACTION(id), payload)
  return response.data
}

export async function deleteWealthTransaction(id: string) {
  const response = await authApi.delete<{ message: string }>(WEALTH.TRANSACTION(id))
  return response.data
}

export async function createWealthSaving(payload: CreateSavingPayload) {
  const response = await authApi.post<WealthSaving>(WEALTH.SAVINGS, payload)
  return response.data
}

export async function withdrawWealthSaving(payload: WithdrawSavingPayload) {
  const response = await authApi.post<WealthSaving>(WEALTH.SAVINGS_WITHDRAW, payload)
  return response.data
}

export async function updateWealthSaving(id: string, payload: UpdateSavingPayload) {
  const response = await authApi.patch<WealthSaving>(WEALTH.SAVING(id), payload)
  return response.data
}

export async function deleteWealthSaving(id: string) {
  const response = await authApi.delete<{ message: string }>(WEALTH.SAVING(id))
  return response.data
}
