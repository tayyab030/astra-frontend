"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { WealthDashboard, WealthFilter, WealthScope } from "@/lib/api/wealth"
import {
  createWealthCategoryBudget,
  createWealthTransaction,
  deleteWealthCategoryBudget,
  deleteWealthTransaction,
  fetchWealthDashboard,
  getWealthErrorMessage,
  updateWealthCategoryBudget,
  updateWealthTransaction,
  type CreateCategoryBudgetPayload,
  type CreateTransactionPayload,
  type UpdateCategoryBudgetPayload,
  type UpdateTransactionPayload,
} from "@/lib/api/wealth"

function emptyDashboard(): WealthDashboard {
  return {
    filter: { mode: "month", year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
    net_worth: 0,
    monthly_income: 0,
    monthly_expenses: 0,
    net_savings: 0,
    waste_spending: 0,
    transactions: [],
    category_totals: [],
    income_category_totals: [],
    category_budgets: [],
  }
}

export function useWealth(filter: WealthFilter) {
  const queryClient = useQueryClient()

  const invalidateWealth = () => {
    queryClient.invalidateQueries({ queryKey: ["wealth"] })
  }

  const personalQuery = useQuery({
    queryKey: ["wealth", "dashboard", "personal", filter],
    queryFn: () => fetchWealthDashboard(filter, "personal"),
  })

  const farmQuery = useQuery({
    queryKey: ["wealth", "dashboard", "farm", filter],
    queryFn: () => fetchWealthDashboard(filter, "farm"),
  })

  const personal = personalQuery.data
  const farm = farmQuery.data

  const combined = {
    net_worth: (personal?.net_worth ?? 0) + (farm?.net_worth ?? 0),
    monthly_income: (personal?.monthly_income ?? 0) + (farm?.monthly_income ?? 0),
    monthly_expenses: (personal?.monthly_expenses ?? 0) + (farm?.monthly_expenses ?? 0),
    waste_spending: personal?.waste_spending ?? 0,
  }

  const createTransactionMutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      createWealthTransaction({ ...payload, scope: "personal" }),
    onSuccess: () => {
      toast.success("Transaction added")
      invalidateWealth()
    },
    onError: (error) => {
      toast.error(getWealthErrorMessage(error, "Failed to add transaction"))
    },
  })

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionPayload }) =>
      updateWealthTransaction(id, { ...payload, scope: "personal" }),
    onSuccess: () => {
      toast.success("Transaction updated")
      invalidateWealth()
    },
    onError: (error) => {
      toast.error(getWealthErrorMessage(error, "Failed to update transaction"))
    },
  })

  const deleteTransactionMutation = useMutation({
    mutationFn: (id: string) => deleteWealthTransaction(id),
    onSuccess: () => {
      toast.success("Transaction deleted")
      invalidateWealth()
    },
    onError: (error) => {
      toast.error(getWealthErrorMessage(error, "Failed to delete transaction"))
    },
  })

  const createBudgetMutation = useMutation({
    mutationFn: (payload: CreateCategoryBudgetPayload) =>
      createWealthCategoryBudget({ ...payload, scope: "personal" }),
    onSuccess: () => {
      toast.success("Budget limit added")
      invalidateWealth()
    },
    onError: (error) => {
      toast.error(getWealthErrorMessage(error, "Failed to add budget limit"))
    },
  })

  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryBudgetPayload }) =>
      updateWealthCategoryBudget(id, payload),
    onSuccess: () => {
      toast.success("Budget limit updated")
      invalidateWealth()
    },
    onError: (error) => {
      toast.error(getWealthErrorMessage(error, "Failed to update budget limit"))
    },
  })

  const deleteBudgetMutation = useMutation({
    mutationFn: (id: string) => deleteWealthCategoryBudget(id),
    onSuccess: () => {
      toast.success("Budget limit deleted")
      invalidateWealth()
    },
    onError: (error) => {
      toast.error(getWealthErrorMessage(error, "Failed to delete budget limit"))
    },
  })

  const dashboardFor = (scope: WealthScope) =>
    (scope === "farm" ? farm : personal) ?? emptyDashboard()

  return {
    personal,
    farm,
    combined,
    dashboardFor,
    isLoading: personalQuery.isLoading || farmQuery.isLoading,
    isError: personalQuery.isError || farmQuery.isError,
    createTransaction: createTransactionMutation.mutateAsync,
    updateTransaction: ({ id, data }: { id: string; data: UpdateTransactionPayload }) =>
      updateTransactionMutation.mutateAsync({ id, payload: data }),
    deleteTransaction: deleteTransactionMutation.mutateAsync,
    createBudget: createBudgetMutation.mutateAsync,
    updateBudget: ({ id, data }: { id: string; data: UpdateCategoryBudgetPayload }) =>
      updateBudgetMutation.mutateAsync({ id, payload: data }),
    deleteBudget: deleteBudgetMutation.mutateAsync,
    isCreatingTransaction: createTransactionMutation.isPending,
    isUpdatingTransaction: updateTransactionMutation.isPending,
    isDeletingTransaction: deleteTransactionMutation.isPending,
    isCreatingBudget: createBudgetMutation.isPending,
    isUpdatingBudget: updateBudgetMutation.isPending,
    isDeletingBudget: deleteBudgetMutation.isPending,
  }
}
