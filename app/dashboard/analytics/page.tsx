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

export default function AnalyticsPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse delay-2000" />

      {/* Holographic Rings */}
      <div className="absolute top-1/4 right-1/3 w-64 h-64 border border-cyan-500/20 rounded-full animate-spin-slow" />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 border border-blue-500/20 rounded-full animate-spin-slow-reverse" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/60 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-poppins text-cyan-300">Analytics Dashboard</h1>
            <p className="text-slate-300 font-inter mt-2 text-lg">Your Personal Life Intelligence Report</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="font-inter bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700/50"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Badge
              variant="secondary"
              className="text-lg px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0"
            >
              <Star className="mr-2 h-4 w-4" />
              Life Score: {lifeScoreData.overall}
            </Badge>
          </div>
        </div>

        {/* Life Score Overview */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-poppins text-cyan-300 flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Life Score Breakdown
            </CardTitle>
            <CardDescription className="font-inter text-slate-400">
              Combined metric across all life domains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {lifeScoreData.categories.map((category) => (
                <div key={category.name} className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <h3 className="font-semibold font-inter text-sm text-slate-200">{category.name}</h3>
                    {category.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-cyan-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <div className="text-3xl font-bold font-poppins text-cyan-200">{category.score}</div>
                  <Progress value={category.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Snapshot */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-poppins text-slate-200 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Today's Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <CheckSquare className="h-8 w-8 mx-auto text-cyan-400" />
                <div className="text-2xl font-bold font-poppins text-slate-200">
                  {dailySnapshot.tasksCompleted}/{dailySnapshot.tasksCompleted + dailySnapshot.tasksPending}
                </div>
                <p className="text-sm font-inter text-slate-400">Tasks Completed</p>
              </div>
              <div className="text-center space-y-2">
                <DollarSign className="h-8 w-8 mx-auto text-cyan-400" />
                <div className="text-2xl font-bold font-poppins text-slate-200">
                  ${dailySnapshot.spending}/${dailySnapshot.budget}
                </div>
                <p className="text-sm font-inter text-slate-400">Spending vs Budget</p>
              </div>
              <div className="text-center space-y-2">
                <Activity className="h-8 w-8 mx-auto text-cyan-400" />
                <div className="text-2xl font-bold font-poppins text-slate-200">
                  {dailySnapshot.steps.toLocaleString()}
                </div>
                <p className="text-sm font-inter text-slate-400">Steps Today</p>
              </div>
              <div className="text-center space-y-2">
                <Clock className="h-8 w-8 mx-auto text-cyan-400" />
                <div className="text-2xl font-bold font-poppins text-slate-200">{dailySnapshot.focusTime}h</div>
                <p className="text-sm font-inter text-slate-400">Focus Time</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
              <div className="flex items-center">
                <Brain className="h-5 w-5 text-cyan-400 mr-2" />
                <p className="font-inter text-sm text-slate-300">
                  <strong>AI Insight:</strong> You're on track in Wealth & Health, but Productivity dropped 15% this
                  week.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-600">
            <TabsTrigger
              value="day"
              className="font-inter data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
            >
              Daily
            </TabsTrigger>
            <TabsTrigger
              value="week"
              className="font-inter data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="font-inter data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
            >
              Monthly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="space-y-6">
            {/* Weekly Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-poppins flex items-center text-slate-200">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Tasks Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-slate-400">
                    <BarChart3 className="h-16 w-16" />
                    <span className="ml-3 font-inter">Weekly task completion chart</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-poppins flex items-center text-slate-200">
                    <PieChart className="mr-2 h-5 w-5" />
                    Expense Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-slate-400">
                    <PieChart className="h-16 w-16" />
                    <span className="ml-3 font-inter">Expense category breakdown</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Highlights */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-poppins flex items-center text-slate-200">
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
                        className="text-center p-4 bg-slate-800/30 border border-slate-600/30 rounded-lg backdrop-blur-sm"
                      >
                        <Icon className="h-8 w-8 mx-auto mb-2 text-cyan-400" />
                        <h3 className="font-semibold font-inter text-sm mb-1 text-slate-200">{highlight.title}</h3>
                        <p className="text-xs font-inter text-slate-400">{highlight.value}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month" className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-poppins flex items-center text-slate-200">
                  <LineChart className="mr-2 h-5 w-5" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-400">
                  <LineChart className="h-16 w-16" />
                  <span className="ml-3 font-inter">Monthly trend analysis</span>
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
                  <p className="font-inter text-sm text-slate-300">
                    <strong>Monthly Insight:</strong> You saved 12% more than last month but slept 30 min less per
                    night.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cross-Domain Insights */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-poppins flex items-center text-cyan-300">
              <Zap className="mr-2 h-5 w-5 text-yellow-400" />
              Cross-Domain Insights (ASTRA Magic)
            </CardTitle>
            <CardDescription className="font-inter text-slate-400">
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
                    className="p-4 bg-slate-800/30 border border-slate-600/30 rounded-lg backdrop-blur-sm"
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 mt-0.5 text-cyan-400" />
                      <div>
                        <h3 className="font-semibold font-inter text-sm mb-1 text-slate-200">{insight.title}</h3>
                        <p className="text-sm font-inter text-slate-400">{insight.insight}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
              <div className="flex items-center">
                <Coffee className="h-5 w-5 text-cyan-400 mr-2" />
                <p className="font-inter text-sm text-slate-300">
                  <strong>AI Story of the Week:</strong> This week you worked 20% more hours, slept 1 hour less per
                  night, and spent 10% more on coffee ☕.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gamification & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-poppins flex items-center text-slate-200">
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
                          ? "bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-cyan-500/30"
                          : "bg-slate-800/30 border border-slate-600/30 opacity-50"
                        } backdrop-blur-sm`}
                    >
                      <Icon
                        className={`h-6 w-6 mx-auto mb-2 ${achievement.earned ? "text-cyan-400" : "text-slate-500"}`}
                      />
                      <h3 className="font-semibold font-inter text-xs mb-1 text-slate-200">{achievement.name}</h3>
                      <p className="text-xs font-inter text-slate-400">{achievement.description}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-poppins flex items-center text-slate-200">
                <Target className="mr-2 h-5 w-5" />
                Goal Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-inter text-sm text-slate-200">Save $10,000</span>
                    <span className="font-inter text-sm text-slate-400">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-inter text-sm text-slate-200">Run 10K</span>
                    <span className="font-inter text-sm text-slate-400">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-inter text-sm text-slate-200">Read 24 Books</span>
                    <span className="font-inter text-sm text-slate-400">50%</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
              </div>
              <div className="mt-4 p-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
                <p className="font-inter text-sm text-slate-300">
                  <strong>AI Prediction:</strong> You're 75% done with your 10K run goal. Keep up the streak — finish in
                  2 weeks.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Future Predictions */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-poppins flex items-center text-slate-200">
              <Brain className="mr-2 h-5 w-5" />
              AI Predictions & Coaching
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold font-inter text-slate-200">Predictive Forecasts</h3>
                <div className="p-4 bg-slate-800/30 border border-slate-600/30 rounded-lg backdrop-blur-sm">
                  <p className="font-inter text-sm text-slate-300">
                    If you keep this pace, your Life Score will reach 90/100 in 2 months.
                  </p>
                </div>
                <div className="p-4 bg-slate-800/30 border border-slate-600/30 rounded-lg backdrop-blur-sm">
                  <p className="font-inter text-sm text-slate-300">
                    At this savings rate, you'll reach your $10K goal by December.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold font-inter text-slate-200">AI Coach Recommendations</h3>
                <div className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
                  <p className="font-inter text-sm text-slate-300">
                    <strong>Next Week Focus:</strong> Prioritize sleep + budgeting for optimal performance.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
                  <p className="font-inter text-sm text-slate-300">
                    <strong>Scenario:</strong> Cut $50 dining + add 2 workouts = 8-point Life Score boost.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(10px); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 25s linear infinite; }
        .animate-float { animation: float var(--duration, 10s) ease-in-out infinite; }
      `}</style>
    </div>
  )
}
