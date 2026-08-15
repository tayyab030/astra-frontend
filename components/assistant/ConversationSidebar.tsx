"use client"

import { useState } from "react"
import { MessageSquarePlus, Pencil, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { AssistantConversation } from "@/lib/api/assistant"

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
          {conversations.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted-foreground">
              No chats yet. Start a new one.
            </p>
          ) : (
            conversations.map((item) => {
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
                      className="min-w-0 flex-1 truncate text-left text-sm"
                      onClick={() => {
                        onSelect(item.id)
                        onClose()
                      }}
                    >
                      {item.title || "New chat"}
                    </button>
                  )}

                  <div className="flex shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => startRename(item)}
                      aria-label="Rename chat"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => {
                        if (window.confirm(`Delete “${item.title}”?`)) {
                          onDelete(item.id)
                        }
                      }}
                      aria-label="Delete chat"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </aside>
    </>
  )
}
