"use client"

import { Dumbbell, Droplets, Moon, Scale } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useHealthContext } from "../_context/HealthProvider"
import { formatWeightKg, getBmiToneClasses } from "../_utils/bmi"
import { StatusMetricCard } from "./shared/StatusMetricCard"

export function TodaySummaryRow() {
  const { today, targets, latestWeight, bmiStatus } = useHealthContext()
  const weightTone = bmiStatus.tone
  const weightClasses = getBmiToneClasses(weightTone)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {latestWeight !== null && bmiStatus.bmi !== null ? (
        <StatusMetricCard
          title="Weight & BMI"
          icon={Scale}
          value={formatWeightKg(latestWeight)}
          subtitle={`BMI ${bmiStatus.bmi}`}
          statusLabel={bmiStatus.label}
          tone={weightTone}
        />
      ) : (
        <Card className={`bg-gradient-to-br ${weightClasses.bg} ${weightClasses.border} backdrop-blur-sm`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-mono flex items-center ${weightClasses.text}`}>
              <Scale className="mr-2 h-4 w-4" />
              Weight & BMI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 font-mono">Add height to calculate BMI</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono text-cyan-300 flex items-center">
            <Droplets className="mr-2 h-4 w-4" />
            Water
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {today.waterGlasses}/{targets.waterGlasses}
          </div>
          <Progress value={(today.waterGlasses / targets.waterGlasses) * 100} className="h-2 mt-2" />
          <p className="text-xs text-cyan-500 font-mono mt-1">glasses today</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono text-cyan-300 flex items-center">
            <Dumbbell className="mr-2 h-4 w-4" />
            Exercise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {today.exerciseMinutes}m
          </div>
          <Progress value={(today.exerciseMinutes / targets.exerciseMinutes) * 100} className="h-2 mt-2" />
          <p className="text-xs text-cyan-500 font-mono mt-1">of {targets.exerciseMinutes}m goal</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/30 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono text-blue-300 flex items-center">
            <Moon className="mr-2 h-4 w-4" />
            Sleep
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-blue-400">{today.sleepHours}h</div>
          <Progress value={(today.sleepHours / targets.sleepHours) * 100} className="h-2 mt-2" />
          <p className="text-xs text-blue-500 font-mono mt-1">of {targets.sleepHours}h target</p>
        </CardContent>
      </Card>
    </div>
  )
}
