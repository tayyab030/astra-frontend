"use client"

import { useState } from "react"
import { Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useHealthContext } from "../../_context/HealthProvider"
import { formatWeightKg, getBmiToneClasses } from "../../_utils/bmi"
import { HealthPeriodFilterBar } from "../shared/HealthPeriodFilterBar"
import { HealthTrendChart } from "../shared/HealthTrendChart"
import { HeightEditor } from "../shared/HeightEditor"
import { HealthEmptyState } from "../shared/HealthEmptyState"

export function WeightTab() {
  const {
    profile,
    latestWeight,
    bmiStatus,
    weightLog,
    weightChartData,
    periodFilter,
    setHeight,
    setHeightUnit,
    logWeight,
    setPeriodFilter,
  } = useHealthContext()

  const [newWeight, setNewWeight] = useState(latestWeight?.toString() ?? "")
  const toneClasses = getBmiToneClasses(bmiStatus.tone)

  const handleLogWeight = () => {
    const val = parseFloat(newWeight)
    if (!isNaN(val) && val > 0) logWeight(val)
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className={`bg-gradient-to-br ${toneClasses.bg} ${toneClasses.border} backdrop-blur-sm lg:col-span-1`}>
          <CardHeader>
            <CardTitle className="font-mono text-white flex items-center">
              <Scale className="mr-2 h-5 w-5" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!profile.heightCm ? (
              <HealthEmptyState
                icon={Scale}
                title="Height required"
                description="Add your height below to calculate BMI and see your weight status."
              />
            ) : latestWeight ? (
              <>
                <div>
                  <p className="text-xs text-slate-400 font-mono">Latest weight</p>
                  <p className={`text-3xl font-bold font-mono ${toneClasses.text}`}>
                    {formatWeightKg(latestWeight)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono">BMI</p>
                  <p className={`text-2xl font-bold font-mono ${toneClasses.text}`}>{bmiStatus.bmi}</p>
                </div>
                <Badge variant="outline" className={`font-mono ${toneClasses.badge}`}>
                  {bmiStatus.label}
                </Badge>
              </>
            ) : (
              <HealthEmptyState
                icon={Scale}
                title="No weight entries"
                description="Log your weight below to start tracking."
              />
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-mono text-cyan-300 text-base">Your Height</CardTitle>
          </CardHeader>
          <CardContent>
            <HeightEditor
              heightCm={profile.heightCm}
              heightUnit={profile.heightUnit}
              onHeightChange={setHeight}
              onUnitChange={setHeightUnit}
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-mono text-cyan-300 text-base">Log Weight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-slate-400 font-mono text-xs">Weight (kg)</Label>
              <Input
                type="number"
                step={0.1}
                min={30}
                max={300}
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="bg-slate-900/50 border-slate-600/50 text-white font-mono mt-1"
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 font-mono"
              onClick={handleLogWeight}
            >
              Log today&apos;s weight
            </Button>
            <p className="text-xs text-slate-500 font-mono">{weightLog.length} entries in history</p>
          </CardContent>
        </Card>
      </div>

      <HealthPeriodFilterBar filter={periodFilter} onChange={setPeriodFilter} />

      <HealthTrendChart
        title="Weight trend"
        data={weightChartData}
        emptyMessage="No weight data for this period"
        valueFormatter={(v) => `${v}kg`}
        color="#34d399"
      />
    </div>
  )
}
