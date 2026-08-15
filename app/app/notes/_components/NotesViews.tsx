"use client"

import { format, parseISO } from "date-fns"
import { FileText, Star, Pin } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CardGridSkeleton } from "@/components/skeletons"
import { useNotes } from "../_hooks/useNotes"
import { NoteCard } from "./NoteCard"
import { NotesEmptyState } from "./NotesEmptyState"
import { cardClassName, NOTE_PRIORITIES } from "./constants"

interface NotesViewsProps {
  onEditNote: (noteId: string) => void
}

export function NotesViews({ onEditNote }: NotesViewsProps) {
  const {
    filteredNotes,
    layout,
    isLoading,
    selectedNoteId,
    setSelectedNoteId,
    selectedNoteIds,
    toggleNoteSelection,
    updateNote,
    duplicateNote,
    archiveNote,
    deleteNote,
    runAiAction,
    hasMore,
    loadMore,
  } = useNotes()

  if (isLoading) {
    return <CardGridSkeleton count={6} className="md:grid-cols-2" />
  }

  if (filteredNotes.length === 0) {
    return (
      <NotesEmptyState
        icon={FileText}
        title="No notes found"
        description="Try adjusting your filters or create a new note to get started."
      />
    )
  }

  if (layout.viewMode === "table") {
    return (
      <div className={`rounded-lg border ${cardClassName} overflow-hidden`}>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-600/50 hover:bg-transparent">
              <TableHead className="w-10" />
              <TableHead className="text-cyan-300 font-mono">Title</TableHead>
              <TableHead className="text-cyan-300 font-mono">Category</TableHead>
              <TableHead className="text-cyan-300 font-mono">Tags</TableHead>
              <TableHead className="text-cyan-300 font-mono">Updated</TableHead>
              <TableHead className="text-cyan-300 font-mono">Priority</TableHead>
              <TableHead className="text-cyan-300 font-mono">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotes.map((note) => (
              <TableRow
                key={note.id}
                className="border-slate-600/50 cursor-pointer hover:bg-slate-700/30"
                onClick={() => setSelectedNoteId(note.id)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedNoteIds.has(note.id)}
                    onCheckedChange={() => toggleNoteSelection(note.id)}
                    className="border-slate-500"
                  />
                </TableCell>
                <TableCell className="font-poppins text-slate-200">
                  <div className="flex items-center gap-2">
                    {note.isPinned && <Pin className="h-3 w-3 text-yellow-400" />}
                    {note.isFavorite && <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />}
                    {note.title}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-600/50 text-slate-300">
                    {note.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {note.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-slate-400 text-sm font-mono">
                  {format(parseISO(note.updatedAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-sm font-mono">
                  {NOTE_PRIORITIES.find((p) => p.value === note.priority)?.label}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-slate-600 text-slate-400 capitalize">
                    {note.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {hasMore && <LoadMoreButton onClick={loadMore} />}
      </div>
    )
  }

  const gridClass =
    layout.viewMode === "list"
      ? "flex flex-col gap-3"
      : layout.viewMode === "compact"
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
        : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4"

  return (
    <div>
      <div className={gridClass}>
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isSelected={selectedNoteIds.has(note.id)}
            isActive={selectedNoteId === note.id}
            viewMode={layout.viewMode === "compact" ? "compact" : layout.viewMode === "list" ? "list" : "grid"}
            onSelect={() => setSelectedNoteId(note.id)}
            onToggleSelection={() => toggleNoteSelection(note.id)}
            onEdit={() => onEditNote(note.id)}
            onDuplicate={() => duplicateNote(note.id)}
            onArchive={() => archiveNote(note.id)}
            onDelete={() => deleteNote(note.id)}
            onFavorite={() => updateNote(note.id, { isFavorite: !note.isFavorite })}
            onPin={() => updateNote(note.id, { isPinned: !note.isPinned })}
            onAiAction={(action) => runAiAction(action, note.id)}
          />
        ))}
      </div>
      {hasMore && <LoadMoreButton onClick={loadMore} />}
    </div>
  )
}

function LoadMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-center pt-6">
      <button
        onClick={onClick}
        className="text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        Load more notes...
      </button>
    </div>
  )
}
