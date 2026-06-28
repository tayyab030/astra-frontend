"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TabsContent } from "@/components/ui/tabs"
import { BarChart3, Brain, PieChart } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import type { WealthCategoryTotal, WealthDashboard, WealthTransaction } from "@/lib/api/wealth"
import { ExpenseCategoriesChart } from "./ExpenseCategoriesChart"
import { SpendingTrendChart } from "./SpendingTrendChart"
import { getAiInsights } from "./constants"

interface OverviewTabProps {
  monthlyIncome: number
  monthlyExpenses: number
  periodNet: number
  wasteSpending: number
  transactions: WealthTransaction[]
  categoryTotals: WealthCategoryTotal[]
  filter: WealthDashboard["filter"]
  isLoading?: boolean
}

export function OverviewTab({
  monthlyIncome,
  monthlyExpenses,
  periodNet,
  wasteSpending,
  transactions,
  categoryTotals,
  filter,
  isLoading,
}: OverviewTabProps) {
  const { formatCurrency } = useCurrency()
  const aiInsights = getAiInsights(formatCurrency)

  return (
    <TabsContent value="overview" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono flex items-center text-slate-200">
              <BarChart3 className="mr-2 h-5 w-5" />
              Monthly Spending Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full bg-slate-900/50" />
            ) : (
              <SpendingTrendChart transactions={transactions} filter={filter} />
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/20 shadow-2xl shadow-blue-500/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono flex items-center text-blue-300">
              <PieChart className="mr-2 h-5 w-5" />
              Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full bg-slate-900/50" />
            ) : (
              <ExpenseCategoriesChart categoryTotals={categoryTotals} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-green-500/20 shadow-2xl shadow-green-500/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-mono text-green-300">Monthly Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full bg-slate-900/50" />
              ))
            ) : (
              <>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400 font-mono">{formatCurrency(monthlyIncome)}</p>
                  <p className="text-sm text-slate-400 font-mono">Total Income</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400 font-mono">{formatCurrency(monthlyExpenses)}</p>
                  <p className="text-sm text-slate-400 font-mono">Total Expenses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400 font-mono">{formatCurrency(periodNet)}</p>
                  <p className="text-sm text-slate-400 font-mono">Period Net</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400 font-mono">{formatCurrency(wasteSpending)}</p>
                  <p className="text-sm text-slate-400 font-mono">Waste Spending</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-cyan-500/20 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-mono flex items-center">
            <Brain className="mr-2 h-5 w-5 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              AI Financial Insights
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border backdrop-blur-sm ${
                  insight.type === "success"
                    ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30"
                    : insight.type === "warning"
                      ? "bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30"
                      : insight.type === "tip"
                        ? "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30"
                        : "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30"
                }`}
              >
                <p className="text-sm font-mono text-slate-300">{insight.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
