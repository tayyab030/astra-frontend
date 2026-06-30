"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Target } from "lucide-react"

interface WeeklyTargetEditorProps {
  hoursPerWeek: number
  onChange: (hours: number) => void
}

export function WeeklyTargetEditor({ hoursPerWeek, onChange }: WeeklyTargetEditorProps) {
  return (
    <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
      <CardContent className="flex items-center gap-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
          <Target className="h-5 w-5 text-purple-300" />
        </div>
        <div className="flex-1">
          <Label className="text-slate-400 font-mono text-xs">Weekly Target (hours)</Label>
          <Input
            type="number"
            min={1}
            max={168}
            value={hoursPerWeek}
            onChange={(e) => onChange(Number(e.target.value) || 1)}
            className="mt-1 max-w-[120px] bg-slate-900/50 border-slate-600 text-white font-mono"
          />
        </div>
      </CardContent>
    </Card>
  )
}
