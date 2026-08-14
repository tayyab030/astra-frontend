"use client"

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotes } from "../_hooks/useNotes"
import { AI_ACTIONS } from "./constants"

interface AiActionsPanelProps {
  noteId?: string
  compact?: boolean
}

export function AiActionsPanel({ noteId, compact }: AiActionsPanelProps) {
  const { runAiAction } = useNotes()

  const actions = compact ? AI_ACTIONS.slice(0, 8) : AI_ACTIONS

  return (
    <div>
      <h4 className="text-xs font-mono text-cyan-300 mb-2 flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-yellow-400" />
        AI Actions
      </h4>
      <ScrollArea className={compact ? "max-h-40" : undefined}>
        <div className={`grid gap-1.5 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="justify-start border-slate-600/50 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/30 text-xs h-8 font-mono"
                onClick={() => runAiAction(action.id, noteId)}
              >
                <Icon className="h-3 w-3 mr-1.5 shrink-0" />
                <span className="truncate">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
