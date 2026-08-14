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

  const netWorth = dashboard?.net_worth ?? 0
  const isNegativeNetWorth = netWorth < 0

  const summaryCards = [
    {
      title: "Net Worth",
      value: netWorth,
      subtitle: "Total income minus expenses (all time)",
      icon: TrendingUp,
      titleClass: isNegativeNetWorth ? "text-red-300" : "text-green-300",
      valueClass: isNegativeNetWorth ? "text-red-200" : "text-green-200",
      subtitleClass: isNegativeNetWorth ? "text-red-400" : "text-green-400",
      cardClass: isNegativeNetWorth
        ? "astra-card border-red-500/20"
        : "astra-card border-green-500/20",
    },
    {
      title: "Monthly Income",
      value: dashboard?.monthly_income ?? 0,
      subtitle: "Filtered period income",
      icon: DollarSign,
      titleClass: "text-blue-300",
      valueClass: "text-blue-200",
      subtitleClass: "text-blue-400",
      cardClass: "astra-card",
    },
    {
      title: "Monthly Expenses",
      value: dashboard?.monthly_expenses ?? 0,
      subtitle: "Filtered period expenses",
      icon: CreditCard,
      titleClass: "text-purple-300",
      valueClass: "text-purple-200",
      subtitleClass: "text-purple-400",
      cardClass: "astra-card",
    },
    {
      title: "Waste Spending",
      value: dashboard?.waste_spending ?? 0,
      subtitle: "Non-essential spending",
      icon: AlertTriangle,
      titleClass: "text-orange-300",
      valueClass: "text-orange-200",
      subtitleClass: "text-orange-400",
      cardClass: "astra-card",
    },
  ]

  return (
    <div className="astra-page">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="astra-title">💰 Wealth Dashboard</h1>
            <p className="astra-subtitle mt-1">Your complete financial command center</p>
          </div>
          <WealthFilters onChange={setFilter} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.title} className={card.cardClass}>
                <CardHeader className="pb-2">
                  <CardTitle className={`text-sm font-mono ${card.titleClass} flex items-center`}>
                    <Icon className="mr-2 h-4 w-4" />
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-28 mb-2" />
                      <Skeleton className="h-3 w-36" />
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
          <TabsList className="astra-tabs grid w-fit mx-auto grid-cols-4">
            {WEALTH_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="astra-tab"
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
          <CategoriesTab
            categoryTotals={dashboard?.category_totals ?? []}
            incomeCategoryTotals={dashboard?.income_category_totals ?? []}
            isLoading={isLoading}
          />
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
  )
}
