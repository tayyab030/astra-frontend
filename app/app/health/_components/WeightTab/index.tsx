"use client"

import { useEffect, useMemo, useState } from "react"
import { Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useHealthContext } from "../../_context/HealthProvider"
import {
  formatWeightKg,
  getBmiToneClasses,
  getHealthyWeightRangeKg,
  validateIdealWeightKg,
} from "../../_utils/bmi"
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
    setIdealWeight,
    logWeight,
    setPeriodFilter,
  } = useHealthContext()

  const [newWeight, setNewWeight] = useState(latestWeight?.toString() ?? "")
  const [idealDraft, setIdealDraft] = useState(
    profile.idealWeightKg?.toString() ?? ""
  )
  const toneClasses = getBmiToneClasses(bmiStatus.tone)

  useEffect(() => {
    setIdealDraft(profile.idealWeightKg?.toString() ?? "")
  }, [profile.idealWeightKg])

  const canSetIdeal = Boolean(latestWeight && profile.heightCm)
  const healthyRange = useMemo(
    () => (profile.heightCm ? getHealthyWeightRangeKg(profile.heightCm) : null),
    [profile.heightCm]
  )

  const idealError = useMemo(() => {
    if (!idealDraft.trim()) return null
    const val = parseFloat(idealDraft)
    if (isNaN(val) || val <= 0) return "Enter a valid weight"
    return validateIdealWeightKg(val, profile.heightCm)
  }, [idealDraft, profile.heightCm])

  const handleLogWeight = () => {
    const val = parseFloat(newWeight)
    if (!isNaN(val) && val > 0) logWeight(val)
  }

  const handleSaveIdeal = () => {
    if (!canSetIdeal) return
    if (!idealDraft.trim()) {
      setIdealWeight(null)
      return
    }
    const val = parseFloat(idealDraft)
    if (isNaN(val) || val <= 0) return
    if (validateIdealWeightKg(val, profile.heightCm)) return
    setIdealWeight(val)
  }

  const handleClearIdeal = () => {
    setIdealDraft("")
    setIdealWeight(null)
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
                <div className="space-y-1.5">
                  <Badge variant="outline" className={`font-mono ${toneClasses.badge}`}>
                    {bmiStatus.label}
                  </Badge>
                  {bmiStatus.deltaLabel ? (
                    <p className={`text-sm font-mono ${toneClasses.text}`}>
                      {bmiStatus.deltaLabel}
                    </p>
                  ) : null}
                  {bmiStatus.idealDeltaLabel ? (
                    <p
                      className={`text-sm font-mono ${
                        bmiStatus.idealDeltaKg === 0
                          ? "text-emerald-300"
                          : "text-yellow-300"
                      }`}
                    >
                      {bmiStatus.idealDeltaLabel}
                    </p>
                  ) : null}
                  {bmiStatus.healthyMinKg != null && bmiStatus.healthyMaxKg != null ? (
                    <p className="text-xs text-slate-400 font-mono">
                      Healthy range: {formatWeightKg(bmiStatus.healthyMinKg)} –{" "}
                      {formatWeightKg(bmiStatus.healthyMaxKg)}
                    </p>
                  ) : null}
                  {profile.idealWeightKg != null ? (
                    <p className="text-xs text-slate-400 font-mono">
                      Ideal weight: {formatWeightKg(profile.idealWeightKg)}
                    </p>
                  ) : null}
                </div>
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
          <CardContent className="space-y-4">
            <HeightEditor
              heightCm={profile.heightCm}
              heightUnit={profile.heightUnit}
              onHeightChange={setHeight}
              onUnitChange={setHeightUnit}
            />
            <div className="space-y-2 border-t border-slate-600/40 pt-4">
              <Label className="text-slate-400 text-xs" htmlFor="ideal-weight">
                Ideal weight (kg, optional)
              </Label>
              <Input
                id="ideal-weight"
                type="number"
                step={0.1}
                min={healthyRange?.minKg}
                max={healthyRange?.maxKg}
                value={idealDraft}
                disabled={!canSetIdeal}
                onChange={(e) => setIdealDraft(e.target.value)}
                onBlur={handleSaveIdeal}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSaveIdeal()
                  }
                }}
                placeholder={
                  !latestWeight
                    ? "Log weight first"
                    : !profile.heightCm
                      ? "Add height first"
                      : healthyRange
                        ? `${healthyRange.minKg.toFixed(1)}–${healthyRange.maxKg.toFixed(1)}`
                        : "e.g. 68"
                }
                className="bg-slate-900/50 border-slate-600/50 text-white font-mono disabled:opacity-50"
              />
              {idealError ? (
                <p className="text-xs text-red-400 font-mono">{idealError}</p>
              ) : canSetIdeal && healthyRange ? (
                <p className="text-xs text-slate-500 font-mono">
                  Must be within healthy range ({healthyRange.minKg.toFixed(1)}–
                  {healthyRange.maxKg.toFixed(1)} kg)
                </p>
              ) : !latestWeight ? (
                <p className="text-xs text-slate-500 font-mono">
                  Log your weight to set an ideal weight
                </p>
              ) : null}
              {profile.idealWeightKg != null ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto px-0 text-xs text-slate-400 font-mono"
                  onClick={handleClearIdeal}
                  disabled={!canSetIdeal}
                >
                  Clear ideal weight
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-mono text-cyan-300 text-base">Log Weight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Weight (kg)</Label>
              <Input
                type="number"
                step={0.1}
                min={30}
                max={300}
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="bg-slate-900/50 border-slate-600/50 text-white font-mono"
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
