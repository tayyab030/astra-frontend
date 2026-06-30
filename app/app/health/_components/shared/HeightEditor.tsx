"use client"

import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Input } from "@/components/ui/input"
import type { HeightUnit } from "../../_types/health.types"
import { cmToFeetInches, feetInchesToCm, formatHeight } from "../../_utils/bmi"

interface HeightEditorProps {
  heightCm: number | null
  heightUnit: HeightUnit
  onHeightChange: (heightCm: number | null) => void
  onUnitChange: (unit: HeightUnit) => void
}

export function HeightEditor({
  heightCm,
  heightUnit,
  onHeightChange,
  onUnitChange,
}: HeightEditorProps) {
  const { feet, inches } = heightCm ? cmToFeetInches(heightCm) : { feet: 5, inches: 9 }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-slate-300 font-mono text-sm">Height</Label>
        <ToggleGroup
          type="single"
          value={heightUnit}
          onValueChange={(v) => v && onUnitChange(v as HeightUnit)}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-0.5"
        >
          <ToggleGroupItem value="cm" className="font-mono text-xs h-7 px-2 data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-300">
            cm
          </ToggleGroupItem>
          <ToggleGroupItem value="ftin" className="font-mono text-xs h-7 px-2 data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-300">
            ft/in
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {heightUnit === "cm" ? (
        <Input
          type="number"
          min={100}
          max={250}
          value={heightCm ?? ""}
          placeholder="175"
          onChange={(e) => {
            const val = parseInt(e.target.value, 10)
            onHeightChange(isNaN(val) ? null : val)
          }}
          className="bg-slate-900/50 border-slate-600/50 text-white font-mono"
        />
      ) : (
        <div className="flex gap-2">
          <div className="flex-1">
            <Label className="text-xs text-slate-400 font-mono">Feet</Label>
            <Input
              type="number"
              min={3}
              max={8}
              value={feet}
              onChange={(e) => {
                const f = parseInt(e.target.value, 10)
                if (!isNaN(f)) onHeightChange(feetInchesToCm(f, inches))
              }}
              className="bg-slate-900/50 border-slate-600/50 text-white font-mono mt-1"
            />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-slate-400 font-mono">Inches</Label>
            <Input
              type="number"
              min={0}
              max={11}
              value={inches}
              onChange={(e) => {
                const i = parseInt(e.target.value, 10)
                if (!isNaN(i)) onHeightChange(feetInchesToCm(feet, i))
              }}
              className="bg-slate-900/50 border-slate-600/50 text-white font-mono mt-1"
            />
          </div>
        </div>
      )}

      {heightCm && (
        <p className="text-xs text-slate-400 font-mono">
          {formatHeight(heightCm, heightUnit === "cm" ? "ftin" : "cm")} equivalent
        </p>
      )}
    </div>
  )
}
