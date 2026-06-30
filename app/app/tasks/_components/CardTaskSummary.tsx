import { CheckCircle } from "lucide-react"
import type { LinkedTasksSummary } from "@/lib/api/tasks"
import { cn } from "@/lib/utils"

interface CardTaskSummaryProps {
  summary: LinkedTasksSummary
  className?: string
}

export function CardTaskSummary({ summary, className }: CardTaskSummaryProps) {
  const { total, completed } = summary
  const allDone = total > 0 && completed === total
  const label =
    total === 0
      ? "0 tasks"
      : `${completed}/${total} ${total === 1 ? "task" : "tasks"} done`

  return (
    <p
      className={cn(
        "text-xs flex items-center justify-center gap-1",
        total === 0 && "text-gray-400",
        total > 0 && !allDone && "text-cyan-400",
        allDone && "text-green-400",
        className,
      )}
    >
      <CheckCircle className="h-3 w-3 shrink-0" />
      {label}
    </p>
  )
}
