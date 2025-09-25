"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  AlertTriangle,
  Target,
  BarChart3,
  Plus,
  Smartphone,
  Coffee,
  Car,
  Home,
  ShoppingBag,
  Plane,
  Brain,
  PieChart,
  LineChart,
  Activity,
} from "lucide-react"

export default function WealthPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)

  // Mock data
  const netWorth = 45750
  const monthlyIncome = 5200
  const monthlyExpenses = 3850
  const netSavings = monthlyIncome - monthlyExpenses
  const wasteSpending = 420

  const budgetCategories = [
    { name: "Food & Dining", spent: 680, budget: 800, icon: Coffee, color: "from-orange-500 to-red-500" },
    { name: "Transportation", spent: 320, budget: 400, icon: Car, color: "from-blue-500 to-cyan-500" },
    { name: "Housing", spent: 1200, budget: 1200, icon: Home, color: "from-green-500 to-emerald-500" },
    { name: "Shopping", spent: 450, budget: 300, icon: ShoppingBag, color: "from-purple-500 to-pink-500" },
    { name: "Entertainment", spent: 180, budget: 250, icon: Smartphone, color: "from-indigo-500 to-purple-500" },
    { name: "Travel", spent: 0, budget: 200, icon: Plane, color: "from-teal-500 to-blue-500" },
  ]

  const savingsGoals = [
    { name: "Emergency Fund", current: 8500, target: 15000, priority: "High", deadline: "Dec 2024" },
    { name: "New Laptop", current: 800, target: 1500, priority: "Medium", deadline: "Mar 2024" },
    { name: "Vacation Fund", current: 2200, target: 3000, priority: "Low", deadline: "Jun 2024" },
  ]

  const investments = [
    { name: "S&P 500 ETF", value: 12500, returns: 8.5, risk: "Medium" },
    { name: "Tech Stocks", value: 8200, returns: -2.3, risk: "High" },
    { name: "Bonds", value: 5000, returns: 3.2, risk: "Low" },
    { name: "Crypto", value: 3500, returns: 15.7, risk: "High" },
  ]

  const recentTransactions = [
    { id: 1, description: "Grocery Store", amount: -85.5, category: "Food & Dining", date: "Today", method: "Card" },
    { id: 2, description: "Salary Deposit", amount: 2600, category: "Income", date: "Yesterday", method: "Bank" },
    {
      id: 3,
      description: "Netflix Subscription",
      amount: -15.99,
      category: "Entertainment",
      date: "2 days ago",
      method: "Card",
    },
    {
      id: 4,
      description: "Gas Station",
      amount: -45.2,
      category: "Transportation",
      date: "3 days ago",
      method: "Card",
    },
    { id: 5, description: "Coffee Shop", amount: -12.5, category: "Food & Dining", date: "3 days ago", method: "Card" },
  ]

  const aiInsights = [
    { type: "success", message: "🎉 You saved 20% more than last month! Keep up the great work." },
    {
      type: "warning",
      message: "⚠️ Your shopping expenses are 50% over budget. Consider reducing non-essential purchases.",
    },
    { type: "tip", message: "💡 You spent $125 on coffee this month. Making coffee at home could save you $90/month." },
    {
      type: "prediction",
      message: "📈 At your current savings rate, you'll reach your emergency fund goal 2 months early!",
    },
  ]

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100
    if (percentage >= 100) return { color: "text-red-500", bg: "bg-red-500", status: "Over Budget" }
    if (percentage >= 80) return { color: "text-yellow-500", bg: "bg-yellow-500", status: "Near Limit" }
    return { color: "text-green-500", bg: "bg-green-500", status: "On Track" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/6 w-24 h-24 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Holographic rings */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cyan-500/10 rounded-full animate-spin pointer-events-none"
        style={{ animationDuration: "20s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-blue-500/10 rounded-full animate-spin pointer-events-none"
        style={{ animationDuration: "15s", animationDirection: "reverse" }}
      ></div>

      {/* Floating particles */}
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              💰 Wealth Dashboard
            </h1>
            <p className="text-slate-300 font-mono mt-1">Your complete financial command center</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border border-cyan-400/20 font-mono shadow-lg shadow-cyan-500/25">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-cyan-500/20 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="font-mono text-slate-200">Add New Transaction</DialogTitle>
                  <DialogDescription className="font-mono text-slate-400">
                    Record your income or expense
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount" className="font-mono text-cyan-200">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      placeholder="0.00"
                      type="number"
                      className="font-mono bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="font-mono text-cyan-200">
                      Description
                    </Label>
                    <Input
                      id="description"
                      placeholder="Transaction description"
                      className="font-mono bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="font-mono text-cyan-200">
                      Category
                    </Label>
                    <Select>
                      <SelectTrigger className="font-mono bg-slate-900/50 border-slate-600/50 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600/50">
                        <SelectItem value="food">Food & Dining</SelectItem>
                        <SelectItem value="transport">Transportation</SelectItem>
                        <SelectItem value="housing">Housing</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 font-mono">
                    Add Transaction
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Net Worth Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-green-500/20 shadow-2xl shadow-green-500/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-green-300 flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Net Worth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-green-200">${netWorth.toLocaleString()}</div>
              <p className="text-xs text-green-400">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/20 shadow-2xl shadow-blue-500/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-blue-300 flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-blue-200">${monthlyIncome.toLocaleString()}</div>
              <p className="text-xs text-blue-400">Salary + Side hustle</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-purple-500/20 shadow-2xl shadow-purple-500/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-purple-300 flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-purple-200">${monthlyExpenses.toLocaleString()}</div>
              <p className="text-xs text-purple-400">-8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-orange-500/20 shadow-2xl shadow-orange-500/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-orange-300 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Waste Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-orange-200">${wasteSpending}</div>
              <p className="text-xs text-orange-400">12% of total expenses</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border-slate-600/50 backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="budget"
              className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Budget
            </TabsTrigger>
            <TabsTrigger
              value="savings"
              className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Savings
            </TabsTrigger>
            <TabsTrigger
              value="investments"
              className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Investments
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Progress Rings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-mono text-center text-slate-200">Budget Progress</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-600/50"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.75)}`}
                        className="text-blue-400"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold font-mono text-slate-200">75%</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 text-center font-mono">$2,875 of $3,850 used</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-green-500/20 shadow-2xl shadow-green-500/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-mono text-center text-green-300">Savings Rate</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-600/50"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.26)}`}
                        className="text-green-400"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold font-mono text-green-200">26%</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 text-center font-mono">${netSavings} saved this month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-purple-500/20 shadow-2xl shadow-purple-500/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-mono text-center text-purple-300">Investment Growth</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-600/50"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.85)}`}
                        className="text-purple-400"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold font-mono text-purple-200">+8.5%</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 text-center font-mono">Portfolio returns YTD</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
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
                      className={`p-3 rounded-lg border backdrop-blur-sm ${insight.type === "success"
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

          <TabsContent value="budget" className="space-y-6">
            <div className="grid gap-4">
              {budgetCategories.map((category, index) => {
                const Icon = category.icon
                const percentage = (category.spent / category.budget) * 100
                const status = getBudgetStatus(category.spent, category.budget)

                return (
                  <Card
                    key={index}
                    className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold font-mono text-slate-200">{category.name}</h3>
                            <p className="text-sm text-slate-400 font-mono">
                              ${category.spent} of ${category.budget}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={percentage >= 100 ? "destructive" : percentage >= 80 ? "secondary" : "default"}
                          className="font-mono"
                        >
                          {status.status}
                        </Badge>
                      </div>
                      <Progress value={Math.min(percentage, 100)} className="h-3" />
                      <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                        <span>{percentage.toFixed(1)}% used</span>
                        <span>${category.budget - category.spent} remaining</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="savings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold font-mono text-slate-200">Savings Goals</h2>
              <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 font-mono border border-cyan-400/20 shadow-lg shadow-cyan-500/25">
                    <Target className="mr-2 h-4 w-4" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-cyan-500/20 backdrop-blur-sm">
                  <DialogHeader>
                    <DialogTitle className="font-mono text-slate-200">Create Savings Goal</DialogTitle>
                    <DialogDescription className="font-mono text-slate-400">
                      Set a new financial target
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="goal-name" className="font-mono text-cyan-200">
                        Goal Name
                      </Label>
                      <Input
                        id="goal-name"
                        placeholder="e.g., Emergency Fund"
                        className="font-mono bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="target-amount" className="font-mono text-cyan-200">
                        Target Amount
                      </Label>
                      <Input
                        id="target-amount"
                        placeholder="0.00"
                        type="number"
                        className="font-mono bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline" className="font-mono text-cyan-200">
                        Target Date
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        className="font-mono bg-slate-900/50 border-slate-600/50 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 font-mono">Create Goal</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {savingsGoals.map((goal, index) => {
                const percentage = (goal.current / goal.target) * 100

                return (
                  <Card
                    key={index}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold font-mono text-slate-200">{goal.name}</h3>
                          <p className="text-sm text-slate-400 font-mono">
                            ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              goal.priority === "High"
                                ? "destructive"
                                : goal.priority === "Medium"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="font-mono"
                          >
                            {goal.priority}
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1 font-mono">{goal.deadline}</p>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-3 mb-2" />
                      <div className="flex justify-between text-xs text-slate-500 font-mono">
                        <span>{percentage.toFixed(1)}% complete</span>
                        <span>${(goal.target - goal.current).toLocaleString()} to go</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="investments" className="space-y-6">
            <div className="grid gap-4">
              {investments.map((investment, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold font-mono text-slate-200">{investment.name}</h3>
                        <p className="text-2xl font-bold mt-1 font-mono text-slate-200">
                          ${investment.value.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`flex items-center ${investment.returns >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {investment.returns >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <span className="font-semibold font-mono">
                            {investment.returns >= 0 ? "+" : ""}
                            {investment.returns}%
                          </span>
                        </div>
                        <Badge
                          variant={
                            investment.risk === "High"
                              ? "destructive"
                              : investment.risk === "Medium"
                                ? "secondary"
                                : "outline"
                          }
                          className="mt-2 font-mono"
                        >
                          {investment.risk} Risk
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-mono text-slate-200">Recent Transactions</CardTitle>
                <CardDescription className="font-mono text-slate-400">Your latest financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-600/30"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${transaction.amount > 0 ? "bg-green-500/20 border border-green-500/30" : "bg-red-500/20 border border-red-500/30"}`}
                        >
                          {transaction.amount > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold font-mono text-slate-200">{transaction.description}</p>
                          <p className="text-sm text-slate-400 font-mono">
                            {transaction.category} • {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold font-mono ${transaction.amount > 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">{transaction.method}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-mono flex items-center text-slate-200">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Monthly Spending Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    <LineChart className="h-12 w-12 mr-2" />
                    <span className="font-mono">Spending trend visualization</span>
                  </div>
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
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    <Activity className="h-12 w-12 mr-2" />
                    <span className="font-mono">Category breakdown chart</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Summary */}
            <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-green-500/20 shadow-2xl shadow-green-500/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-mono text-green-300">Monthly Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400 font-mono">${monthlyIncome.toLocaleString()}</p>
                    <p className="text-sm text-slate-400 font-mono">Total Income</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400 font-mono">${monthlyExpenses.toLocaleString()}</p>
                    <p className="text-sm text-slate-400 font-mono">Total Expenses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400 font-mono">${netSavings.toLocaleString()}</p>
                    <p className="text-sm text-slate-400 font-mono">Net Savings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-400 font-mono">${wasteSpending}</p>
                    <p className="text-sm text-slate-400 font-mono">Waste Spending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
