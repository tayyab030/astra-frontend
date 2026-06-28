"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TabsContent } from "@/components/ui/tabs"
import { Tags } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import type { WealthCategoryTotal } from "@/lib/api/wealth"
import { WealthEmptyState } from "./WealthEmptyState"

interface CategoriesTabProps {
  categoryTotals: WealthCategoryTotal[]
  isLoading?: boolean
}

export function CategoriesTab({ categoryTotals, isLoading }: CategoriesTabProps) {
  const { formatCurrency } = useCurrency()
  const hasCategoryData = categoryTotals.some((category) => category.total !== 0)

  return (
    <TabsContent value="categories" className="space-y-6">
      <h2 className="text-xl font-bold font-mono text-slate-200">Categories</h2>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-mono text-slate-200">Spending by Category</CardTitle>
          <CardDescription className="font-mono text-slate-400">
            Totals calculated from your transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full bg-slate-900/50" />
              ))}
            </div>
          ) : !hasCategoryData ? (
            <WealthEmptyState
              icon={Tags}
              title="No category data yet"
              description="Add transactions with categories to see how your spending breaks down for this period."
            />
          ) : (
            <div className="space-y-4">
              {categoryTotals.map((cat) => (
                <div
                  key={cat.value}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-600/30"
                >
                  <p className="font-semibold font-mono text-slate-200">{cat.label}</p>
                  <p
                    className={`font-semibold font-mono ${cat.value === "waste" ? "text-orange-400" : "text-red-400"}`}
                  >
                    {formatCurrency(cat.total)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}
