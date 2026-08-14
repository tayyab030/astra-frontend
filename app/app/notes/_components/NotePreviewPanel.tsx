"use client"

import { format, parseISO } from "date-fns"
import {
  Star,
  Pin,
  Clock,
  Hash,
  Link,
  Paperclip,
  History,
  Sparkles,
  Pencil,
  Maximize2,
  RotateCcw,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useNotes } from "../_hooks/useNotes"
import { cardClassName, NOTE_PRIORITIES } from "./constants"
import { AiActionsPanel } from "./AiActionsPanel"
import { getWordCount } from "../_utils/notesStorage"

interface NotePreviewPanelProps {
  onEdit: () => void
  onFullscreen: () => void
}

export function NotePreviewPanel({ onEdit, onFullscreen }: NotePreviewPanelProps) {
  const { notes, selectedNoteId, updateNote, restoreVersion, runAiAction } = useNotes()
  const note = notes.find((n) => n.id === selectedNoteId)

  if (!note) {
    return (
      <div className={`h-full flex items-center justify-center p-6 ${cardClassName} rounded-lg`}>
        <div className="text-center">
          <Sparkles className="h-10 w-10 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400 font-inter text-sm">Select a note to preview</p>
        </div>
      </div>
    )
  }

  const priority = NOTE_PRIORITIES.find((p) => p.value === note.priority)
  const relatedNotes = notes
    .filter((n) => n.id !== note.id && n.tags.some((t) => note.tags.includes(t)))
    .slice(0, 3)

  return (
    <div className={`h-full flex flex-col ${cardClassName} rounded-lg overflow-hidden`}>
      <div className="p-4 border-b border-slate-600/50 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-poppins text-lg text-cyan-300 leading-tight">{note.title}</h2>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={onFullscreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-slate-600/50 text-slate-300">{note.category}</Badge>
          <Badge variant="outline" className="border-slate-600 text-slate-400 capitalize">{note.noteType.replace("-", " ")}</Badge>
          <span className={`text-xs font-mono ${priority?.color}`}>{priority?.label}</span>
          {note.isFavorite && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
          {note.isPinned && <Pin className="h-4 w-4 text-yellow-400" />}
        </div>
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
              <Hash className="h-2 w-2 mr-1" />{tag}
            </Badge>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-slate-300 font-inter text-sm whitespace-pre-wrap leading-relaxed">
              {note.content}
            </p>
          </div>

          {note.linkedItems.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-slate-400 mb-2">Linked Items</h4>
              <div className="flex flex-wrap gap-1">
                {note.linkedItems.map((link) => (
                  <Badge key={link.id} variant="secondary" className="text-xs bg-slate-600/50">
                    <Link className="h-2 w-2 mr-1" />{link.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {note.attachments.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-slate-400 mb-2">Attachments</h4>
              {note.attachments.map((att) => (
                <div key={att.id} className="flex items-center gap-2 text-sm text-slate-300">
                  <Paperclip className="h-3 w-3" />{att.name}
                </div>
              ))}
            </div>
          )}

          <div className="text-xs text-slate-500 font-mono space-y-1">
            <div className="flex items-center gap-1"><Clock className="h-3 w-3" />Created {format(parseISO(note.createdAt), "PPp")}</div>
            <div className="flex items-center gap-1"><Clock className="h-3 w-3" />Updated {format(parseISO(note.updatedAt), "PPp")}</div>
            <div>{getWordCount(note.content)} words</div>
          </div>

          <Separator className="bg-slate-600/50" />

          <AiActionsPanel noteId={note.id} compact />

          {relatedNotes.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-cyan-300 mb-2">Related Notes</h4>
              <div className="space-y-2">
                {relatedNotes.map((rn) => (
                  <div key={rn.id} className="p-2 rounded bg-slate-700/30 text-sm text-slate-300">
                    {rn.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {note.versions.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-cyan-300 mb-2 flex items-center gap-1">
                <History className="h-3 w-3" /> Version History
              </h4>
              <div className="space-y-1">
                {note.versions.slice(0, 5).map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-2 rounded bg-slate-700/30 text-xs">
                    <span className="text-slate-400">{format(parseISO(v.createdAt), "PPp")}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-cyan-400"
                      onClick={() => restoreVersion(note.id, v.id)}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />Restore
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {note.activity.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-cyan-300 mb-2">Recent Activity</h4>
              <div className="space-y-1">
                {note.activity.slice(0, 5).map((a) => (
                  <div key={a.id} className="text-xs text-slate-500 font-mono">
                    {a.action} · {format(parseISO(a.timestamp), "PP")}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-slate-600/50 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-slate-600 text-slate-300 text-xs"
          onClick={() => updateNote(note.id, { isFavorite: !note.isFavorite })}
        >
          <Star className="h-3 w-3 mr-1" />
          {note.isFavorite ? "Unfavorite" : "Favorite"}
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 text-xs"
          onClick={() => runAiAction("summarize", note.id)}
        >
          <Sparkles className="h-3 w-3 mr-1" />
          AI Summarize
        </Button>
      </div>
    </div>
  )
}
