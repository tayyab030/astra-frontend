"use client"

import { Dumbbell, Droplets, Moon, Target, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AI_HEALTH_INSIGHTS } from "../constants"
import { useHealthContext } from "../../_context/HealthProvider"
import { METRIC_STEP } from "../constants"
import { MetricStepperCard } from "../shared/MetricStepperCard"

export function OverviewTab() {
  const { today, targets, habits, incrementMetric, decrementMetric, setTarget } = useHealthContext()

  const habitsComplete = habits.filter((h) => h.completed).length
  const habitsProgress = habits.length ? (habitsComplete / habits.length) * 100 : 0

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
          onIncrement={() => incrementMetric("sleep")}
          onDecrement={() => decrementMetric("sleep")}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono flex items-center text-cyan-300">
              <Target className="mr-2 h-5 w-5 text-cyan-400" />
              Daily Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-slate-200">Habits</span>
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

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono flex items-center text-cyan-300">
              <Zap className="mr-2 h-5 w-5 text-yellow-400" />
              AI Health Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {AI_HEALTH_INSIGHTS.map((insight, i) => (
              <div
                key={i}
                className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30 backdrop-blur-sm"
              >
                <p className="text-sm font-mono text-slate-200">{insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
