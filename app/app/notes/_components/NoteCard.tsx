"use client"

import { format, parseISO } from "date-fns"
import {
  Star,
  Pin,
  Clock,
  Hash,
  Link,
  MoreHorizontal,
  Bot,
  CheckSquare,
  Copy,
  Archive,
  Trash2,
  Pencil,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Note } from "../_types/notes.types"
import { getWordCount } from "../_utils/notesStorage"
import { cardClassName, NOTE_PRIORITIES } from "./constants"
import { cn } from "@/lib/utils"

interface NoteCardProps {
  note: Note
  isSelected: boolean
  isActive: boolean
  viewMode: "grid" | "list" | "compact"
  onSelect: () => void
  onToggleSelection: () => void
  onEdit: () => void
  onDuplicate: () => void
  onArchive: () => void
  onDelete: () => void
  onFavorite: () => void
  onPin: () => void
  onAiAction: (action: string) => void
}

export function NoteCard({
  note,
  isSelected,
  isActive,
  viewMode,
  onSelect,
  onToggleSelection,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  onFavorite,
  onPin,
  onAiAction,
}: NoteCardProps) {
  const priority = NOTE_PRIORITIES.find((p) => p.value === note.priority)
  const wordCount = getWordCount(note.content)

  const menuItems = (
    <>
      <ContextMenuItem onClick={onSelect}>
        <ExternalLink className="h-4 w-4 mr-2" />
        Open
      </ContextMenuItem>
      <ContextMenuItem onClick={onEdit}>
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </ContextMenuItem>
      <ContextMenuItem onClick={onDuplicate}>
        <Copy className="h-4 w-4 mr-2" />
        Duplicate
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={onFavorite}>
        <Star className="h-4 w-4 mr-2" />
        {note.isFavorite ? "Unfavorite" : "Favorite"}
      </ContextMenuItem>
      <ContextMenuItem onClick={onPin}>
        <Pin className="h-4 w-4 mr-2" />
        {note.isPinned ? "Unpin" : "Pin"}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={onArchive}>
        <Archive className="h-4 w-4 mr-2" />
        Archive
      </ContextMenuItem>
      <ContextMenuItem onClick={onDelete} className="text-red-400">
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </ContextMenuItem>
    </>
  )

  const cardContent = (
    <Card
      className={cn(
        cardClassName,
        "cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/10",
        isActive && "ring-2 ring-cyan-500/50",
        isSelected && "ring-2 ring-blue-500/50",
        note.color && `border-${note.color}-500/30`,
        viewMode === "compact" && "p-2"
      )}
      onClick={onSelect}
    >
      <CardHeader className={cn("pb-2 space-y-2", viewMode === "compact" && "p-3 pb-1")}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection()}
              onClick={(e) => e.stopPropagation()}
              className="border-slate-500"
            />
            <Badge variant="secondary" className="text-xs bg-slate-600/50 text-slate-300 shrink-0">
              {note.category}
            </Badge>
            {note.isPinned && <Pin className="h-3 w-3 text-yellow-400 shrink-0" />}
            {note.isFavorite && <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 shrink-0" />}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className={cn("text-xs font-mono", priority?.color)}>{priority?.label}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-600" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem className="text-slate-200" onClick={onEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-slate-200" onClick={onDuplicate}>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-600" />
                <DropdownMenuItem className="text-slate-200" onClick={onArchive}>Archive</DropdownMenuItem>
                <DropdownMenuItem className="text-red-400" onClick={onDelete}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardTitle className={cn("font-poppins text-cyan-300 leading-tight", viewMode === "compact" ? "text-sm" : "text-lg")}>
          {note.title}
        </CardTitle>
      </CardHeader>
      {viewMode !== "compact" && (
        <CardContent className="space-y-3 pt-0">
          <p className="text-sm text-slate-300 font-inter line-clamp-3">{note.content.replace(/[#*`]/g, "")}</p>
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                <Hash className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          {note.linkedItems.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.linkedItems.slice(0, 2).map((link) => (
                <Badge key={link.id} variant="secondary" className="text-xs bg-slate-600/50">
                  <Link className="h-2 w-2 mr-1" />
                  {link.label}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-600/50">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              {format(parseISO(note.updatedAt), "MMM d, yyyy")}
              <span>· {wordCount} words</span>
            </div>
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-slate-400" onClick={() => onAiAction("summarize")}>
                <Bot className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-slate-400" onClick={() => onAiAction("extract-tasks")}>
                <CheckSquare className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )

  return (
    <ContextMenu>
      <ContextMenuTrigger>{cardContent}</ContextMenuTrigger>
      <ContextMenuContent className="bg-slate-800 border-slate-600">{menuItems}</ContextMenuContent>
    </ContextMenu>
  )
}
