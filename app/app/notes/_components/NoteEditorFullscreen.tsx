"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotes } from "../_hooks/useNotes"
import { RichTextEditor } from "./RichTextEditor"
import type { Note } from "../_types/notes.types"

interface NoteEditorFullscreenProps {
  note: Note | null
  open: boolean
  onClose: () => void
}

export function NoteEditorFullscreen({ note, open, onClose }: NoteEditorFullscreenProps) {
  const { updateNote } = useNotes()

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  if (!open || !note) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <input
          className="text-2xl font-poppins text-cyan-300 bg-transparent border-none outline-none flex-1"
          value={note.title}
          onChange={(e) => updateNote(note.id, { title: e.target.value })}
        />
        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 p-6 overflow-auto max-w-4xl mx-auto w-full">
        <RichTextEditor
          value={note.content}
          onChange={(content) => updateNote(note.id, { content })}
          minHeight="min-h-[60vh]"
        />
        <p className="text-xs text-slate-500 font-mono mt-4 text-center">Auto-saved · Press Esc to exit</p>
      </div>
    </div>
  )
}
