"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Zap,
  Award,
  Download,
  Brain,
  Clock,
  DollarSign,
  Heart,
  CheckSquare,
  FileText,
  Star,
  Coffee,
  Moon,
  Activity,
  PieChart,
  LineChart,
} from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"

export default function AnalyticsPage() {
  const { formatCurrency } = useCurrency()
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  const lifeScoreData = {
    overall: 85,
    categories: [
      { name: "Productivity", score: 88, trend: "up", color: "blue" },
      { name: "Health", score: 82, trend: "up", color: "green" },
      { name: "Wealth", score: 90, trend: "up", color: "yellow" },
      { name: "Knowledge", score: 78, trend: "down", color: "purple" },
      { name: "Communication", score: 85, trend: "up", color: "pink" },
    ],
  }

  const dailySnapshot = {
    tasksCompleted: 8,
    tasksPending: 3,
    spending: 47,
    budget: 80,
    steps: 8500,
    stepGoal: 10000,
    notesCreated: 2,
    focusTime: 3.2,
  }

  const weeklyHighlights = [
    { title: "Best Habit", value: "Meditation (7/7 days)", icon: Award, color: "green" },
    { title: "Biggest Expense", value: "Rent (40%)", icon: DollarSign, color: "red" },
    { title: "Most Productive Day", value: "Wednesday", icon: TrendingUp, color: "blue" },
    { title: "Health Streak", value: "5-day workout streak", icon: Heart, color: "pink" },
  ]

  const crossDomainInsights = [
    {
      title: "Sleep & Spending Correlation",
      insight: "On weeks you sleep less, your food spending rises 25% (late-night snacks).",
      icon: Moon,
      color: "purple",
    },
    {
      title: "Tasks & Mood Connection",
      insight: "On days with fewer overdue tasks, you reported better mood.",
      icon: CheckSquare,
      color: "blue",
    },
    {
      title: "Notes & Goals Link",
      insight: "You wrote 4 notes about fitness — link them to your Health Goal?",
      icon: FileText,
      color: "green",
    },
  ]

  const achievements = [
    { name: "Budget Master", description: "Under budget for 4 weeks", icon: DollarSign, earned: true },
    { name: "Health Streak 30", description: "30-day workout streak", icon: Heart, earned: true },
    { name: "Inbox Zero Champion", description: "Maintained inbox zero for 7 days", icon: CheckSquare, earned: false },
    { name: "Knowledge Seeker", description: "Created 50+ notes this month", icon: FileText, earned: true },
  ]

  return (
    <div className="astra-page space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="astra-title text-4xl">Analytics Dashboard</h1>
            <p className="astra-subtitle mt-2 text-lg">Your Personal Life Intelligence Report</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="border-border bg-card/50 text-foreground hover:bg-accent"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Badge
              variant="secondary"
              className="astra-score-badge text-lg px-4 py-2"
            >
              <Star className="mr-2 h-4 w-4" />
              Life Score: {lifeScoreData.overall}
            </Badge>
          </div>
        </div>

        {/* Life Score Overview */}
        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="font-poppins text-primary flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Life Score Breakdown
            </CardTitle>
            <CardDescription className="font-inter text-muted-foreground">
              Combined metric across all life domains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {lifeScoreData.categories.map((category) => (
                <div key={category.name} className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <h3 className="font-semibold font-inter text-sm text-foreground">{category.name}</h3>
                    {category.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-primary" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <div className="text-3xl font-bold font-poppins text-primary">{category.score}</div>
                  <Progress value={category.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Snapshot */}
        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="font-poppins text-foreground flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Today's Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <CheckSquare className="h-8 w-8 mx-auto text-primary" />
                <div className="text-2xl font-bold font-poppins text-foreground">
                  {dailySnapshot.tasksCompleted}/{dailySnapshot.tasksCompleted + dailySnapshot.tasksPending}
                </div>
                <p className="text-sm font-inter text-muted-foreground">Tasks Completed</p>
              </div>
              <div className="text-center space-y-2">
                <DollarSign className="h-8 w-8 mx-auto text-primary" />
                <div className="text-2xl font-bold font-poppins text-foreground">
                  {formatCurrency(dailySnapshot.spending)}/{formatCurrency(dailySnapshot.budget)}
                </div>
                <p className="text-sm font-inter text-muted-foreground">Spending vs Budget</p>
              </div>
              <div className="text-center space-y-2">
                <Activity className="h-8 w-8 mx-auto text-primary" />
                <div className="text-2xl font-bold font-poppins text-foreground">
                  {dailySnapshot.steps.toLocaleString()}
                </div>
                <p className="text-sm font-inter text-muted-foreground">Steps Today</p>
              </div>
              <div className="text-center space-y-2">
                <Clock className="h-8 w-8 mx-auto text-primary" />
                <div className="text-2xl font-bold font-poppins text-foreground">{dailySnapshot.focusTime}h</div>
                <p className="text-sm font-inter text-muted-foreground">Focus Time</p>
              </div>
            </div>
            <div className="mt-6 p-4 astra-panel">
              <div className="flex items-center">
                <Brain className="h-5 w-5 text-primary mr-2" />
                <p className="font-inter text-sm text-muted-foreground">
                  <strong>AI Insight:</strong> You're on track in Wealth & Health, but Productivity dropped 15% this
                  week.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="space-y-6">
          <TabsList className="astra-tabs grid w-full grid-cols-3">
            <TabsTrigger
              value="day"
              className="font-inter astra-tab"
            >
              Daily
            </TabsTrigger>
            <TabsTrigger
              value="week"
              className="font-inter astra-tab"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="font-inter astra-tab"
            >
              Monthly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="space-y-6">
            {/* Weekly Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="astra-card">
                <CardHeader>
                  <CardTitle className="font-poppins flex items-center text-foreground">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Tasks Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-muted-foreground">
                    <BarChart3 className="h-16 w-16" />
                    <span className="ml-3 font-inter">Weekly task completion chart</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="astra-card">
                <CardHeader>
                  <CardTitle className="font-poppins flex items-center text-foreground">
                    <PieChart className="mr-2 h-5 w-5" />
                    Expense Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-muted-foreground">
                    <PieChart className="h-16 w-16" />
                    <span className="ml-3 font-inter">Expense category breakdown</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Highlights */}
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-poppins flex items-center text-foreground">
                  <Award className="mr-2 h-5 w-5" />
                  Weekly Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {weeklyHighlights.map((highlight, index) => {
                    const Icon = highlight.icon
                    return (
                      <div
                        key={index}
                        className="text-center p-4 astra-panel"
                      >
                        <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-semibold font-inter text-sm mb-1 text-foreground">{highlight.title}</h3>
                        <p className="text-xs font-inter text-muted-foreground">{highlight.value}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month" className="space-y-6">
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-poppins flex items-center text-foreground">
                  <LineChart className="mr-2 h-5 w-5" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <LineChart className="h-16 w-16" />
                  <span className="ml-3 font-inter">Monthly trend analysis</span>
                </div>
                <div className="mt-4 p-4 astra-panel">
                  <p className="font-inter text-sm text-muted-foreground">
                    <strong>Monthly Insight:</strong> You saved 12% more than last month but slept 30 min less per
                    night.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cross-Domain Insights */}
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
              {crossDomainInsights.map((insight, index) => {
                const Icon = insight.icon
                return (
                  <div
                    key={index}
                    className="p-4 astra-panel"
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 mt-0.5 text-primary" />
                      <div>
                        <h3 className="font-semibold font-inter text-sm mb-1 text-foreground">{insight.title}</h3>
                        <p className="text-sm font-inter text-muted-foreground">{insight.insight}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 p-4 astra-panel">
              <div className="flex items-center">
                <Coffee className="h-5 w-5 text-primary mr-2" />
                <p className="font-inter text-sm text-muted-foreground">
                  <strong>AI Story of the Week:</strong> This week you worked 20% more hours, slept 1 hour less per
                  night, and spent 10% more on coffee ☕.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gamification & Achievements */}
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
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-center ${achievement.earned
                          ? "astra-panel"
                          : "bg-secondary/40 border border-border opacity-50"
                        } backdrop-blur-sm`}
                    >
                      <Icon
                        className={`h-6 w-6 mx-auto mb-2 ${achievement.earned ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <h3 className="font-semibold font-inter text-xs mb-1 text-foreground">{achievement.name}</h3>
                      <p className="text-xs font-inter text-muted-foreground">{achievement.description}</p>
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
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-inter text-sm text-foreground">Save {formatCurrency(10000)}</span>
                    <span className="font-inter text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-inter text-sm text-foreground">Run 10K</span>
                    <span className="font-inter text-sm text-muted-foreground">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-inter text-sm text-foreground">Read 24 Books</span>
                    <span className="font-inter text-sm text-muted-foreground">50%</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
              </div>
              <div className="mt-4 p-3 astra-panel">
                <p className="font-inter text-sm text-muted-foreground">
                  <strong>AI Prediction:</strong> You're 75% done with your 10K run goal. Keep up the streak — finish in
                  2 weeks.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Future Predictions */}
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
                <div className="p-4 astra-panel">
                  <p className="font-inter text-sm text-muted-foreground">
                    If you keep this pace, your Life Score will reach 90/100 in 2 months.
                  </p>
                </div>
                <div className="p-4 astra-panel">
                  <p className="font-inter text-sm text-muted-foreground">
                    At this savings rate, you'll reach your {formatCurrency(10000)} goal by December.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold font-inter text-foreground">AI Coach Recommendations</h3>
                <div className="p-4 astra-panel">
                  <p className="font-inter text-sm text-muted-foreground">
                    <strong>Next Week Focus:</strong> Prioritize sleep + budgeting for optimal performance.
                  </p>
                </div>
                <div className="p-4 astra-panel">
                  <p className="font-inter text-sm text-muted-foreground">
                    <strong>Scenario:</strong> Cut {formatCurrency(50)} dining + add 2 workouts = 8-point Life Score boost.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
