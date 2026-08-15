"use client"

import { Dumbbell, Droplets, Moon, Target, Zap } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { InsightHorizonBadge } from "@/components/insights/InsightHorizonBadge"
import { ROUTES } from "@/constants/routes"
import { useAiInsight } from "@/hooks/useAiInsight"
import { useHealthContext } from "../../_context/HealthProvider"
import { METRIC_STEP } from "../constants"
import { MetricStepperCard } from "../shared/MetricStepperCard"
import { SleepScheduleCard } from "../shared/SleepScheduleCard"

export function OverviewTab() {
  const { today, targets, habits, incrementMetric, decrementMetric, setTarget } = useHealthContext()

  const habitsComplete = habits.filter((h) => h.completed).length
  const habitsProgress = habits.length ? (habitsComplete / habits.length) * 100 : 0

  const insightContext = {
    waterGlasses: today.waterGlasses,
    waterGoal: targets.waterGlasses,
    sleepHours: today.sleepHours,
    sleepGoal: targets.sleepHours,
    exerciseMinutes: today.exerciseMinutes,
    exerciseGoal: targets.exerciseMinutes,
    habitsComplete,
    habitsTotal: habits.length,
    habitsProgress: Math.round(habitsProgress),
  }

  const {
    data: insightData,
    hasInsight,
    isLoading: insightLoading,
    enabled: insightsEnabled,
  } = useAiInsight("health", insightContext)

  const showInsights = insightsEnabled && (hasInsight || insightLoading)

  return (
    <div className="space-y-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricStepperCard
          title="Water"
          icon={Droplets}
          current={today.waterGlasses}
          target={targets.waterGlasses}
          unit="glasses"
          step={METRIC_STEP.water}
          onIncrement={() => incrementMetric("water")}
          onDecrement={() => decrementMetric("water")}
          onTargetChange={(v) => setTarget("water", v)}
          compact
        />
        <MetricStepperCard
          title="Sleep"
          icon={Moon}
          current={today.sleepHours}
          target={targets.sleepHours}
          unit="hours"
          step={METRIC_STEP.sleep}
          hideSteppers
          helperText="from sleep sessions"
          onTargetChange={(v) => setTarget("sleep", v)}
          compact
        />
        <MetricStepperCard
          title="Exercise"
          icon={Dumbbell}
          current={today.exerciseMinutes}
          target={targets.exerciseMinutes}
          unit="minutes"
          step={METRIC_STEP.exercise}
          onIncrement={() => incrementMetric("exercise")}
          onDecrement={() => decrementMetric("exercise")}
          onTargetChange={(v) => setTarget("exercise", v)}
          compact
        />
      </div>

      <SleepScheduleCard />

      <div className={`grid grid-cols-1 ${showInsights ? "lg:grid-cols-2" : ""} gap-6`}>
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono flex items-center text-cyan-300">
              <Target className="mr-2 h-5 w-5 text-cyan-400" />
              Daily Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Link
                href={ROUTES.APP.HABITS}
                className="text-sm font-mono text-slate-200 hover:text-cyan-300 transition-colors"
              >
                Habits
              </Link>
              <div className="flex items-center space-x-2">
                <Progress value={habitsProgress} className="w-24 h-2" />
                <span className="text-sm text-slate-400 font-mono">{Math.round(habitsProgress)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-slate-200">Exercise</span>
              <div className="flex items-center space-x-2">
                <Progress
                  value={(today.exerciseMinutes / targets.exerciseMinutes) * 100}
                  className="w-24 h-2"
                />
                <span className="text-sm text-slate-400 font-mono">
                  {Math.round((today.exerciseMinutes / targets.exerciseMinutes) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-slate-200">Sleep</span>
              <div className="flex items-center space-x-2">
                <Progress value={(today.sleepHours / targets.sleepHours) * 100} className="w-24 h-2" />
                <span className="text-sm text-slate-400 font-mono">
                  {Math.round((today.sleepHours / targets.sleepHours) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {showInsights ? (
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-mono flex items-center text-cyan-300">
                <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                AI Health Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insightLoading && !hasInsight ? (
                <>
                  <div className="h-12 rounded-lg border border-cyan-500/20 animate-pulse bg-slate-700/40" />
                  <div className="h-12 rounded-lg border border-cyan-500/20 animate-pulse bg-slate-700/40" />
                </>
              ) : (
                (insightData?.items ?? []).map((insight, i) => (
                  <div
                    key={`${insight.message}-${i}`}
                    className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30 backdrop-blur-sm space-y-1.5"
                  >
                    <InsightHorizonBadge horizon={insight.horizon} />
                    <p className="text-sm font-mono text-slate-200">{insight.message}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
