"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LifeScorePageSkeleton } from "@/components/skeletons"
import {
  AlertTriangle,
  Award,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle,
  Crown,
  Flame,
  Medal,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react"
import { useAnalytics } from "../../analytics/_hooks/useAnalytics"
import { useAiInsight } from "@/hooks/useAiInsight"
import { computeLifeScoreView } from "../_utils/computeLifeScore"

const colorMap = {
  blue: {
    icon: "text-primary",
    bg: "astra-panel",
    border: "border-primary/30",
  },
  green: {
    icon: "text-emerald-500",
    bg: "astra-panel",
    border: "border-emerald-500/30",
  },
  yellow: {
    icon: "text-amber-500",
    bg: "astra-panel",
    border: "border-amber-500/30",
  },
  purple: {
    icon: "text-violet-500",
    bg: "astra-panel",
    border: "border-violet-500/30",
  },
} as const

const categoryIcons = {
  Productivity: Target,
  Health: CheckCircle,
  Wealth: Trophy,
  Knowledge: Star,
} as const

function levelIcon(key: string) {
  if (key === "master") return Crown
  if (key === "achiever") return Medal
  if (key === "builder") return Shield
  return Sparkles
}

export function LifeScoreContent() {
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month">("week")
  const { analytics, isLoading, isError, refetch } = useAnalytics(selectedPeriod)

  const view = useMemo(
    () => (analytics ? computeLifeScoreView(analytics) : null),
    [analytics]
  )

  const insightContext = view
    ? {
        lifeScore: view.lifeScore,
        level: view.level.level,
        trend: view.trend,
        trendDelta: view.trendDelta,
        habitStreak: view.habitStreak,
        badgesEarned: view.badgesEarned,
        categories: view.weightedCategories.map((c) => ({
          name: c.name,
          score: c.score,
          maxScore: c.maxScore,
          percent: c.percent,
        })),
        periodLabel: view.periodLabel,
      }
    : undefined

  const {
    data: insightData,
    isLoading: insightLoading,
    enabled: insightsEnabled,
  } = useAiInsight("life_score", insightContext, {
    enabled: Boolean(view),
  })

  const showLifeInsight =
    insightsEnabled && (Boolean(insightData?.text) || insightLoading)
  const showForecast =
    insightsEnabled && (Boolean(insightData?.forecast) || insightLoading)

  if (isLoading || !view) {
    return <LifeScorePageSkeleton />
  }

  if (isError) {
    return (
      <div className="astra-page">
        <Card className="astra-card">
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">Couldn’t load life score.</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const LevelIcon = levelIcon(view.level.key)
  const periodLabel = view.periodLabel

  return (
    <div className="astra-page space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="astra-title text-4xl">Life Score Dashboard</h1>
          <p className="astra-subtitle mt-2">
            Holistic balance across productivity, health, wealth, and knowledge
          </p>
        </div>
        <div className="flex gap-2">
          {(["day", "week", "month"] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={`capitalize ${selectedPeriod === period ? "astra-btn-primary" : ""}`}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="astra-card lg:col-span-2">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <LevelIcon className="h-12 w-12 text-primary" />
              <div>
                <CardTitle className="text-6xl font-bold text-primary">{view.lifeScore}</CardTitle>
                <CardDescription className="text-lg">out of 100 points</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="astra-score-badge text-lg px-4 py-2">
              {view.level.level}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 mb-6">
              {view.trend === "up" ? (
                <TrendingUp className="h-5 w-5 text-primary" />
              ) : view.trend === "down" ? (
                <TrendingDown className="h-5 w-5 text-red-400" />
              ) : null}
              <span
                className={`font-semibold ${
                  view.trend === "up"
                    ? "text-primary"
                    : view.trend === "down"
                      ? "text-red-400"
                      : "text-muted-foreground"
                }`}
              >
                {view.trend === "flat"
                  ? `Stable vs last ${periodLabel}`
                  : `${view.trendDelta > 0 ? "+" : ""}${view.trendDelta} vs last ${periodLabel}`}
              </span>
            </div>
            {showLifeInsight ? (
              <div className="text-center space-y-2 astra-panel p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">AI Insight</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {insightLoading && !insightData?.text
                    ? "Generating…"
                    : insightData?.text}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="astra-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center text-primary">
                <Flame className="mr-2 h-4 w-4 text-orange-500" />
                Habit Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{view.habitStreak} days</div>
              <p className="text-xs text-muted-foreground">Longest current habit streak</p>
            </CardContent>
          </Card>

          <Card className="astra-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center text-primary">
                <Award className="mr-2 h-4 w-4" />
                Badges Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {view.badgesEarned}/{view.badges.length}
              </div>
              <p className="text-xs text-muted-foreground">From live milestones</p>
            </CardContent>
          </Card>

          {showForecast ? (
            <Card className="astra-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center text-primary">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  AI Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insightLoading && !insightData?.forecast ? (
                  <div className="h-10 rounded astra-panel animate-pulse" />
                ) : (
                  <>
                    <div className="text-lg font-bold text-foreground">
                      Score {insightData?.forecast?.score}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {insightData?.forecast?.label}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ) : null}

          <Card className="astra-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center text-primary">
                <Calendar className="mr-2 h-4 w-4" />
                Period Change
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-foreground">
                {view.trendDelta > 0 ? "+" : ""}
                {view.trendDelta} points
              </div>
              <p className="text-xs text-muted-foreground">vs previous {periodLabel} estimate</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="astra-card">
        <CardHeader>
          <CardTitle className="text-primary flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Category Breakdown
          </CardTitle>
          <CardDescription>
            Weighted contribution to your 100-point Life Score (25/25/25/15/10)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {view.weightedCategories.map((category) => {
              const Icon =
                categoryIcons[category.name as keyof typeof categoryIcons] ?? Target
              const colors = colorMap[category.color as keyof typeof colorMap]
              return (
                <div key={category.name} className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`h-4 w-4 shrink-0 ${colors.icon}`} />
                      <span className="font-medium text-sm text-foreground truncate">
                        {category.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {category.trendDelta > 0 ? (
                        <TrendingUp className="h-3 w-3 text-primary" />
                      ) : category.trendDelta < 0 ? (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      ) : null}
                      {category.trendDelta !== 0 ? (
                        <span
                          className={`text-xs ${
                            category.trendDelta > 0 ? "text-primary" : "text-red-400"
                          }`}
                        >
                          {category.trendDelta > 0 ? "+" : ""}
                          {category.trendDelta}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress value={category.percent} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {category.score}/{category.maxScore}
                      </span>
                      <span className="font-medium">{category.weightLabel}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Zap className="mr-2 h-5 w-5" />
              Period Boosts (+)
            </CardTitle>
            <CardDescription>
              Actions that support a higher score this {periodLabel}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {view.dailyBoosts.map((boost) => (
                <div
                  key={boost.action}
                  className="flex items-center justify-between gap-3 p-3 astra-panel rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {boost.achieved ? (
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-foreground">{boost.action}</span>
                      <p className="text-xs text-muted-foreground">{boost.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    +{boost.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="astra-card border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center text-red-400">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Penalties (–)
            </CardTitle>
            <CardDescription>Live risk signals that can drag the score down</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {view.penalties.map((penalty) => (
                <div
                  key={penalty.issue}
                  className={`flex items-center justify-between gap-3 p-3 rounded-lg ${
                    penalty.active
                      ? "bg-red-500/10 border border-red-500/30"
                      : "astra-panel opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AlertTriangle
                      className={`h-4 w-4 shrink-0 ${
                        penalty.active ? "text-red-400" : "text-muted-foreground"
                      }`}
                    />
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-foreground">{penalty.issue}</span>
                      <p className="text-xs text-muted-foreground">{penalty.description}</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`shrink-0 ${
                      penalty.active ? "bg-red-500/20 text-red-400 border-red-500/30" : ""
                    }`}
                  >
                    {penalty.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="astra-card">
        <CardHeader>
          <CardTitle className="text-primary flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            Badges & Achievements
          </CardTitle>
          <CardDescription>Unlocked from real milestones across modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {view.badges.map((badge) => {
              const colors = colorMap[badge.color as keyof typeof colorMap]
              return (
                <div
                  key={badge.name}
                  className={`p-4 rounded-lg border transition-all ${
                    badge.earned
                      ? `${colors.bg} ${colors.border}`
                      : "bg-secondary/30 border-border opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Award className={`h-6 w-6 ${badge.earned ? colors.icon : "text-muted-foreground"}`} />
                    <span className="font-semibold text-foreground">{badge.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                  {badge.earned ? (
                    <Badge variant="secondary" className="mt-2">
                      Earned
                    </Badge>
                  ) : null}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
