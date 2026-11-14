"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, CreditCard, AlertTriangle } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import { WEALTH_TABS } from "./_components/constants"
import { BudgetTab } from "./_components/BudgetTab"
import { CategoriesTab } from "./_components/CategoriesTab"
import { OverviewTab } from "./_components/OverviewTab"
import { ScopeToggle } from "./_components/ScopeToggle"
import { TransactionsTab } from "./_components/TransactionsTab"
import { WealthFilters } from "./_components/WealthFilters"
import { useWealth } from "./_hooks/useWealth"
import type { WealthFilter, WealthScope } from "@/lib/api/wealth"

type WealthTabValue = (typeof WEALTH_TABS)[number]["value"]

function getInitialFilter(): WealthFilter {
  const now = new Date()
  return {
    mode: "month",
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

function isWealthTab(value: string | null): value is WealthTabValue {
  return WEALTH_TABS.some((tab) => tab.value === value)
}

function isWealthScope(value: string | null): value is WealthScope {
  return value === "personal" || value === "farm"
}

export default function WealthPage() {
  const { formatCurrency } = useCurrency()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [filter, setFilter] = useState<WealthFilter>(getInitialFilter)
  const [activeTab, setActiveTab] = useState<WealthTabValue>(() => {
    const tab = searchParams.get("tab")
    return isWealthTab(tab) ? tab : "overview"
  })
  const [scope, setScope] = useState<WealthScope>(() => {
    const value = searchParams.get("scope")
    return isWealthScope(value) ? value : "personal"
  })

  const {
    combined,
    dashboardFor,
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

  const dashboard = dashboardFor(scope)
  const readOnly = scope === "farm"

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (isWealthTab(tab)) setActiveTab(tab)
    const nextScope = searchParams.get("scope")
    if (isWealthScope(nextScope)) setScope(nextScope)
  }, [searchParams])

  const syncUrl = (nextTab: WealthTabValue, nextScope: WealthScope) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", nextTab)
    params.set("scope", nextScope)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleTabChange = (value: string) => {
    const nextTab = value as WealthTabValue
    setActiveTab(nextTab)
    syncUrl(nextTab, scope)
  }

  const handleScopeChange = (nextScope: WealthScope) => {
    setScope(nextScope)
    syncUrl(activeTab, nextScope)
  }

  const resolvedFilter =
    dashboard?.filter ??
    (filter.mode === "month"
      ? { mode: "month" as const, year: filter.year, month: filter.month }
      : {
          mode: "year" as const,
          start_year: filter.startYear,
          end_year: filter.endYear,
        })

  const netWorth = combined.net_worth
  const isNegativeNetWorth = netWorth < 0

  const summaryCards = [
    {
      title: "Net Worth",
      value: netWorth,
      subtitle: "Personal + farm (all time)",
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
      value: combined.monthly_income,
      subtitle: "Personal + farm (filtered period)",
      icon: DollarSign,
      titleClass: "text-blue-300",
      valueClass: "text-blue-200",
      subtitleClass: "text-blue-400",
      cardClass: "astra-card",
    },
    {
      title: "Monthly Expenses",
      value: combined.monthly_expenses,
      subtitle: "Personal + farm (filtered period)",
      icon: CreditCard,
      titleClass: "text-purple-300",
      valueClass: "text-purple-200",
      subtitleClass: "text-purple-400",
      cardClass: "astra-card",
    },
    {
      title: "Waste Spending",
      value: combined.waste_spending,
      subtitle: "Personal non-essential spending",
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
          <h1 className="astra-title">Wealth</h1>
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

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="astra-tabs grid w-fit mx-auto grid-cols-4">
          {WEALTH_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="astra-tab">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <ScopeToggle value={scope} onChange={handleScopeChange} />
          {readOnly && (
            <p className="text-xs font-mono text-emerald-400/90">
              Farm ledger is view-only in Astra — manage it in FarmPilot.
            </p>
          )}
        </div>

        <OverviewTab
          monthlyIncome={dashboard.monthly_income}
          monthlyExpenses={dashboard.monthly_expenses}
          periodNet={dashboard.net_savings}
          wasteSpending={dashboard.waste_spending}
          transactions={dashboard.transactions}
          categoryTotals={dashboard.category_totals}
          filter={resolvedFilter}
          isLoading={isLoading}
        />
        <BudgetTab
          categoryBudgets={dashboard.category_budgets}
          filter={resolvedFilter}
          isLoading={isLoading}
          readOnly={readOnly}
          scope={scope}
          onCreateBudget={createBudget}
          onUpdateBudget={updateBudget}
          onDeleteBudget={deleteBudget}
          isCreatingBudget={isCreatingBudget}
          isUpdatingBudget={isUpdatingBudget}
          isDeletingBudget={isDeletingBudget}
        />
        <CategoriesTab
          categoryTotals={dashboard.category_totals}
          incomeCategoryTotals={dashboard.income_category_totals}
          isLoading={isLoading}
          scope={scope}
        />
        <TransactionsTab
          transactions={dashboard.transactions}
          isLoading={isLoading}
          readOnly={readOnly}
          scope={scope}
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
