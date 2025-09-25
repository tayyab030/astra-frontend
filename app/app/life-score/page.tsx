"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  Zap,
  Award,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Flame,
  Crown,
  Medal,
  Shield,
  Sparkles,
  Brain,
  Calendar,
} from "lucide-react"

export default function LifeScorePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  const colorMap = {
    blue: {
      icon: "text-cyan-400",
      bg: "bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20",
      border: "border-cyan-500/30",
    },
    green: {
      icon: "text-cyan-300",
      bg: "bg-slate-900/50 backdrop-blur-sm border border-cyan-400/20",
      border: "border-cyan-400/30",
    },
    yellow: {
      icon: "text-blue-400",
      bg: "bg-slate-900/50 backdrop-blur-sm border border-blue-500/20",
      border: "border-blue-500/30",
    },
    purple: {
      icon: "text-purple-400",
      bg: "bg-slate-900/50 backdrop-blur-sm border border-purple-500/20",
      border: "border-purple-500/30",
    },
    pink: {
      icon: "text-pink-400",
      bg: "bg-slate-900/50 backdrop-blur-sm border border-pink-500/20",
      border: "border-pink-500/30",
    },
  }

  const lifeScore = 74
  const previousScore = 68
  const trend = lifeScore > previousScore ? "up" : "down"
  const trendValue = Math.abs(lifeScore - previousScore)

  const categoryScores = [
    { name: "Productivity", score: 18, maxScore: 25, color: "blue", icon: Target, trend: -5, weight: "25%" },
    { name: "Health", score: 20, maxScore: 25, color: "green", icon: CheckCircle, trend: 8, weight: "25%" },
    { name: "Wealth", score: 17, maxScore: 25, color: "yellow", icon: Trophy, trend: 3, weight: "25%" },
    { name: "Knowledge", score: 10, maxScore: 15, color: "purple", icon: Star, trend: -2, weight: "15%" },
    { name: "Communication", score: 5, maxScore: 10, color: "pink", icon: Brain, trend: -3, weight: "10%" },
  ]

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: "Master", icon: Crown, color: "text-cyan-400" }
    if (score >= 70) return { level: "Achiever", icon: Medal, color: "text-blue-400" }
    if (score >= 40) return { level: "Builder", icon: Shield, color: "text-cyan-300" }
    return { level: "Survivor", icon: Sparkles, color: "text-slate-400" }
  }

  const currentLevel = getScoreLevel(lifeScore)
  const LevelIcon = currentLevel.icon

  const badges = [
    { name: "Wealth Wizard", description: "Saved 20% above target", earned: true, color: "yellow" },
    { name: "Focus Master", description: "10-day productivity streak", earned: true, color: "blue" },
    { name: "Health Champion", description: "Perfect week of habits", earned: false, color: "green" },
    { name: "Knowledge Seeker", description: "Read 5 books this month", earned: false, color: "purple" },
  ]

  const dailyBoosts = [
    { action: "Completed all tasks", points: 5, achieved: true, description: "Perfect task completion rate" },
    { action: "Logged workout & sleep", points: 3, achieved: true, description: "Health habits maintained" },
    { action: "Saved extra money", points: 2, achieved: false, description: "Exceeded savings target" },
    { action: "Created new note/journal", points: 1, achieved: true, description: "Knowledge building" },
    { action: "Inbox zero achieved", points: 2, achieved: false, description: "Communication organized" },
  ]

  const penalties = [
    { issue: "Multiple overdue tasks", points: -5, active: true, description: "3+ tasks past deadline" },
    { issue: "No sleep log", points: -2, active: false, description: "Missing health tracking" },
    { issue: "Overspending 20%+ budget", points: -5, active: false, description: "Budget exceeded significantly" },
    { issue: "No notes/learning", points: -2, active: false, description: "Knowledge stagnation" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse delay-2000" />

      {/* Holographic Rings */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-cyan-500/20 rounded-full animate-spin-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 border border-blue-500/20 rounded-full animate-spin-slow-reverse" />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/60 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-mono text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              Life Score Dashboard
            </h1>
            <p className="text-slate-300 font-mono mt-2">
              Your holistic life balance tracker - like a fitness tracker for your entire life
            </p>
          </div>
          <div className="flex gap-2">
            {["day", "week", "month"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={`capitalize font-mono ${selectedPeriod === period
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                    : "bg-slate-900/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 backdrop-blur-sm"
                  }`}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Score Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <LevelIcon className={`h-12 w-12 ${currentLevel.color} drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]`} />
                <div>
                  <CardTitle className="text-6xl font-bold font-mono text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    {lifeScore}
                  </CardTitle>
                  <CardDescription className="text-lg font-mono text-slate-300">out of 100 points</CardDescription>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={`text-lg px-4 py-2 ${currentLevel.color} bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm font-mono`}
              >
                {currentLevel.level}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2 mb-6">
                {trend === "up" ? (
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
                <span className={`font-semibold font-mono ${trend === "up" ? "text-cyan-400" : "text-red-400"}`}>
                  {trend === "up" ? "+" : "-"}
                  {trendValue} from last {selectedPeriod}
                </span>
              </div>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-400 font-mono">AI Insight</span>
                </div>
                <p className="text-sm text-slate-300 font-mono">
                  "Your Health is strong (+8 this week), but Productivity dropped (-5). Focus on completing overdue
                  tasks to boost your score by 10+ points."
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono text-cyan-400 flex items-center">
                  <Flame className="mr-2 h-4 w-4" />
                  Balanced Week Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-cyan-300">7 days</div>
                <p className="text-xs text-slate-400 font-mono">Score above 70</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono text-blue-400 flex items-center">
                  <Award className="mr-2 h-4 w-4" />
                  Badges Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-blue-300">
                  {badges.filter((b) => b.earned).length}/{badges.length}
                </div>
                <p className="text-xs text-slate-400 font-mono">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono text-purple-400 flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  AI Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold font-mono text-purple-300">Score 80</div>
                <p className="text-xs text-slate-400 font-mono">At current pace, 2 months</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono text-cyan-400 flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Monthly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold font-mono text-cyan-300">+12 points</div>
                <p className="text-xs text-slate-400 font-mono">vs last month average</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Category Breakdown */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <CardHeader>
            <CardTitle className="font-mono text-cyan-400 flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Category Breakdown
            </CardTitle>
            <CardDescription className="font-mono text-slate-300">
              Weighted contribution to your 100-point Life Score (customizable weights)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {categoryScores.map((category) => {
                const Icon = category.icon
                const percentage = (category.score / category.maxScore) * 100
                const colors = colorMap[category.color as keyof typeof colorMap]
                return (
                  <div key={category.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${colors.icon}`} />
                        <span className="font-medium font-mono text-sm text-slate-300">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {category.trend > 0 ? (
                          <TrendingUp className="h-3 w-3 text-cyan-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-400" />
                        )}
                        <span className={`text-xs font-mono ${category.trend > 0 ? "text-cyan-400" : "text-red-400"}`}>
                          {category.trend > 0 ? "+" : ""}
                          {category.trend}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-slate-400 font-mono">
                        <span>
                          {category.score}/{category.maxScore}
                        </span>
                        <span className="font-medium">{category.weight}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Daily Boosts & Penalties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <CardHeader>
              <CardTitle className="font-mono flex items-center text-cyan-400">
                <Zap className="mr-2 h-5 w-5" />
                Daily Boosts (+)
              </CardTitle>
              <CardDescription className="font-mono text-slate-300">
                Actions that increase your Life Score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dailyBoosts.map((boost, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {boost.achieved ? (
                        <CheckCircle className="h-4 w-4 text-cyan-400" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-slate-500" />
                      )}
                      <div>
                        <span className="text-sm font-mono font-medium text-slate-300">{boost.action}</span>
                        <p className="text-xs text-slate-400 font-mono">{boost.description}</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono"
                    >
                      +{boost.points}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <CardHeader>
              <CardTitle className="font-mono flex items-center text-red-400">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Penalties (–)
              </CardTitle>
              <CardDescription className="font-mono text-slate-300">
                Areas that need attention to avoid score reduction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {penalties.map((penalty, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${penalty.active
                        ? "bg-red-500/10 backdrop-blur-sm border border-red-500/30"
                        : "bg-slate-800/30 backdrop-blur-sm border border-slate-600/20 opacity-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`h-4 w-4 ${penalty.active ? "text-red-400" : "text-slate-500"}`} />
                      <div>
                        <span className="text-sm font-mono font-medium text-slate-300">{penalty.issue}</span>
                        <p className="text-xs text-slate-400 font-mono">{penalty.description}</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        penalty.active
                          ? "bg-red-500/20 text-red-400 border border-red-500/30 font-mono"
                          : "bg-slate-600/20 text-slate-500 border border-slate-600/30 font-mono"
                      }
                    >
                      {penalty.points}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges & Achievements */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <CardHeader>
            <CardTitle className="font-mono text-cyan-400 flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Badges & Achievements
            </CardTitle>
            <CardDescription className="font-mono text-slate-300">
              Unlock badges by maintaining consistent habits and reaching milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges.map((badge, index) => {
                const colors = colorMap[badge.color as keyof typeof colorMap]
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${badge.earned
                        ? `${colors.bg} ${colors.border} shadow-[0_0_20px_rgba(6,182,212,0.1)]`
                        : "bg-slate-800/30 border-slate-600/30 opacity-60"
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Award className={`h-6 w-6 ${badge.earned ? colors.icon : "text-slate-500"}`} />
                      <span className="font-semibold font-mono text-slate-300">{badge.name}</span>
                    </div>
                    <p className="text-sm text-slate-400 font-mono">{badge.description}</p>
                    {badge.earned && (
                      <Badge
                        variant="secondary"
                        className="mt-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono"
                      >
                        Earned
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
