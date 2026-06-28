"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { ArrowDownCircle, Edit, EllipsisVertical, PiggyBank, Plus, Trash2 } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import { cn } from "@/lib/utils"
import type { UpdateSavingPayload, WealthSaving } from "@/lib/api/wealth"
import {
  addSavingDefaultValues,
  addSavingSchema,
  withdrawSavingDefaultValues,
  withdrawSavingSchema,
  type AddSavingFormValues,
  type WithdrawSavingFormValues,
} from "../_schemas/wealth.schema"
import { FormFieldError } from "./FormFieldError"
import { getCurrentMonthValue, SavingMonthField } from "./SavingMonthField"
import { WealthEmptyState } from "./WealthEmptyState"

const primaryButtonClassName =
  "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border border-cyan-400/20 font-mono shadow-lg shadow-cyan-500/25"

const inputClassName =
  "font-mono bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"

const fieldClassName = "space-y-2"

function formatSavingMonth(value: string) {
  if (!/^\d{4}-\d{2}$/.test(value)) return value

  const [year, month] = value.split("-")
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
}

function parseSavingMonthForInput(value: string) {
  if (/^\d{4}-\d{2}$/.test(value)) return value
  return ""
}

interface SavingsTabProps {
  savings: WealthSaving[]
  balance: number
  isLoading?: boolean
  onCreateSaving: (payload: { amount: number; month: string }) => Promise<unknown>
  onWithdrawSaving: (payload: { amount: number; month: string; reason: string }) => Promise<unknown>
  onUpdateSaving: (payload: { id: string; data: UpdateSavingPayload }) => Promise<unknown>
  onDeleteSaving: (id: string) => Promise<unknown>
  isCreatingSaving?: boolean
  isWithdrawingSaving?: boolean
  isUpdatingSaving?: boolean
  isDeletingSaving?: boolean
}

export function SavingsTab({
  savings,
  balance,
  isLoading,
  onCreateSaving,
  onWithdrawSaving,
  onUpdateSaving,
  onDeleteSaving,
  isCreatingSaving,
  isWithdrawingSaving,
  isUpdatingSaving,
  isDeletingSaving,
}: SavingsTabProps) {
  const { formatCurrency } = useCurrency()
  const [showAddSaving, setShowAddSaving] = useState(false)
  const [showExtractSaving, setShowExtractSaving] = useState(false)
  const [showEditSaving, setShowEditSaving] = useState(false)
  const [editingEntry, setEditingEntry] = useState<WealthSaving | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const addForm = useForm<AddSavingFormValues>({
    resolver: zodResolver(addSavingSchema),
    defaultValues: { ...addSavingDefaultValues, month: getCurrentMonthValue() },
  })

  const withdrawForm = useForm<WithdrawSavingFormValues>({
    resolver: zodResolver(withdrawSavingSchema),
    defaultValues: { ...withdrawSavingDefaultValues, month: getCurrentMonthValue() },
    mode: "onChange",
  })

  const editDepositForm = useForm<AddSavingFormValues>({
    resolver: zodResolver(addSavingSchema),
    defaultValues: addSavingDefaultValues,
  })

  const editWithdrawForm = useForm<WithdrawSavingFormValues>({
    resolver: zodResolver(withdrawSavingSchema),
    defaultValues: withdrawSavingDefaultValues,
    mode: "onChange",
  })

  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    setValue: setAddValue,
    watch: watchAdd,
    formState: { errors: addErrors },
  } = addForm

  const {
    register: registerWithdraw,
    handleSubmit: handleWithdrawSubmit,
    reset: resetWithdraw,
    setValue: setWithdrawValue,
    watch: watchWithdraw,
    formState: { errors: withdrawErrors },
  } = withdrawForm

  const {
    register: registerEditDeposit,
    handleSubmit: handleEditDepositSubmit,
    reset: resetEditDeposit,
    setValue: setEditDepositValue,
    watch: watchEditDeposit,
    formState: { errors: editDepositErrors },
  } = editDepositForm

  const {
    register: registerEditWithdraw,
    handleSubmit: handleEditWithdrawSubmit,
    reset: resetEditWithdraw,
    setValue: setEditWithdrawValue,
    watch: watchEditWithdraw,
    formState: { errors: editWithdrawErrors },
  } = editWithdrawForm

  const resetAddForm = () => {
    resetAdd({ ...addSavingDefaultValues, month: getCurrentMonthValue() })
  }

  const resetExtractForm = () => {
    resetWithdraw({ ...withdrawSavingDefaultValues, month: getCurrentMonthValue() })
  }

  const resetEditForm = () => {
    resetEditDeposit(addSavingDefaultValues)
    resetEditWithdraw(withdrawSavingDefaultValues)
    setEditingEntry(null)
  }

  const openEditDialog = (entry: WealthSaving) => {
    setOpenMenuId(null)
    setEditingEntry(entry)

    if (entry.type === "deposit") {
      resetEditDeposit({
        amount: entry.amount,
        month: parseSavingMonthForInput(entry.month),
      })
    } else {
      resetEditWithdraw({
        amount: entry.amount,
        month: parseSavingMonthForInput(entry.month),
        reason: entry.reason ?? "",
      })
    }

    setShowEditSaving(true)
  }

  const openDeleteDialog = (entryId: string) => {
    setOpenMenuId(null)
    setDeleteId(entryId)
  }

  const getAvailableForWithdrawalEdit = (entry: WealthSaving) => {
    return entry.type === "withdrawal" ? balance + entry.amount : balance
  }

  const onAddSubmit = handleAddSubmit(async (data) => {
    try {
      await onCreateSaving({ amount: data.amount, month: data.month })
      resetAddForm()
      setShowAddSaving(false)
    } catch {
      // Errors are surfaced via mutation toasts
    }
  })

  const onWithdrawSubmit = handleWithdrawSubmit(async (data) => {
    if (data.amount > balance) {
      withdrawForm.setError("amount", {
        type: "manual",
        message: `You only have ${formatCurrency(balance)} available to extract.`,
      })
      return
    }

    try {
      await onWithdrawSaving({
        amount: data.amount,
        month: data.month,
        reason: data.reason.trim(),
      })
      resetExtractForm()
      setShowExtractSaving(false)
    } catch {
      // Errors are surfaced via mutation toasts
    }
  })

  const onEditDepositSubmit = handleEditDepositSubmit(async (data) => {
    if (!editingEntry) return

    try {
      await onUpdateSaving({
        id: editingEntry.id,
        data: { amount: data.amount, month: data.month },
      })
      resetEditForm()
      setShowEditSaving(false)
    } catch {
      // Errors are surfaced via mutation toasts
    }
  })

  const onEditWithdrawSubmit = handleEditWithdrawSubmit(async (data) => {
    if (!editingEntry) return

    const available = getAvailableForWithdrawalEdit(editingEntry)
    if (data.amount > available) {
      editWithdrawForm.setError("amount", {
        type: "manual",
        message: `You only have ${formatCurrency(available)} available to extract.`,
      })
      return
    }

    try {
      await onUpdateSaving({
        id: editingEntry.id,
        data: {
          amount: data.amount,
          month: data.month,
          reason: data.reason.trim(),
        },
      })
      resetEditForm()
      setShowEditSaving(false)
    } catch {
      // Errors are surfaced via mutation toasts
    }
  })

  const handleDelete = async () => {
    if (deleteId === null) return

    try {
      await onDeleteSaving(deleteId)
      setDeleteId(null)
    } catch {
      // Errors are surfaced via mutation toasts
    }
  }

  const canExtract = !isLoading && balance > 0
  const savingToDelete = savings.find((entry) => entry.id === deleteId)

  return (
    <TabsContent value="savings" className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-200">Savings</h2>
          <p className="text-sm text-slate-400 font-mono mt-1">
            Balance:{" "}
            {isLoading ? (
              <Skeleton className="inline-block h-4 w-20 align-middle bg-slate-900/50" />
            ) : (
              <span className="text-green-400">{formatCurrency(balance)}</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={showExtractSaving}
            onOpenChange={(open) => {
              setShowExtractSaving(open)
              if (!open) resetExtractForm()
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={!canExtract || isWithdrawingSaving}
                className="font-mono border-orange-500/30 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200 disabled:opacity-50 disabled:pointer-events-none"
              >
                <ArrowDownCircle className="mr-2 h-4 w-4" />
                Extract
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-orange-500/20 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="font-mono text-slate-200">Extract from Savings</DialogTitle>
                <DialogDescription className="font-mono text-slate-400">
                  Withdraw money from your savings. A reason is required.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={onWithdrawSubmit}>
                <div className={fieldClassName}>
                  <Label htmlFor="extract-amount" className="font-mono text-orange-200">
                    Amount
                  </Label>
                  <Input
                    id="extract-amount"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    {...registerWithdraw("amount")}
                    className={cn(inputClassName, withdrawErrors.amount && "border-red-500/70 focus:border-red-500/70")}
                  />
                  <FormFieldError message={withdrawErrors.amount?.message} />
                </div>
                <SavingMonthField
                  id="extract-month"
                  value={watchWithdraw("month")}
                  onChange={(value) => setWithdrawValue("month", value, { shouldValidate: true })}
                  error={withdrawErrors.month?.message}
                  labelClassName="text-orange-200"
                />
                <div className={fieldClassName}>
                  <Label htmlFor="extract-reason" className="font-mono text-orange-200">
                    Reason
                  </Label>
                  <Textarea
                    id="extract-reason"
                    placeholder="Why are you withdrawing this amount?"
                    value={watchWithdraw("reason") ?? ""}
                    onChange={(e) =>
                      setWithdrawValue("reason", e.target.value, { shouldValidate: true })
                    }
                    className={cn(
                      `${inputClassName} min-h-24`,
                      withdrawErrors.reason && "border-red-500/70 focus:border-red-500/70"
                    )}
                  />
                  <FormFieldError message={withdrawErrors.reason?.message} />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 font-mono"
                  disabled={isWithdrawingSaving}
                >
                  Extract Saving
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={showAddSaving}
            onOpenChange={(open) => {
              setShowAddSaving(open)
              if (!open) resetAddForm()
            }}
          >
            <DialogTrigger asChild>
              <Button className={primaryButtonClassName} disabled={isCreatingSaving}>
                <Plus className="mr-2 h-4 w-4" />
                Add Saving
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-cyan-500/20 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="font-mono text-slate-200">Add Saving</DialogTitle>
                <DialogDescription className="font-mono text-slate-400">Record a monthly saving</DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={onAddSubmit}>
                <div className={fieldClassName}>
                  <Label htmlFor="saving-amount" className="font-mono text-cyan-200">
                    Saving
                  </Label>
                  <Input
                    id="saving-amount"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    {...registerAdd("amount")}
                    className={cn(inputClassName, addErrors.amount && "border-red-500/70 focus:border-red-500/70")}
                  />
                  <FormFieldError message={addErrors.amount?.message} />
                </div>
                <SavingMonthField
                  id="saving-month"
                  value={watchAdd("month")}
                  onChange={(value) => setAddValue("month", value, { shouldValidate: true })}
                  error={addErrors.month?.message}
                  labelClassName="text-cyan-200"
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 font-mono"
                  disabled={isCreatingSaving}
                >
                  Add Saving
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog
        open={showEditSaving}
        onOpenChange={(open) => {
          setShowEditSaving(open)
          if (!open) resetEditForm()
        }}
      >
        <DialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-cyan-500/20 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="font-mono text-slate-200">
              {editingEntry?.type === "withdrawal" ? "Edit Withdrawal" : "Edit Deposit"}
            </DialogTitle>
            <DialogDescription className="font-mono text-slate-400">
              Update this savings entry
            </DialogDescription>
          </DialogHeader>
          {editingEntry?.type === "withdrawal" ? (
            <form className="space-y-4" onSubmit={onEditWithdrawSubmit}>
              <div className={fieldClassName}>
                <Label htmlFor="edit-withdraw-amount" className="font-mono text-orange-200">
                  Amount
                </Label>
                <Input
                  id="edit-withdraw-amount"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  {...registerEditWithdraw("amount")}
                  className={cn(
                    inputClassName,
                    editWithdrawErrors.amount && "border-red-500/70 focus:border-red-500/70"
                  )}
                />
                <FormFieldError message={editWithdrawErrors.amount?.message} />
              </div>
              <SavingMonthField
                id="edit-withdraw-month"
                value={watchEditWithdraw("month")}
                onChange={(value) => setEditWithdrawValue("month", value, { shouldValidate: true })}
                error={editWithdrawErrors.month?.message}
                labelClassName="text-orange-200"
              />
              <div className={fieldClassName}>
                <Label htmlFor="edit-withdraw-reason" className="font-mono text-orange-200">
                  Reason
                </Label>
                <Textarea
                  id="edit-withdraw-reason"
                  placeholder="Why are you withdrawing this amount?"
                  value={watchEditWithdraw("reason") ?? ""}
                  onChange={(e) =>
                    setEditWithdrawValue("reason", e.target.value, { shouldValidate: true })
                  }
                  className={cn(
                    `${inputClassName} min-h-24`,
                    editWithdrawErrors.reason && "border-red-500/70 focus:border-red-500/70"
                  )}
                />
                <FormFieldError message={editWithdrawErrors.reason?.message} />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 font-mono"
                disabled={isUpdatingSaving}
              >
                Save Changes
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={onEditDepositSubmit}>
              <div className={fieldClassName}>
                <Label htmlFor="edit-deposit-amount" className="font-mono text-cyan-200">
                  Saving
                </Label>
                <Input
                  id="edit-deposit-amount"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  {...registerEditDeposit("amount")}
                  className={cn(
                    inputClassName,
                    editDepositErrors.amount && "border-red-500/70 focus:border-red-500/70"
                  )}
                />
                <FormFieldError message={editDepositErrors.amount?.message} />
              </div>
              <SavingMonthField
                id="edit-deposit-month"
                value={watchEditDeposit("month")}
                onChange={(value) => setEditDepositValue("month", value, { shouldValidate: true })}
                error={editDepositErrors.month?.message}
                labelClassName="text-cyan-200"
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 font-mono"
                disabled={isUpdatingSaving}
              >
                Save Changes
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-mono text-slate-200">Monthly Savings</CardTitle>
          <CardDescription className="font-mono text-slate-400">Deposits and withdrawals by month</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full bg-slate-900/50" />
              ))}
            </div>
          ) : savings.length === 0 ? (
            <WealthEmptyState
              icon={PiggyBank}
              title="No savings recorded"
              description="Add a monthly deposit to start building your savings history for this period."
            />
          ) : (
            <div className="space-y-4">
              {savings.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-600/30"
                >
                  <div className="min-w-0">
                    <p className="font-semibold font-mono text-slate-200">{formatSavingMonth(entry.month)}</p>
                    {entry.type === "withdrawal" && entry.reason && (
                      <p className="text-sm text-slate-400 font-mono mt-1">Reason: {entry.reason}</p>
                    )}
                  </div>
                  <div className="relative z-20 flex items-center gap-2 shrink-0">
                    <p
                      className={`font-semibold font-mono ${entry.type === "deposit" ? "text-green-400" : "text-red-400"}`}
                    >
                      {entry.type === "deposit" ? "+" : "-"}
                      {formatCurrency(entry.amount)}
                    </p>
                    <DropdownMenu
                      modal={false}
                      open={openMenuId === entry.id}
                      onOpenChange={(open) => setOpenMenuId(open ? entry.id : null)}
                    >
                      <DropdownMenuTrigger
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
                      >
                        <EllipsisVertical className="h-4 w-4" />
                        <span className="sr-only">Open saving menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="z-[100] bg-slate-800 border-slate-600/50 text-slate-200"
                      >
                        <DropdownMenuItem
                          className="font-mono cursor-pointer focus:bg-slate-700 focus:text-slate-100"
                          onSelect={() => openEditDialog(entry)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          className="font-mono cursor-pointer focus:bg-red-500/10 focus:text-red-400"
                          onSelect={() => openDeleteDialog(entry.id)}
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
            <AlertDialogTitle className="font-mono text-slate-200">Delete saving?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-slate-400">
              {savingToDelete
                ? `This will permanently delete the ${savingToDelete.type === "deposit" ? "deposit" : "withdrawal"} of ${formatCurrency(savingToDelete.amount)} from ${formatSavingMonth(savingToDelete.month)}. This action cannot be undone.`
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
              disabled={isDeletingSaving}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  )
}
