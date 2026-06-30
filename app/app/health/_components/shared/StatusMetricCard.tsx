"use client"

import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BmiTone } from "../../_types/health.types"
import { getBmiToneClasses } from "../../_utils/bmi"

interface StatusMetricCardProps {
  title: string
  icon: LucideIcon
  value: string
  subtitle?: string
  statusLabel?: string
  tone?: BmiTone
}

export function StatusMetricCard({
  title,
  icon: Icon,
  value,
  subtitle,
  statusLabel,
  tone = "neutral",
}: StatusMetricCardProps) {
  const classes = getBmiToneClasses(tone)

  return (
    <Card className={`bg-gradient-to-br ${classes.bg} ${classes.border} backdrop-blur-sm`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm font-mono flex items-center ${classes.text}`}>
          <Icon className="mr-2 h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <div className={`text-2xl font-bold font-mono ${classes.text}`}>{value}</div>
          {statusLabel && (
            <Badge variant="outline" className={`font-mono text-xs ${classes.badge}`}>
              {statusLabel}
            </Badge>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-400 font-mono mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
