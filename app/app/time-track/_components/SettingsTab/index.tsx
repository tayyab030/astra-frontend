"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { UseTimeTrackReturn } from "../_hooks/useTimeTrack"
import { ACTIVITY_BAR_OPTIONS } from "../constants"

interface SettingsTabProps {
  timeTrack: UseTimeTrackReturn
}

export function SettingsTab({ timeTrack }: SettingsTabProps) {
  const { settings, updateActivityBarVisible } = timeTrack
  const currentValue = settings.activityBarVisible ? "visible" : "hidden"

  return (
    <div className="space-y-4 pb-6 max-w-lg">
      <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base font-mono text-white">Activity Bar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-400 font-mono">
            Show a compact timer bar at the bottom of the page to start or stop tracking
            from any tab.
          </p>
          <RadioGroup
            value={currentValue}
            onValueChange={(value) => updateActivityBarVisible(value === "visible")}
            className="space-y-3"
          >
            {ACTIVITY_BAR_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem
                  value={option.value}
                  id={`activity-bar-${option.value}`}
                  className="border-slate-500 text-cyan-400"
                />
                <Label
                  htmlFor={`activity-bar-${option.value}`}
                  className="font-mono text-sm text-slate-200 cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )
}
