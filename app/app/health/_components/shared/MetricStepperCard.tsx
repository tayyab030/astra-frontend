"use client"

import type { LucideIcon } from "lucide-react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface MetricStepperCardProps {
  title: string
  icon: LucideIcon
  current: number
  target: number
  unit: string
  step: number
  onIncrement: () => void
  onDecrement: () => void
  onTargetChange: (value: number) => void
  compact?: boolean
}

export function MetricStepperCard({
  title,
  icon: Icon,
  current,
  target,
  unit,
  step,
  onIncrement,
  onDecrement,
  onTargetChange,
  compact = false,
}: MetricStepperCardProps) {
  const progress = target > 0 ? Math.min(100, (current / target) * 100) : 0
  const displayCurrent = Number.isInteger(current) ? current : current.toFixed(1)
  const displayTarget = Number.isInteger(target) ? target : target.toFixed(1)

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
      <CardHeader className={compact ? "pb-2" : undefined}>
        <CardTitle className="text-sm font-mono text-cyan-300 flex items-center">
          <Icon className="mr-2 h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 border-slate-600 text-slate-300 hover:bg-slate-700/50"
            onClick={onDecrement}
            disabled={current <= 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="text-center min-w-[80px]">
            <span className="text-2xl font-bold font-mono text-white">{displayCurrent}</span>
            <span className="text-slate-400 font-mono text-sm"> / {displayTarget}</span>
          </div>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 border-slate-600 text-slate-300 hover:bg-slate-700/50"
            onClick={onIncrement}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-slate-400 font-mono text-center">{unit} today · step {step}</p>
        {!compact && (
          <div className="flex items-end gap-2 pt-1">
            <div className="flex-1">
              <Label className="text-xs text-slate-400 font-mono">Target</Label>
              <Input
                type="number"
                step={step}
                min={step}
                value={target}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  if (!isNaN(val) && val > 0) onTargetChange(val)
                }}
                className="h-8 bg-slate-900/50 border-slate-600/50 text-white font-mono mt-1"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
