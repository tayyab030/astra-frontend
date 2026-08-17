"use client"

import { useMemo, useState } from "react"
import {
  MessageSquarePlus,
  MoreVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { AssistantConversation } from "@/lib/api/assistant"
import {
  formatConversationStamp,
  sortByRecentActivity,
} from "@/lib/assistant/chatDate"

type Props = {
  open: boolean
  onClose: () => void
  conversations: AssistantConversation[]
  activeId: string | null
  busy?: boolean
  onNewChat: () => void
  onSelect: (id: string) => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}

export function ConversationSidebar({
  open,
  onClose,
  conversations,
  activeId,
  busy,
  onNewChat,
  onSelect,
  onRename,
  onDelete,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState("")

  // The API already returns newest first; re-sort so an optimistic local
  // update still floats the active chat to the top before the next refetch.
  const ordered = useMemo(
    () => sortByRecentActivity(conversations),
    [conversations]
  )

  const startRename = (item: AssistantConversation) => {
    setEditingId(item.id)
    setDraftTitle(item.title)
  }

  const commitRename = () => {
    if (!editingId) return
    const title = draftTitle.trim()
    if (title) onRename(editingId, title)
    setEditingId(null)
    setDraftTitle("")
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-border bg-background p-3 transition-transform md:static md:z-0 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-3 flex items-center justify-between gap-2 md:hidden">
          <p className="font-mono text-sm text-muted-foreground">Chats</p>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="mb-3 justify-start gap-2"
          disabled={busy}
          onClick={() => {
            onNewChat()
            onClose()
          }}
        >
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </Button>

        <div className="flex-1 space-y-1 overflow-y-auto pr-1">
          {ordered.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted-foreground">
              No chats yet. Start a new one.
            </p>
          ) : (
            ordered.map((item) => {
              const active = item.id === activeId
              const editing = editingId === item.id
              return (
                <div
                  key={item.id}
                  className={`group flex items-center gap-1 rounded-md px-2 py-2 ${
                    active ? "bg-muted" : "hover:bg-muted/60"
                  }`}
                >
                  {editing ? (
                    <Input
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          commitRename()
                        }
                        if (e.key === "Escape") {
                          setEditingId(null)
                        }
                      }}
                      autoFocus
                      className="h-8 flex-1"
                    />
                  ) : (
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-baseline gap-2 text-left"
                      onClick={() => {
                        onSelect(item.id)
                        onClose()
                      }}
                    >
                      <span className="min-w-0 flex-1 truncate text-sm">
                        {item.title || "New chat"}
                      </span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatConversationStamp(
                          new Date(item.updated_at || item.created_at)
                        )}
                      </span>
                    </button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 md:opacity-0 md:group-hover:opacity-100 md:data-[state=open]:opacity-100"
                        aria-label="Chat actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => startRename(item)}>
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          if (window.confirm(`Delete “${item.title}”?`)) {
                            onDelete(item.id)
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })
          )}
        </div>
      </aside>
    </>
  )
}
