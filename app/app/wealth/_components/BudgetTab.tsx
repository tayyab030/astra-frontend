"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TabsContent } from "@/components/ui/tabs"
import { Edit, EllipsisVertical, PiggyBank, Plus, Trash2 } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import type {
  CreateCategoryBudgetPayload,
  WealthCategoryBudget,
  WealthDashboard,
  WealthExpenseCategoryValue,
} from "@/lib/api/wealth"
import {
  budgetDefaultValues,
  budgetLimitSchema,
  budgetSchema,
  type BudgetFormValues,
  type BudgetLimitFormValues,
} from "../_schemas/wealth.schema"
import { FormFieldError } from "./FormFieldError"
import { WealthEmptyState } from "./WealthEmptyState"
import { BUDGET_CATEGORY_STYLES, WEALTH_EXPENSE_CATEGORIES } from "./constants"
import { formatBudgetPeriod, getBudgetStatus } from "./utils"

const primaryButtonClassName =
  "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border border-cyan-400/20 font-mono shadow-lg shadow-cyan-500/25"

const inputClassName =
  "font-mono bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
]

function getDefaultBudgetValues(filter: WealthDashboard["filter"]): BudgetFormValues {
  if (filter.mode === "month") {
    return {
      ...budgetDefaultValues,
      period_type: "month",
      year: filter.year,
      month: filter.month,
    }
  }

  return {
    ...budgetDefaultValues,
    period_type: "year",
    year: filter.start_year,
    month: undefined,
  }
}

interface BudgetTabProps {
  categoryBudgets: WealthCategoryBudget[]
  filter: WealthDashboard["filter"]
  isLoading?: boolean
  onCreateBudget: (payload: CreateCategoryBudgetPayload) => Promise<unknown>
  onUpdateBudget: (payload: { id: string; data: { amount: number } }) => Promise<unknown>
  onDeleteBudget: (id: string) => Promise<unknown>
  isCreatingBudget?: boolean
  isUpdatingBudget?: boolean
  isDeletingBudget?: boolean
}

export function BudgetTab({
  categoryBudgets,
  filter,
  isLoading,
  onCreateBudget,
  onUpdateBudget,
  onDeleteBudget,
  isCreatingBudget,
  isUpdatingBudget,
  isDeletingBudget,
}: BudgetTabProps) {
  const { formatCurrency } = useCurrency()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingBudget, setEditingBudget] = useState<WealthCategoryBudget | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const addForm = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: getDefaultBudgetValues(filter),
  })

  const editForm = useForm<BudgetLimitFormValues>({
    resolver: zodResolver(budgetLimitSchema),
    defaultValues: { amount: "" as unknown as number },
  })

  const watchedPeriodType = addForm.watch("period_type")

  const resetAddForm = () => {
    addForm.reset(getDefaultBudgetValues(filter))
  }

  const openEdit = (budget: WealthCategoryBudget) => {
    setEditingBudget(budget)
    editForm.reset({ amount: budget.limit })
    setShowEditDialog(true)
  }

  const handleAddSubmit = addForm.handleSubmit(async (data) => {
    const payload: CreateCategoryBudgetPayload = {
      category: data.category as WealthExpenseCategoryValue,
      amount: data.amount,
      period_type: data.period_type,
      year: data.year,
      ...(data.period_type === "month" ? { month: data.month } : {}),
    }

    await onCreateBudget(payload)
    setShowAddDialog(false)
    resetAddForm()
  })

  const handleEditSubmit = editForm.handleSubmit(async (data) => {
    if (!editingBudget) return

    await onUpdateBudget({ id: editingBudget.id, data: { amount: data.amount } })
    setShowEditDialog(false)
    setEditingBudget(null)
  })

  const handleDelete = async () => {
    if (!deleteId) return
    await onDeleteBudget(deleteId)
    setDeleteId(null)
  }

  const budgetToDelete = categoryBudgets.find((budget) => budget.id === deleteId)
  const filterLabel =
    filter.mode === "month"
      ? formatBudgetPeriod("month", filter.year, filter.month)
      : filter.start_year === filter.end_year
        ? String(filter.start_year)
        : `${filter.start_year}–${filter.end_year}`

  return (
    <TabsContent value="budget" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-200">Category Budgets</h2>
          <p className="text-sm font-mono text-slate-400 mt-1">
            Limits for {filterLabel} · spending calculated from transactions
          </p>
        </div>
        <Button
          className={primaryButtonClassName}
          onClick={() => {
            resetAddForm()
            setShowAddDialog(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Set Limit
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full bg-slate-900/50" />
          ))}
        </div>
      ) : categoryBudgets.length === 0 ? (
        <WealthEmptyState
          icon={PiggyBank}
          title="No budget limits set"
          description={`Add monthly or yearly limits for expense categories in ${filterLabel}.`}
        />
      ) : (
        <div className="grid gap-4">
          {categoryBudgets.map((budget) => {
            const style = BUDGET_CATEGORY_STYLES[budget.category] ?? BUDGET_CATEGORY_STYLES.other
            const Icon = style.icon
            const percentage = budget.percentage
            const status = getBudgetStatus(budget.spent, budget.limit)
            const periodLabel = formatBudgetPeriod(budget.period_type, budget.year, budget.month)

            return (
              <Card
                key={budget.id}
                className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${style.color} shrink-0`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold font-mono text-slate-200">{budget.label}</h3>
                        <p className="text-sm text-slate-400 font-mono">
                          {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {budget.period_type === "month" ? "Monthly" : "Yearly"} · {periodLabel}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={
                          budget.status === "over_budget"
                            ? "destructive"
                            : budget.status === "near_limit"
                              ? "secondary"
                              : "default"
                        }
                        className="font-mono"
                      >
                        {status.status}
                      </Badge>
                      <DropdownMenu
                        modal={false}
                        open={openMenuId === budget.id}
                        onOpenChange={(open) => setOpenMenuId(open ? budget.id : null)}
                      >
                        <DropdownMenuTrigger
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
                        >
                          <EllipsisVertical className="h-4 w-4" />
                          <span className="sr-only">Open budget menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="z-[100] bg-slate-800 border-slate-600/50 text-slate-200"
                        >
                          <DropdownMenuItem
                            className="font-mono cursor-pointer focus:bg-slate-700 focus:text-slate-100"
                            onSelect={() => openEdit(budget)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Limit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            className="font-mono cursor-pointer focus:bg-red-500/10 focus:text-red-400"
                            onSelect={() => setDeleteId(budget.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className="h-3" />
                  <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                    <span>{percentage.toFixed(1)}% used</span>
                    <span className={budget.remaining < 0 ? "text-red-400" : undefined}>
                      {budget.remaining < 0
                        ? `${formatCurrency(Math.abs(budget.remaining))} over`
                        : `${formatCurrency(budget.remaining)} remaining`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open)
          if (!open) resetAddForm()
        }}
      >
        <DialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-cyan-500/20 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="font-mono text-slate-200">Set Category Limit</DialogTitle>
            <DialogDescription className="font-mono text-slate-400">
              Set a monthly or yearly spending limit for an expense category.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-mono text-cyan-200">Category</Label>
              <Select
                value={addForm.watch("category")}
                onValueChange={(value) =>
                  addForm.setValue("category", value, { shouldValidate: true })
                }
              >
                <SelectTrigger className={inputClassName}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600/50 max-h-48">
                  {WEALTH_EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="font-mono">
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormFieldError message={addForm.formState.errors.category?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget-amount" className="font-mono text-cyan-200">
                Limit Amount
              </Label>
              <Input
                id="budget-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className={inputClassName}
                {...addForm.register("amount")}
              />
              <FormFieldError message={addForm.formState.errors.amount?.message} />
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-cyan-200">Period Type</Label>
              <Select
                value={watchedPeriodType}
                onValueChange={(value: "month" | "year") => {
                  addForm.setValue("period_type", value, { shouldValidate: true })
                  if (value === "year") {
                    addForm.setValue("month", undefined)
                  } else if (!addForm.getValues("month")) {
                    addForm.setValue("month", new Date().getMonth() + 1)
                  }
                }}
              >
                <SelectTrigger className={inputClassName}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600/50">
                  <SelectItem value="month" className="font-mono">
                    Monthly
                  </SelectItem>
                  <SelectItem value="year" className="font-mono">
                    Yearly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="font-mono text-cyan-200">Year</Label>
                <Input
                  type="number"
                  className={inputClassName}
                  {...addForm.register("year")}
                />
                <FormFieldError message={addForm.formState.errors.year?.message} />
              </div>
              {watchedPeriodType === "month" && (
                <div className="space-y-2">
                  <Label className="font-mono text-cyan-200">Month</Label>
                  <Select
                    value={String(addForm.watch("month") ?? "")}
                    onValueChange={(value) =>
                      addForm.setValue("month", Number(value), { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className={inputClassName}>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600/50 max-h-48">
                      {MONTHS.map((entry) => (
                        <SelectItem key={entry.value} value={String(entry.value)} className="font-mono">
                          {entry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormFieldError message={addForm.formState.errors.month?.message} />
                </div>
              )}
            </div>

            <Button type="submit" className={`w-full ${primaryButtonClassName}`} disabled={isCreatingBudget}>
              Save Limit
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open)
          if (!open) setEditingBudget(null)
        }}
      >
        <DialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-cyan-500/20 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="font-mono text-slate-200">Edit Limit</DialogTitle>
            <DialogDescription className="font-mono text-slate-400">
              {editingBudget
                ? `Update the ${editingBudget.label} limit for ${formatBudgetPeriod(
                    editingBudget.period_type,
                    editingBudget.year,
                    editingBudget.month,
                  )}.`
                : "Update this budget limit."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-budget-amount" className="font-mono text-cyan-200">
                Limit Amount
              </Label>
              <Input
                id="edit-budget-amount"
                type="number"
                step="0.01"
                min="0"
                className={inputClassName}
                {...editForm.register("amount")}
              />
              <FormFieldError message={editForm.formState.errors.amount?.message} />
            </div>
            <Button type="submit" className={`w-full ${primaryButtonClassName}`} disabled={isUpdatingBudget}>
              Update Limit
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-red-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-slate-200">Delete budget limit?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-slate-400">
              {budgetToDelete
                ? `This will remove the ${budgetToDelete.label} limit of ${formatCurrency(budgetToDelete.limit)}.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="font-mono bg-red-600 hover:bg-red-700"
              disabled={isDeletingBudget}
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  )
}
