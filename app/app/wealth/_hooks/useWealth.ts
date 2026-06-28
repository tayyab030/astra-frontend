"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { WealthFilter } from "@/lib/api/wealth"
import {
  createWealthSaving,
  createWealthTransaction,
  deleteWealthSaving,
  deleteWealthTransaction,
  fetchWealthDashboard,
  getWealthErrorMessage,
  updateWealthSaving,
  updateWealthTransaction,
  withdrawWealthSaving,
  type CreateSavingPayload,
  type CreateTransactionPayload,
  type UpdateSavingPayload,
  type UpdateTransactionPayload,
  type WithdrawSavingPayload,
} from "@/lib/api/wealth"

export function useWealth(filter: WealthFilter) {
  const queryClient = useQueryClient()

  const invalidateWealth = () => {
    queryClient.invalidateQueries({ queryKey: ["wealth"] })
  }

  const dashboardQuery = useQuery({
    queryKey: ["wealth", "dashboard", filter],
    queryFn: () => fetchWealthDashboard(filter),
  })

  const createTransactionMutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) => createWealthTransaction(payload),
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
      updateWealthTransaction(id, payload),
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

  const createSavingMutation = useMutation({
    mutationFn: (payload: CreateSavingPayload) => createWealthSaving(payload),
    onSuccess: () => {
      toast.success("Saving added")
      invalidateWealth()
    },
    onError: (error) => {
      toast.error(getWealthErrorMessage(error, "Failed to add saving"))
    },
  })

  const withdrawSavingMutation = useMutation({
    mutationFn: (payload: WithdrawSavingPayload) => withdrawWealthSaving(payload),
    onSuccess: () => {
      toast.success("Saving withdrawn")
      invalidateWealth()
    },
    onError: (error) => {
      toast.error(getWealthErrorMessage(error, "Failed to withdraw saving"))
    },
  })

  const updateSavingMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSavingPayload }) =>
      updateWealthSaving(id, payload),
    onSuccess: () => {
      toast.success("Saving updated")
      invalidateWealth()
    },
    onError: (error) => {
      toast.error(getWealthErrorMessage(error, "Failed to update saving"))
    },
  })

  const deleteSavingMutation = useMutation({
    mutationFn: (id: string) => deleteWealthSaving(id),
    onSuccess: () => {
      toast.success("Saving deleted")
      invalidateWealth()
    },
    onError: (error) => {
      toast.error(getWealthErrorMessage(error, "Failed to delete saving"))
    },
  })

  return {
    dashboard: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    refetch: dashboardQuery.refetch,
    createTransaction: createTransactionMutation.mutateAsync,
    updateTransaction: ({ id, data }: { id: string; data: UpdateTransactionPayload }) =>
      updateTransactionMutation.mutateAsync({ id, payload: data }),
    deleteTransaction: deleteTransactionMutation.mutateAsync,
    createSaving: createSavingMutation.mutateAsync,
    withdrawSaving: withdrawSavingMutation.mutateAsync,
    updateSaving: ({ id, data }: { id: string; data: UpdateSavingPayload }) =>
      updateSavingMutation.mutateAsync({ id, payload: data }),
    deleteSaving: deleteSavingMutation.mutateAsync,
    isCreatingTransaction: createTransactionMutation.isPending,
    isUpdatingTransaction: updateTransactionMutation.isPending,
    isDeletingTransaction: deleteTransactionMutation.isPending,
    isCreatingSaving: createSavingMutation.isPending,
    isWithdrawingSaving: withdrawSavingMutation.isPending,
    isUpdatingSaving: updateSavingMutation.isPending,
    isDeletingSaving: deleteSavingMutation.isPending,
  }
}
