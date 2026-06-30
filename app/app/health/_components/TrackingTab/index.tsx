"use client"

import { Dumbbell, Droplets, Moon } from "lucide-react"
import { useHealthContext } from "../../_context/HealthProvider"
import { METRIC_STEP } from "../constants"
import { HealthPeriodFilterBar } from "../shared/HealthPeriodFilterBar"
import { HealthTrendChart } from "../shared/HealthTrendChart"
import { MetricStepperCard } from "../shared/MetricStepperCard"

export function TrackingTab() {
  const {
    today,
    targets,
    periodFilter,
    waterChartData,
    sleepChartData,
    exerciseChartData,
    incrementMetric,
    decrementMetric,
    setTarget,
    setPeriodFilter,
  } = useHealthContext()

  return (
    <div className="space-y-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricStepperCard
          title="Water Intake"
          icon={Droplets}
          current={today.waterGlasses}
          target={targets.waterGlasses}
          unit="glasses"
          step={METRIC_STEP.water}
          onIncrement={() => incrementMetric("water")}
          onDecrement={() => decrementMetric("water")}
          onTargetChange={(v) => setTarget("water", v)}
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
        />
      </div>

      <HealthPeriodFilterBar filter={periodFilter} onChange={setPeriodFilter} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <HealthTrendChart
          title="Water history"
          data={waterChartData}
          emptyMessage="No water data for this period"
          color="#22d3ee"
        />
        <HealthTrendChart
          title="Sleep history"
          data={sleepChartData}
          emptyMessage="No sleep data for this period"
          valueFormatter={(v) => `${v}h`}
          color="#818cf8"
        />
        <HealthTrendChart
          title="Exercise history"
          data={exerciseChartData}
          emptyMessage="No exercise data for this period"
          valueFormatter={(v) => `${v}m`}
          color="#34d399"
        />
      </div>
    </div>
  )
}
