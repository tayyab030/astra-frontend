"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
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
import { Edit, EllipsisVertical, Plus, Receipt, Trash2, TrendingDown, TrendingUp } from "lucide-react"
import { DatePicker } from "@/components/common/DatePicker"
import { useCurrency } from "@/hooks/useCurrency"
import { cn } from "@/lib/utils"
import type {
  CreateTransactionPayload,
  UpdateTransactionPayload,
  WealthCategoryValue,
  WealthTransaction,
} from "@/lib/api/wealth"
import {
  transactionDefaultValues,
  transactionSchema,
  type TransactionFormValues,
} from "../_schemas/wealth.schema"
import { FormFieldError } from "./FormFieldError"
import { WealthEmptyState } from "./WealthEmptyState"
import { WEALTH_EXPENSE_CATEGORIES, WEALTH_INCOME_CATEGORIES, getCategoryLabel } from "./constants"

const primaryButtonClassName =
  "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border border-cyan-400/20 font-mono shadow-lg shadow-cyan-500/25"

const inputClassName =
  "font-mono bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"

const fieldClassName = "space-y-2"

function getTodayDateValue() {
  return new Date().toISOString().split("T")[0]
}

function formatTransactionDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function parseTransactionDateForInput(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  return getTodayDateValue()
}

type DialogMode = "add" | "edit"

interface TransactionsTabProps {
  transactions: WealthTransaction[]
  isLoading?: boolean
  onCreateTransaction: (payload: CreateTransactionPayload) => Promise<unknown>
  onUpdateTransaction: (payload: { id: string; data: UpdateTransactionPayload }) => Promise<unknown>
  onDeleteTransaction: (id: string) => Promise<unknown>
  isCreatingTransaction?: boolean
  isUpdatingTransaction?: boolean
  isDeletingTransaction?: boolean
}

export function TransactionsTab({
  transactions,
  isLoading,
  onCreateTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  isCreatingTransaction,
  isUpdatingTransaction,
  isDeletingTransaction,
}: TransactionsTabProps) {
  const { formatCurrency } = useCurrency()
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>("add")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      ...transactionDefaultValues,
      date: getTodayDateValue(),
    },
  })

  const category = watch("category")
  const date = watch("date")

  const resetForm = () => {
    reset({
      description: "",
      amount: "" as unknown as number,
      category: "",
      date: getTodayDateValue(),
    })
    setEditingId(null)
    setDialogMode("add")
  }

  const openAddDialog = () => {
    resetForm()
    setDialogMode("add")
    setShowDialog(true)
  }

  const openEditDialog = (transaction: WealthTransaction) => {
    setOpenMenuId(null)
    setDialogMode("edit")
    setEditingId(transaction.id)
    reset({
      description: transaction.description,
      amount: Math.abs(transaction.amount),
      category: transaction.category as WealthCategoryValue,
      date: parseTransactionDateForInput(transaction.date),
    })
    setShowDialog(true)
  }

  const openDeleteDialog = (transactionId: string) => {
    setOpenMenuId(null)
    setDeleteId(transactionId)
  }

  const onSubmit = handleSubmit(async (data) => {
    const payload: CreateTransactionPayload = {
      description: data.description.trim(),
      amount: Number(data.amount),
      category: data.category as WealthCategoryValue,
      date: data.date,
    }

    try {
      if (dialogMode === "edit" && editingId !== null) {
        await onUpdateTransaction({ id: editingId, data: payload })
      } else {
        await onCreateTransaction(payload)
      }

      resetForm()
      setShowDialog(false)
    } catch {
      // Errors are surfaced via mutation toasts
    }
  })

  const handleDelete = async () => {
    if (deleteId === null) return

    try {
      await onDeleteTransaction(deleteId)
      setDeleteId(null)
    } catch {
      // Errors are surfaced via mutation toasts
    }
  }

  const transactionToDelete = transactions.find((transaction) => transaction.id === deleteId)
  const isSaving = isCreatingTransaction || isUpdatingTransaction

  return (
    <TabsContent value="transactions" className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-xl font-bold font-mono text-slate-200">Transactions</h2>
        <Button className={primaryButtonClassName} onClick={openAddDialog} disabled={isCreatingTransaction}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
        <Dialog
          open={showDialog}
          onOpenChange={(open) => {
            setShowDialog(open)
            if (!open) resetForm()
          }}
        >
          <DialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-cyan-500/20 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="font-mono text-slate-200">
                {dialogMode === "edit" ? "Edit Transaction" : "Add New Transaction"}
              </DialogTitle>
              <DialogDescription className="font-mono text-slate-400">
                {dialogMode === "edit" ? "Update this transaction" : "Record your income or expense"}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className={fieldClassName}>
                <Label htmlFor="amount" className="font-mono text-cyan-200">
                  Amount
                </Label>
                <Input
                  id="amount"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("amount")}
                  className={cn(inputClassName, errors.amount && "border-red-500/70 focus:border-red-500/70")}
                />
                <FormFieldError message={errors.amount?.message} />
              </div>
              <div className={fieldClassName}>
                <Label htmlFor="description" className="font-mono text-cyan-200">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Transaction description"
                  {...register("description")}
                  className={cn(inputClassName, errors.description && "border-red-500/70 focus:border-red-500/70")}
                />
                <FormFieldError message={errors.description?.message} />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`${fieldClassName} flex-1 min-w-0`}>
                  <Label htmlFor="category" className="font-mono text-cyan-200">
                    Category
                  </Label>
                  <Select
                    value={category}
                    onValueChange={(value) =>
                      setValue("category", value as WealthCategoryValue, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "font-mono bg-slate-900/50 border-slate-600/50 text-white w-full",
                        errors.category && "border-red-500/70"
                      )}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="bg-slate-800 border-slate-600/50 max-h-48 overflow-y-auto [&_[data-radix-select-viewport]]:h-auto [&_[data-radix-select-viewport]]:max-h-44"
                    >
                      <SelectGroup>
                        <SelectLabel className="font-mono text-slate-400">Expenses</SelectLabel>
                        {WEALTH_EXPENSE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value} className="font-mono">
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="font-mono text-slate-400">Income</SelectLabel>
                        {WEALTH_INCOME_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value} className="font-mono">
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormFieldError message={errors.category?.message} />
                </div>
                <div className={`${fieldClassName} flex-1 min-w-0`}>
                  <Label htmlFor="transaction-date" className="font-mono text-cyan-200">
                    Date
                  </Label>
                  <DatePicker
                    value={date}
                    onChange={(value) => value && setValue("date", value, { shouldValidate: true })}
                    placeholder="Pick a date"
                    className="space-y-0"
                    buttonClassName={cn(inputClassName, errors.date && "border-red-500/70")}
                  />
                  <FormFieldError message={errors.date?.message} />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 font-mono"
                disabled={isSaving}
              >
                {dialogMode === "edit" ? "Save Changes" : "Add Transaction"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-mono text-slate-200">Recent Transactions</CardTitle>
          <CardDescription className="font-mono text-slate-400">Your latest financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full bg-slate-900/50" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <WealthEmptyState
              icon={Receipt}
              title="No transactions yet"
              description="Add your first income or expense to start tracking your financial activity for this period."
            />
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-600/30"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`p-2 rounded-full shrink-0 ${transaction.amount > 0 ? "bg-green-500/20 border border-green-500/30" : "bg-red-500/20 border border-red-500/30"}`}
                    >
                      {transaction.amount > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold font-mono text-slate-200 truncate">{transaction.description}</p>
                        <p className="text-sm text-slate-400 font-mono">
                          {getCategoryLabel(transaction.category)} • {formatTransactionDate(transaction.date)}
                        </p>
                    </div>
                  </div>
                  <div className="relative z-20 flex items-center gap-2 shrink-0">
                    <p
                      className={`font-semibold font-mono ${transaction.amount > 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {formatCurrency(transaction.amount, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        showSign: transaction.amount > 0,
                      })}
                    </p>
                    <DropdownMenu
                      modal={false}
                      open={openMenuId === transaction.id}
                      onOpenChange={(open) => setOpenMenuId(open ? transaction.id : null)}
                    >
                      <DropdownMenuTrigger
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
                      >
                        <EllipsisVertical className="h-4 w-4" />
                        <span className="sr-only">Open transaction menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="z-[100] bg-slate-800 border-slate-600/50 text-slate-200"
                      >
                        <DropdownMenuItem
                          className="font-mono cursor-pointer focus:bg-slate-700 focus:text-slate-100"
                          onSelect={() => openEditDialog(transaction)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          className="font-mono cursor-pointer focus:bg-red-500/10 focus:text-red-400"
                          onSelect={() => openDeleteDialog(transaction.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-red-500/20 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-slate-200">Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-slate-400">
              {transactionToDelete
                ? `This will permanently delete "${transactionToDelete.description}". This action cannot be undone.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono bg-slate-900/50 border-slate-600/50 text-slate-200 hover:bg-slate-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="font-mono bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={isDeletingTransaction}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  )
}
