"use client"

import { useState } from "react"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNotes } from "../_hooks/useNotes"
import { cardClassName, primaryButtonClassName } from "./constants"

export function QuickNoteCapture() {
  const { createNote } = useNotes()
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!content.trim()) return
    setIsSaving(true)
    const title = content.trim().split("\n")[0].slice(0, 60) || "Quick Note"
    await createNote({
      title,
      content: content.trim(),
      noteType: "quick-notes",
      category: "Personal",
      tags: ["quick-capture"],
      priority: "low",
    })
    setContent("")
    setIsSaving(false)
  }

  return (
    <Card className={`${cardClassName} border-cyan-500/20`}>
      <CardHeader className="pb-2">
        <CardTitle className="font-poppins text-cyan-300 flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-yellow-400" />
          Quick Capture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Jot something down... press save when ready"
          className="min-h-[100px] bg-slate-900/50 border-slate-600 text-slate-100 font-inter resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave()
          }}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500 font-mono">Ctrl+Enter to save</span>
          <Button onClick={handleSave} disabled={!content.trim() || isSaving} className={primaryButtonClassName} size="sm">
            <Zap className="h-4 w-4 mr-1" />
            Save Quick Note
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
