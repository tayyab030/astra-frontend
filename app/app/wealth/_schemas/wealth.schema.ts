import * as z from "zod"
import { WEALTH_CATEGORIES, type WealthCategoryValue } from "../_components/constants"

const wealthCategoryValues = WEALTH_CATEGORIES.map((category) => category.value) as [
  WealthCategoryValue,
  ...WealthCategoryValue[],
]

const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/
const datePattern = /^\d{4}-\d{2}-\d{2}$/

const transactionSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  amount: z.coerce
    .number({ invalid_type_error: "Amount is required" })
    .positive("Amount must be greater than 0"),
  category: z
    .string()
    .min(1, "Category is required")
    .refine(
      (value): value is WealthCategoryValue =>
        wealthCategoryValues.includes(value as WealthCategoryValue),
      "Category is required"
    ),
  date: z.string().regex(datePattern, "Date is required"),
})

const addSavingSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Amount is required" })
    .positive("Amount must be greater than 0"),
  month: z.string().regex(monthPattern, "Month is required"),
})

const withdrawSavingBaseSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Amount is required" })
    .positive("Amount must be greater than 0"),
  month: z.string().regex(monthPattern, "Month is required"),
  reason: z
    .string()
    .min(1, "Reason is required when extracting from savings")
    .refine((value) => value.trim().length > 0, "Reason is required when extracting from savings"),
})

const withdrawSavingSchema = withdrawSavingBaseSchema

const transactionDefaultValues = {
  description: "",
  amount: "" as unknown as number,
  category: "",
  date: "",
}

const addSavingDefaultValues = {
  amount: "" as unknown as number,
  month: "",
}

const withdrawSavingDefaultValues = {
  amount: "" as unknown as number,
  month: "",
  reason: "",
}

type TransactionFormValues = z.input<typeof transactionSchema>
type AddSavingFormValues = z.input<typeof addSavingSchema>
type WithdrawSavingFormValues = z.input<typeof withdrawSavingSchema>

export {
  transactionSchema,
  addSavingSchema,
  withdrawSavingSchema,
  transactionDefaultValues,
  addSavingDefaultValues,
  withdrawSavingDefaultValues,
}
export type { TransactionFormValues, AddSavingFormValues, WithdrawSavingFormValues }
