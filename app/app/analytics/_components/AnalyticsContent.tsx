"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Activity,
  Award,
  BarChart3,
  Brain,
  Calendar,
  CheckSquare,
  Clock,
  Coffee,
  DollarSign,
  Download,
  FileText,
  Heart,
  PieChart as PieChartIcon,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import { useAnalytics } from "../_hooks/useAnalytics"
import type { AnalyticsPeriod } from "../_utils/dateRanges"
import {
  STATIC_AI_COACH,
  STATIC_AI_PREDICTIONS,
  STATIC_AI_STORY_OF_WEEK,
  STATIC_CROSS_DOMAIN_INSIGHTS,
  STATIC_DAILY_AI_INSIGHT,
  STATIC_GOAL_AI_PREDICTION,
  STATIC_MONTHLY_AI_INSIGHT,
} from "./staticInsights"

const taskChartConfig = {
  completed: { label: "Completed", color: "hsl(var(--primary))" },
  total: { label: "Due", color: "hsl(var(--muted-foreground))" },
} satisfies ChartConfig

const expenseChartConfig = {
  value: { label: "Spent", color: "hsl(var(--primary))" },
} satisfies ChartConfig

const monthChartConfig = {
  spending: { label: "Spending", color: "#22d3ee" },
  exerciseMinutes: { label: "Exercise (min)", color: "#34d399" },
  focusHours: { label: "Focus (h)", color: "#a78bfa" },
} satisfies ChartConfig

const chartClassName =
  "h-48 w-full aspect-auto [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/40"

function achievementIcon(kind: string) {
  if (kind === "wealth") return DollarSign
  if (kind === "health") return Heart
  if (kind === "tasks") return CheckSquare
  return FileText
}

export function AnalyticsContent() {
  const { formatCurrency } = useCurrency()
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>("week")
  const { analytics, isLoading, isError, refetch } = useAnalytics(selectedPeriod)

  const handleExport = () => {
    toast.message("Export Report", {
      description: "Live export is coming soon.",
    })
  }

  const periodTitle =
    selectedPeriod === "day" ? "Today" : selectedPeriod === "week" ? "This week" : "This month"

  if (isLoading || !analytics) {
    return (
      <div className="astra-page space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-6 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="astra-page">
        <Card className="astra-card">
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">Couldn’t load analytics.</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const snapshot = analytics.dailySnapshot
  const taskTotal = snapshot.tasksCompleted + snapshot.tasksPending

  return (
    <div className="astra-page space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="astra-title text-4xl">Analytics Dashboard</h1>
          <p className="astra-subtitle mt-2 text-lg">Your Personal Life Intelligence Report</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-border bg-card/50 text-foreground hover:bg-accent"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Badge variant="secondary" className="astra-score-badge text-lg px-4 py-2">
            <Star className="mr-2 h-4 w-4" />
            Life Score: {analytics.lifeScoreOverall}
          </Badge>
        </div>
      </div>

      <Card className="astra-card">
        <CardHeader>
          <CardTitle className="font-poppins text-primary flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Life Score Breakdown
          </CardTitle>
          <CardDescription className="font-inter text-muted-foreground">
            Calculated from tasks, health, wealth, notes, goals, and focus time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {analytics.categories.map((category) => (
              <div key={category.name} className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <h3 className="font-semibold font-inter text-sm text-foreground">
                    {category.name}
                  </h3>
                  {category.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-primary" />
                  ) : category.trend === "down" ? (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  ) : null}
                </div>
                <div className="text-3xl font-bold font-poppins text-primary">{category.score}</div>
                <Progress value={category.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="astra-card">
        <CardHeader>
          <CardTitle className="font-poppins text-foreground flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            {periodTitle} Snapshot
          </CardTitle>
          <CardDescription>
            Live totals for the selected {selectedPeriod}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <CheckSquare className="h-8 w-8 mx-auto text-primary" />
              <div className="text-2xl font-bold font-poppins text-foreground">
                {snapshot.tasksCompleted}/{taskTotal || 0}
              </div>
              <p className="text-sm font-inter text-muted-foreground">Tasks due</p>
            </div>
            <div className="text-center space-y-2">
              <DollarSign className="h-8 w-8 mx-auto text-primary" />
              <div className="text-2xl font-bold font-poppins text-foreground">
                {formatCurrency(snapshot.spending)}/{formatCurrency(snapshot.budget)}
              </div>
              <p className="text-sm font-inter text-muted-foreground">Spending vs budget</p>
            </div>
            <div className="text-center space-y-2">
              <Activity className="h-8 w-8 mx-auto text-primary" />
              <div className="text-2xl font-bold font-poppins text-foreground">
                {snapshot.exerciseMinutes}/{snapshot.exerciseGoal}
              </div>
              <p className="text-sm font-inter text-muted-foreground">Exercise minutes</p>
            </div>
            <div className="text-center space-y-2">
              <Clock className="h-8 w-8 mx-auto text-primary" />
              <div className="text-2xl font-bold font-poppins text-foreground">
                {snapshot.focusHours}h
              </div>
              <p className="text-sm font-inter text-muted-foreground">Focus time</p>
            </div>
          </div>
          <div className="mt-6 p-4 astra-panel">
            <div className="flex items-center">
              <Brain className="h-5 w-5 text-primary mr-2 shrink-0" />
              <p className="font-inter text-sm text-muted-foreground">
                <strong>AI Insight:</strong> {STATIC_DAILY_AI_INSIGHT}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={selectedPeriod}
        onValueChange={(value) => setSelectedPeriod(value as AnalyticsPeriod)}
        className="space-y-6"
      >
        <TabsList className="astra-tabs grid w-full grid-cols-3">
          <TabsTrigger value="day" className="font-inter astra-tab">
            Daily
          </TabsTrigger>
          <TabsTrigger value="week" className="font-inter astra-tab">
            Weekly
          </TabsTrigger>
          <TabsTrigger value="month" className="font-inter astra-tab">
            Monthly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="day" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="text-base">Notes today</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-primary">
                {snapshot.notesCreated}
              </CardContent>
            </Card>
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="text-base">Overdue tasks</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-primary">
                {analytics.summary.overdueTasks}
              </CardContent>
            </Card>
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="text-base">Active goals</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-primary">
                {analytics.summary.activeGoals}
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-poppins flex items-center text-foreground">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Today&apos;s Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.taskCompletionWeek.every((point) => point.total === 0) ? (
                  <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                    No tasks due today
                  </div>
                ) : (
                  <ChartContainer config={taskChartConfig} className={chartClassName}>
                    <BarChart data={analytics.taskCompletionWeek}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                      <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-poppins flex items-center text-foreground">
                  <PieChartIcon className="mr-2 h-5 w-5" />
                  Today&apos;s Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.expenseDistribution.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                    No expenses today
                  </div>
                ) : (
                  <ChartContainer config={expenseChartConfig} className={chartClassName}>
                    <PieChart>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            nameKey="label"
                            formatter={(value) => formatCurrency(Number(value))}
                          />
                        }
                      />
                      <Pie
                        data={analytics.expenseDistribution}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={2}
                        stroke="transparent"
                      >
                        {analytics.expenseDistribution.map((slice) => (
                          <Cell key={slice.category} fill={slice.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-poppins flex items-center text-foreground">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Tasks Completion
                </CardTitle>
                <CardDescription>Due vs completed for {selectedPeriod}</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.taskCompletionWeek.every((point) => point.total === 0) ? (
                  <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                    No tasks due this week
                  </div>
                ) : (
                  <ChartContainer config={taskChartConfig} className={chartClassName}>
                    <BarChart data={analytics.taskCompletionWeek}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                      <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-poppins flex items-center text-foreground">
                  <PieChartIcon className="mr-2 h-5 w-5" />
                  Expense Distribution
                </CardTitle>
                <CardDescription>Spending for selected {selectedPeriod}</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.expenseDistribution.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                    No expenses this month
                  </div>
                ) : (
                  <ChartContainer config={expenseChartConfig} className={chartClassName}>
                    <PieChart>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            nameKey="label"
                            formatter={(value) => formatCurrency(Number(value))}
                          />
                        }
                      />
                      <Pie
                        data={analytics.expenseDistribution}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={2}
                        stroke="transparent"
                      >
                        {analytics.expenseDistribution.map((slice) => (
                          <Cell key={slice.category} fill={slice.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="astra-card">
            <CardHeader>
              <CardTitle className="font-poppins flex items-center text-foreground">
                <Award className="mr-2 h-5 w-5" />
                Period Highlights
              </CardTitle>
              <CardDescription>Based on {selectedPeriod} activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics.weeklyHighlights.map((highlight) => (
                  <div key={highlight.title} className="text-center p-4 astra-panel">
                    <h3 className="font-semibold font-inter text-sm mb-1 text-foreground">
                      {highlight.title}
                    </h3>
                    <p className="text-xs font-inter text-muted-foreground">{highlight.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-6">
          <Card className="astra-card">
            <CardHeader>
              <CardTitle className="font-poppins flex items-center text-foreground">
                Monthly Trends
              </CardTitle>
              <CardDescription>
                Spending, exercise, and focus for selected {selectedPeriod}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.monthlyTrends.every(
                (point) =>
                  point.spending === 0 && point.exerciseMinutes === 0 && point.focusHours === 0
              ) ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  No monthly activity yet
                </div>
              ) : (
                <ChartContainer config={monthChartConfig} className="h-64 w-full aspect-auto">
                  <LineChart data={analytics.monthlyTrends}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} hide />
                    <YAxis tickLine={false} axisLine={false} width={36} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="spending"
                      stroke="var(--color-spending)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="exerciseMinutes"
                      stroke="var(--color-exerciseMinutes)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="focusHours"
                      stroke="var(--color-focusHours)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              )}
              <div className="mt-4 p-4 astra-panel">
                <p className="font-inter text-sm text-muted-foreground">
                  <strong>Monthly Insight:</strong> {STATIC_MONTHLY_AI_INSIGHT}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="astra-card">
        <CardHeader>
          <CardTitle className="font-poppins flex items-center text-primary">
            <Zap className="mr-2 h-5 w-5 text-yellow-400" />
            Cross-Domain Insights (ASTRA Magic)
          </CardTitle>
          <CardDescription className="font-inter text-muted-foreground">
            Discover hidden patterns across your life domains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {STATIC_CROSS_DOMAIN_INSIGHTS.map((insight) => {
              const Icon = insight.icon
              return (
                <div key={insight.title} className="p-4 astra-panel">
                  <div className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-semibold font-inter text-sm mb-1 text-foreground">
                        {insight.title}
                      </h3>
                      <p className="text-sm font-inter text-muted-foreground">{insight.insight}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 p-4 astra-panel">
            <div className="flex items-center">
              <Coffee className="h-5 w-5 text-primary mr-2 shrink-0" />
              <p className="font-inter text-sm text-muted-foreground">
                <strong>AI Story of the Week:</strong> {STATIC_AI_STORY_OF_WEEK}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="font-poppins flex items-center text-foreground">
              <Award className="mr-2 h-5 w-5" />
              Achievements & Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {analytics.achievements.map((achievement) => {
                const Icon = achievementIcon(achievement.kind)
                return (
                  <div
                    key={achievement.name}
                    className={`p-3 rounded-lg text-center ${
                      achievement.earned
                        ? "astra-panel"
                        : "bg-secondary/40 border border-border opacity-50"
                    } backdrop-blur-sm`}
                  >
                    <Icon
                      className={`h-6 w-6 mx-auto mb-2 ${
                        achievement.earned ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <h3 className="font-semibold font-inter text-xs mb-1 text-foreground">
                      {achievement.name}
                    </h3>
                    <p className="text-xs font-inter text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="font-poppins flex items-center text-foreground">
              <Target className="mr-2 h-5 w-5" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.goalProgress.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active goals yet.</p>
            ) : (
              <div className="space-y-4">
                {analytics.goalProgress.map((goal) => (
                  <div key={goal.id}>
                    <div className="flex justify-between items-center mb-2 gap-2">
                      <span className="font-inter text-sm text-foreground truncate">
                        {goal.title}
                      </span>
                      <span className="font-inter text-sm text-muted-foreground shrink-0">
                        {goal.progress}%
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 p-3 astra-panel">
              <p className="font-inter text-sm text-muted-foreground">
                <strong>AI Prediction:</strong> {STATIC_GOAL_AI_PREDICTION}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="astra-card">
        <CardHeader>
          <CardTitle className="font-poppins flex items-center text-foreground">
            <Brain className="mr-2 h-5 w-5" />
            AI Predictions & Coaching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold font-inter text-foreground">Predictive Forecasts</h3>
              {STATIC_AI_PREDICTIONS.map((text) => (
                <div key={text} className="p-4 astra-panel">
                  <p className="font-inter text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold font-inter text-foreground">AI Coach Recommendations</h3>
              {STATIC_AI_COACH.map((item) => (
                <div key={item.label} className="p-4 astra-panel">
                  <p className="font-inter text-sm text-muted-foreground">
                    <strong>{item.label}:</strong> {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
