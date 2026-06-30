"use client"

import { Brain, Frown, Meh, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useHealthContext } from "../../_context/HealthProvider"
import { MOOD_OPTIONS } from "../constants"
import { HealthEmptyState } from "../shared/HealthEmptyState"
import type { MoodValue } from "../../_types/health.types"

const MOOD_ICONS = {
  great: Smile,
  good: Smile,
  okay: Meh,
  bad: Frown,
  terrible: Frown,
} as const

export function WellnessTab() {
  const { moodToday, moodNotes, setMoodToday, setMoodNotes } = useHealthContext()

  return (
    <div className="space-y-6 pb-6">
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-mono flex items-center text-cyan-300">
            <Brain className="mr-2 h-5 w-5 text-blue-400" />
            Mood & Mental Wellness
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-mono text-slate-200">How are you feeling today?</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {MOOD_OPTIONS.map((mood) => {
                const Icon = MOOD_ICONS[mood.value]
                return (
                  <Button
                    key={mood.value}
                    variant={moodToday === mood.value ? "default" : "outline"}
                    size="sm"
                    className={`flex-col h-16 font-mono ${
                      moodToday === mood.value
                        ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                        : "border-slate-600 text-slate-300 hover:bg-slate-700/50"
                    }`}
                    onClick={() => setMoodToday(mood.value as MoodValue)}
                  >
                    <Icon className={`h-4 w-4 ${mood.color}`} />
                    <span className="text-xs mt-1">{mood.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>
          <div>
            <Label htmlFor="mood-notes" className="text-slate-200 font-mono">
              Notes (optional)
            </Label>
            <Textarea
              id="mood-notes"
              placeholder="How was your day? Any thoughts or feelings to record..."
              value={moodNotes}
              onChange={(e) => setMoodNotes(e.target.value)}
              className="mt-1 bg-slate-700/50 border-slate-600 text-slate-100 font-mono"
            />
          </div>
          <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 font-mono">
            Save Mood Check-in
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-mono text-cyan-300 text-base">Mood History</CardTitle>
        </CardHeader>
        <CardContent>
          <HealthEmptyState
            icon={Brain}
            title="No mood history yet"
            description="Your mood check-ins will appear here once you start logging how you feel each day."
          />
        </CardContent>
      </Card>
    </div>
  )
}
