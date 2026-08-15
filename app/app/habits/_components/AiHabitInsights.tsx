"use client"

import { Brain } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AI_HABIT_INSIGHTS } from "./constants"

const insightStyles = [
  "from-primary/15 to-primary/5 border-primary/25",
  "from-orange-500/15 to-amber-500/5 border-orange-500/25",
  "from-emerald-500/15 to-teal-500/5 border-emerald-500/25",
]

export function AiHabitInsights() {
  return (
    <Card className="astra-card">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <Brain className="mr-2 h-5 w-5 text-yellow-500" />
          AI Habit Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {AI_HABIT_INSIGHTS.map((message, index) => (
            <div
              key={message}
              className={`rounded-lg border bg-gradient-to-r p-3 backdrop-blur-sm ${insightStyles[index % insightStyles.length]}`}
            >
              <p className="text-sm text-foreground">{message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
