"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, CreditCard, AlertTriangle } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import { WEALTH_TABS } from "./_components/constants"
import { BudgetTab } from "./_components/BudgetTab"
import { CategoriesTab } from "./_components/CategoriesTab"
import { OverviewTab } from "./_components/OverviewTab"
import { TransactionsTab } from "./_components/TransactionsTab"
import { WealthFilters } from "./_components/WealthFilters"
import { useWealth } from "./_hooks/useWealth"
import type { WealthFilter } from "@/lib/api/wealth"

function getInitialFilter(): WealthFilter {
  const now = new Date()
  return {
    mode: "month",
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

export default function WealthPage() {
  const { formatCurrency } = useCurrency()
  const [filter, setFilter] = useState<WealthFilter>(getInitialFilter)
  const {
    dashboard,
    isLoading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createBudget,
    updateBudget,
    deleteBudget,
    isCreatingTransaction,
    isUpdatingTransaction,
    isDeletingTransaction,
    isCreatingBudget,
    isUpdatingBudget,
    isDeletingBudget,
  } = useWealth(filter)

  const resolvedFilter =
    dashboard?.filter ??
    (filter.mode === "month"
      ? { mode: "month" as const, year: filter.year, month: filter.month }
      : {
          mode: "year" as const,
          start_year: filter.startYear,
          end_year: filter.endYear,
        })

  const summaryCards = [
    {
      title: "Net Worth",
      value: dashboard?.net_worth ?? 0,
      subtitle: "Total income minus expenses (all time)",
      icon: TrendingUp,
      titleClass: "text-green-300",
      valueClass: "text-green-200",
      subtitleClass: "text-green-400",
      borderClass: "border-green-500/20 shadow-green-500/10",
    },
    {
      title: "Monthly Income",
      value: dashboard?.monthly_income ?? 0,
      subtitle: "Filtered period income",
      icon: DollarSign,
      titleClass: "text-blue-300",
      valueClass: "text-blue-200",
      subtitleClass: "text-blue-400",
      borderClass: "border-blue-500/20 shadow-blue-500/10",
    },
    {
      title: "Monthly Expenses",
      value: dashboard?.monthly_expenses ?? 0,
      subtitle: "Filtered period expenses",
      icon: CreditCard,
      titleClass: "text-purple-300",
      valueClass: "text-purple-200",
      subtitleClass: "text-purple-400",
      borderClass: "border-purple-500/20 shadow-purple-500/10",
    },
    {
      title: "Waste Spending",
      value: dashboard?.waste_spending ?? 0,
      subtitle: "Non-essential spending",
      icon: AlertTriangle,
      titleClass: "text-orange-300",
      valueClass: "text-orange-200",
      subtitleClass: "text-orange-400",
      borderClass: "border-orange-500/20 shadow-orange-500/10",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse pointer-events-none"></div>

      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse pointer-events-none"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse pointer-events-none"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/6 w-24 h-24 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse pointer-events-none"
        style={{ animationDelay: "1s" }}
      ></div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cyan-500/10 rounded-full animate-spin pointer-events-none"
        style={{ animationDuration: "20s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-blue-500/10 rounded-full animate-spin pointer-events-none"
        style={{ animationDuration: "15s", animationDirection: "reverse" }}
      ></div>

      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-40 pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        ></div>
      ))}

      <div className="relative z-10 p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              💰 Wealth Dashboard
            </h1>
            <p className="text-slate-300 font-mono mt-1">Your complete financial command center</p>
          </div>
          <WealthFilters onChange={setFilter} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <Card
                key={card.title}
                className={`bg-gradient-to-br from-slate-800/50 to-slate-700/50 ${card.borderClass} shadow-2xl backdrop-blur-sm`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className={`text-sm font-mono ${card.titleClass} flex items-center`}>
                    <Icon className="mr-2 h-4 w-4" />
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-28 mb-2 bg-slate-900/50" />
                      <Skeleton className="h-3 w-36 bg-slate-900/50" />
                    </>
                  ) : (
                    <>
                      <div className={`text-2xl font-bold font-mono ${card.valueClass}`}>
                        {formatCurrency(card.value)}
                      </div>
                      <p className={`text-xs font-mono ${card.subtitleClass}`}>{card.subtitle}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-fit mx-auto grid-cols-4 bg-slate-800/50 border-slate-600/50 backdrop-blur-sm">
            {WEALTH_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <OverviewTab
            monthlyIncome={dashboard?.monthly_income ?? 0}
            monthlyExpenses={dashboard?.monthly_expenses ?? 0}
            periodNet={dashboard?.net_savings ?? 0}
            wasteSpending={dashboard?.waste_spending ?? 0}
            transactions={dashboard?.transactions ?? []}
            categoryTotals={dashboard?.category_totals ?? []}
            filter={resolvedFilter}
            isLoading={isLoading}
          />
          <BudgetTab
            categoryBudgets={dashboard?.category_budgets ?? []}
            filter={resolvedFilter}
            isLoading={isLoading}
            onCreateBudget={createBudget}
            onUpdateBudget={updateBudget}
            onDeleteBudget={deleteBudget}
            isCreatingBudget={isCreatingBudget}
            isUpdatingBudget={isUpdatingBudget}
            isDeletingBudget={isDeletingBudget}
          />
          <CategoriesTab categoryTotals={dashboard?.category_totals ?? []} isLoading={isLoading} />
          <TransactionsTab
            transactions={dashboard?.transactions ?? []}
            isLoading={isLoading}
            onCreateTransaction={createTransaction}
            onUpdateTransaction={updateTransaction}
            onDeleteTransaction={deleteTransaction}
            isCreatingTransaction={isCreatingTransaction}
            isUpdatingTransaction={isUpdatingTransaction}
            isDeletingTransaction={isDeletingTransaction}
          />
        </Tabs>
      </div>
    </div>
  )
}
