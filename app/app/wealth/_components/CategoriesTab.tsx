"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ListRowsSkeleton } from "@/components/skeletons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingDown, TrendingUp } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import type { WealthCategoryTotal, WealthScope } from "@/lib/api/wealth"
import {
  getExpenseCategoriesForScope,
  getIncomeCategoriesForScope,
} from "./constants"

type CategoryView = "expenses" | "income"

interface CategoriesTabProps {
  categoryTotals: WealthCategoryTotal[]
  incomeCategoryTotals: WealthCategoryTotal[]
  isLoading?: boolean
  scope?: WealthScope
}

function mergeCategoryTotals(
  definitions: readonly { value: string; label: string }[],
  totals: WealthCategoryTotal[]
) {
  const byValue = new Map(totals.map((entry) => [entry.value, entry.total]))

  return definitions.map((category) => ({
    value: category.value,
    label: category.label,
    total: byValue.get(category.value) ?? 0,
  }))
}

function CategoryList({
  categories,
  accentClassName,
}: {
  categories: WealthCategoryTotal[]
  accentClassName: (value: string) => string
}) {
  const { formatCurrency } = useCurrency()

  return (
    <div className="space-y-4">
      {categories.map((cat) => (
        <div
          key={cat.value}
          className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-600/30"
        >
          <p className="font-semibold font-mono text-slate-200">{cat.label}</p>
          <p className={`font-semibold font-mono ${accentClassName(cat.value)}`}>
            {formatCurrency(cat.total, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      ))}
    </div>
  )
}

function CategorySkeleton({ count }: { count: number }) {
  return <ListRowsSkeleton count={count} withAvatar />
}

export function CategoriesTab({
  categoryTotals,
  incomeCategoryTotals,
  isLoading,
  scope = "personal",
}: CategoriesTabProps) {
  const [view, setView] = useState<CategoryView>("expenses")

  const expenseDefs = getExpenseCategoriesForScope(scope)
  const incomeDefs = getIncomeCategoriesForScope(scope)
  const expenseCategories = mergeCategoryTotals(expenseDefs, categoryTotals)
  const incomeCategories = mergeCategoryTotals(incomeDefs, incomeCategoryTotals)

  return (
    <TabsContent value="categories" className="space-y-6">
      <h2 className="text-xl font-bold font-mono text-slate-200">Categories</h2>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-mono text-slate-200">Spending & Income by Category</CardTitle>
          <CardDescription className="font-mono text-slate-400">
            All categories for this period — switch between expenses and income
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as CategoryView)}
            className="space-y-4"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-900/50 border border-slate-600/50">
              <TabsTrigger
                value="expenses"
                className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
              >
                <TrendingDown className="mr-2 h-4 w-4" />
                Expenses
              </TabsTrigger>
              <TabsTrigger
                value="income"
                className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Income
              </TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="mt-0">
              {isLoading ? (
                <CategorySkeleton count={expenseDefs.length} />
              ) : (
                <CategoryList
                  categories={expenseCategories}
                  accentClassName={(value) =>
                    value === "waste" ? "text-orange-400" : "text-red-400"
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="income" className="mt-0">
              {isLoading ? (
                <CategorySkeleton count={incomeDefs.length} />
              ) : (
                <CategoryList
                  categories={incomeCategories}
                  accentClassName={() => "text-green-400"}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
