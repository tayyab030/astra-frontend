"use client"

import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { isAfter, isBefore, parseISO, startOfDay } from "date-fns"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type {
  CreateGoalPayload,
  CreateMilestonePayload,
  Goal,
  UpdateGoalPayload,
  UpdateMilestonePayload,
} from "@/lib/api/goals"
import { goalDefaultValues, goalSchema, isValidGoalDate, type GoalFormValues } from "../_schemas/goals.schema"
import { FormFieldError } from "../../wealth/_components/FormFieldError"
import { GOAL_CATEGORIES } from "./constants"
import { cn } from "@/lib/utils"

const inputClassName = "bg-slate-700/50 border-slate-600 text-slate-100"

function isBeforeDateString(date: Date, dateString: string) {
  return isBefore(startOfDay(date), startOfDay(parseISO(dateString)))
}

function isAfterDateString(date: Date, dateString: string) {
  return isAfter(startOfDay(date), startOfDay(parseISO(dateString)))
}

function goalToFormValues(goal: Goal): GoalFormValues {
  return {
    title: goal.title,
    category: goal.category,
    priority: goal.priority,
    motivation: goal.motivation,
    start_date: goal.start_date,
    target_date: goal.target_date,
    milestones: goal.milestones.map((milestone) => ({
      id: milestone.id,
      title: milestone.title,
      due_date: milestone.due_date,
    })),
  }
}

function getFilledMilestones(milestones: GoalFormValues["milestones"]) {
  return milestones
    .filter((milestone) => milestone.title.trim() && milestone.due_date)
    .map((milestone) => ({
      id: milestone.id,
      title: milestone.title.trim(),
      due_date: milestone.due_date,
    }))
}

interface GoalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  goal?: Goal | null
  onCreate: (payload: CreateGoalPayload) => Promise<unknown>
  onUpdate: (payload: { id: string; data: UpdateGoalPayload }) => Promise<unknown>
  onCreateMilestone: (payload: { goalId: string; data: CreateMilestonePayload }) => Promise<unknown>
  onUpdateMilestone: (payload: {
    goalId: string
    milestoneId: string
    data: UpdateMilestonePayload
  }) => Promise<unknown>
  onDeleteMilestone: (payload: { goalId: string; milestoneId: string }) => Promise<unknown>
  isSubmitting?: boolean
}

export function GoalFormDialog({
  open,
  onOpenChange,
  mode,
  goal,
  onCreate,
  onUpdate,
  onCreateMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
  isSubmitting,
}: GoalFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: goalDefaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "milestones",
  })

  const startDate = watch("start_date")
  const targetDate = watch("target_date")

  const handleStartDateChange = async (value: string) => {
    setValue("start_date", value, { shouldValidate: true })
    if (isValidGoalDate(targetDate)) {
      await trigger("target_date")
    }
    if (fields.length > 0) {
      await trigger("milestones")
    }
  }

  const handleTargetDateChange = async (value: string) => {
    setValue("target_date", value, { shouldValidate: true })
    if (isValidGoalDate(startDate)) {
      await trigger("start_date")
    }
    if (fields.length > 0) {
      await trigger("milestones")
    }
  }

  const isStartDateDisabled = (date: Date) => {
    if (!isValidGoalDate(targetDate)) return false
    return isAfterDateString(date, targetDate)
  }

  const isTargetDateDisabled = (date: Date) => {
    if (!isValidGoalDate(startDate)) return false
    return isBeforeDateString(date, startDate)
  }

  const isMilestoneDueDateDisabled = (date: Date) => {
    if (isValidGoalDate(startDate) && isBeforeDateString(date, startDate)) return true
    if (isValidGoalDate(targetDate) && isAfterDateString(date, targetDate)) return true
    return false
  }

  useEffect(() => {
    if (!open) return

    if (mode === "edit" && goal) {
      reset(goalToFormValues(goal))
      return
    }

    reset(goalDefaultValues)
  }, [open, mode, goal, reset])

  const handleClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
    if (!nextOpen) reset(goalDefaultValues)
  }

  const syncMilestones = async (goalId: string, milestones: ReturnType<typeof getFilledMilestones>) => {
    if (!goal) return

    const originalMilestones = goal.milestones
    const nextIds = new Set(milestones.filter((milestone) => milestone.id).map((milestone) => milestone.id!))

    for (const original of originalMilestones) {
      if (!nextIds.has(original.id)) {
        await onDeleteMilestone({ goalId, milestoneId: original.id })
      }
    }

    for (const milestone of milestones) {
      if (milestone.id) {
        const original = originalMilestones.find((entry) => entry.id === milestone.id)
        if (
          original &&
          (original.title !== milestone.title || original.due_date !== milestone.due_date)
        ) {
          await onUpdateMilestone({
            goalId,
            milestoneId: milestone.id,
            data: { title: milestone.title, due_date: milestone.due_date },
          })
        }
        continue
      }

      await onCreateMilestone({
        goalId,
        data: { title: milestone.title, due_date: milestone.due_date },
      })
    }
  }

  const submit = handleSubmit(async (data) => {
    const milestones = getFilledMilestones(data.milestones)
    const motivation = (data.motivation ?? "").trim()
    const payload = {
      title: data.title,
      category: data.category as CreateGoalPayload["category"],
      priority: data.priority,
      motivation: motivation || undefined,
      start_date: data.start_date,
      target_date: data.target_date,
    }

    setIsSaving(true)
    try {
      if (mode === "edit" && goal) {
        await onUpdate({
          id: goal.id,
          data: {
            ...payload,
            motivation,
          },
        })
        await syncMilestones(goal.id, milestones)
      } else {
        await onCreate({
          ...payload,
          milestones: milestones.map(({ title, due_date }) => ({ title, due_date })),
        })
      }

      handleClose(false)
    } finally {
      setIsSaving(false)
    }
  })

  const saving = isSaving || isSubmitting

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-cyan-300">
            {mode === "edit" ? "Edit Goal" : "Create New Goal"}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {mode === "edit"
              ? "Update your goal details and keep tracking your progress."
              : "Set a new goal to track your progress and achieve success."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-200">Goal Title</Label>
            <Input placeholder="e.g., Save for vacation" className={inputClassName} {...register("title")} />
            <FormFieldError message={errors.title?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 min-w-0">
              <Label className="text-sm font-medium text-slate-200">Category</Label>
              <Select
                value={watch("category")}
                onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
              >
                <SelectTrigger className={cn(inputClassName, "w-full")}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {GOAL_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormFieldError message={errors.category?.message} />
            </div>
            <div className="space-y-2 min-w-0">
              <Label className="text-sm font-medium text-slate-200">Priority</Label>
              <Select
                value={watch("priority")}
                onValueChange={(value: GoalFormValues["priority"]) =>
                  setValue("priority", value, { shouldValidate: true })
                }
              >
                <SelectTrigger className={cn(inputClassName, "w-full")}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <FormFieldError message={errors.priority?.message} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-200">Start Date</Label>
              <DatePicker
                value={startDate}
                onChange={(value) => value && handleStartDateChange(value)}
                placeholder="Pick start date"
                className="space-y-0"
                disabled={isStartDateDisabled}
                buttonClassName={cn(inputClassName, errors.start_date && "border-red-500/70")}
              />
              <FormFieldError message={errors.start_date?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-200">Target Date</Label>
              <DatePicker
                value={targetDate}
                onChange={(value) => value && handleTargetDateChange(value)}
                placeholder="Pick target date"
                className="space-y-0"
                disabled={isTargetDateDisabled}
                buttonClassName={cn(inputClassName, errors.target_date && "border-red-500/70")}
              />
              <FormFieldError message={errors.target_date?.message} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-medium text-slate-200">Milestones</Label>
                <p className="text-xs text-slate-400 mt-1">
                  Break your goal into steps. Progress is calculated from completed milestones.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50 shrink-0"
                onClick={() => append({ title: "", due_date: "" })}
                disabled={fields.length >= 20}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </div>

            {fields.length > 0 ? (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-[1fr_auto_auto] gap-2 items-start rounded-lg border border-slate-600/40 bg-slate-900/20 p-3"
                  >
                    <div className="space-y-2 min-w-0">
                      <input type="hidden" {...register(`milestones.${index}.id`)} />
                      <Input
                        placeholder="Milestone title"
                        className={inputClassName}
                        {...register(`milestones.${index}.title`)}
                      />
                      <FormFieldError message={errors.milestones?.[index]?.title?.message} />
                    </div>
                    <div className="space-y-2 w-[148px] shrink-0">
                      <DatePicker
                        value={watch(`milestones.${index}.due_date`)}
                        onChange={(value) =>
                          value &&
                          setValue(`milestones.${index}.due_date`, value, { shouldValidate: true })
                        }
                        placeholder="Due date"
                        className="space-y-0"
                        disabled={isMilestoneDueDateDisabled}
                        buttonClassName={cn(
                          inputClassName,
                          "h-10 px-2 text-sm",
                          errors.milestones?.[index]?.due_date && "border-red-500/70",
                        )}
                      />
                      <FormFieldError message={errors.milestones?.[index]?.due_date?.message} />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                      onClick={() => remove(index)}
                      aria-label="Remove milestone"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No milestones yet. Add steps to track progress.</p>
            )}
            <FormFieldError message={errors.milestones?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-200">Motivation (Why this matters)</Label>
            <Textarea
              placeholder="Describe why this goal is important to you..."
              className={inputClassName}
              {...register("motivation")}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
            >
              {mode === "edit" ? "Save Changes" : "Create Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
