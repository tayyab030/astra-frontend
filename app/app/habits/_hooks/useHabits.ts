"use client"

import { useCallback, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format, subDays } from "date-fns"
import { toast } from "sonner"
import {
  createHealthHabit,
  deleteHealthHabit,
  fetchHealthDashboard,
  getHealthErrorMessage,
  toggleHealthHabit,
  updateHealthHabit,
} from "@/lib/api/health"
import { healthKeys } from "../../health/_hooks/queryKeys"
import { getLocalDateString } from "../../health/_utils/date"
import { habitsKeys } from "./queryKeys"

export function useHabits() {
  const queryClient = useQueryClient()

  const fetchRange = useMemo(() => {
    const today = getLocalDateString()
    const startDate = format(subDays(new Date(), 7), "yyyy-MM-dd")
    return { startDate, endDate: today, todayDate: today }
  }, [])

  const habitsQuery = useQuery({
    queryKey: habitsKeys.list(),
    queryFn: () =>
      fetchHealthDashboard({
        start_date: fetchRange.startDate,
        end_date: fetchRange.endDate,
        today_date: fetchRange.todayDate,
      }),
    select: (data) => data.habits,
    staleTime: 30_000,
  })

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: habitsKeys.all })
    queryClient.invalidateQueries({ queryKey: healthKeys.all })
  }, [queryClient])

  const toggleHabitMutation = useMutation({
    mutationFn: toggleHealthHabit,
    onSuccess: () => invalidate(),
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to update habit")),
  })

  const createHabitMutation = useMutation({
    mutationFn: createHealthHabit,
    onSuccess: () => {
      toast.success("Habit created")
      invalidate()
    },
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to create habit")),
  })

  const updateHabitMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: { name?: string; frequency?: string; target?: number }
    }) => updateHealthHabit(id, payload),
    onSuccess: () => {
      toast.success("Habit updated")
      invalidate()
    },
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to update habit")),
  })

  const deleteHabitMutation = useMutation({
    mutationFn: deleteHealthHabit,
    onSuccess: () => {
      toast.success("Habit deleted")
      invalidate()
    },
    onError: (error) => toast.error(getHealthErrorMessage(error, "Failed to delete habit")),
  })

  const habits = habitsQuery.data ?? []
  const completedCount = habits.filter((habit) => habit.completed).length
  const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0)

  return {
    habits,
    completedCount,
    longestStreak,
    isLoading: habitsQuery.isLoading && !habitsQuery.data,
    isSaving:
      toggleHabitMutation.isPending ||
      createHabitMutation.isPending ||
      updateHabitMutation.isPending ||
      deleteHabitMutation.isPending,
    toggleHabit: (id: string) => toggleHabitMutation.mutate(id),
    createHabit: (name: string, frequency?: string, target?: number) =>
      createHabitMutation.mutateAsync({ name, frequency, target }),
    updateHabit: (id: string, payload: { name?: string; frequency?: string; target?: number }) =>
      updateHabitMutation.mutateAsync({ id, payload }),
    deleteHabit: (id: string) => deleteHabitMutation.mutateAsync(id),
    refetch: habitsQuery.refetch,
  }
}

export type UseHabitsReturn = ReturnType<typeof useHabits>
