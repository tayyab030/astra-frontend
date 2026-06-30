"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import { getAiGoalInsights } from "./constants"

export function AiGoalInsights() {
  const { formatCurrency } = useCurrency()
  const insights = getAiGoalInsights(formatCurrency)
  const insightStyles = [
    "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
    "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    "from-cyan-400/20 to-blue-400/20 border-cyan-400/30",
  ]

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-poppins flex items-center">
          <Brain className="mr-2 h-5 w-5 text-yellow-400" />
          <span className="text-cyan-300">AI Goal Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((message, index) => (
            <div
              key={index}
              className={`p-3 bg-gradient-to-r ${insightStyles[index]} rounded-lg border backdrop-blur-sm`}
            >
              <p className="text-sm font-inter text-slate-200">{message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
