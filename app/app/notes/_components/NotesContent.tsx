"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { PanelLeft } from "lucide-react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { useNotes } from "../_hooks/useNotes"
import { NotesSidebar } from "./NotesSidebar"
import { NotesToolbar } from "./NotesToolbar"
import { NotesViews } from "./NotesViews"
import { NotePreviewPanel } from "./NotePreviewPanel"
import { QuickNoteCapture } from "./QuickNoteCapture"
import { NotesFiltersDialog } from "./NotesFiltersDialog"
import { NoteFormDialog } from "./NoteFormDialog"
import { NoteEditorFullscreen } from "./NoteEditorFullscreen"
import type { NoteFormValues } from "../_schemas/notes.schema"
import type { NoteType } from "../_types/notes.types"
import { TAB_TO_NOTE_TYPE } from "./constants"
import { sanitizeNoteHtml } from "@/lib/sanitizeNoteHtml"

export function NotesContent() {
  const {
    activeTab,
    createNote,
    updateNote,
    notes,
    layout,
    editingNote,
    setEditingNote,
    selectedNoteId,
  } = useNotes()

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const defaultType = TAB_TO_NOTE_TYPE[activeTab] ?? "quick-notes"

  const openCreate = () => {
    setFormMode("add")
    setEditingNote(null)
    setFormOpen(true)
  }

  const openEdit = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (!note) return
    setFormMode("edit")
    setEditingNote(note)
    setFormOpen(true)
  }

  const handleFormSubmit = async (values: NoteFormValues) => {
    const tags = values.tags
      ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : []

    if (formMode === "add") {
      await createNote({
        title: values.title,
        content: sanitizeNoteHtml(values.content ?? ""),
        noteType: values.noteType as NoteType,
        category: values.category,
        tags,
        priority: values.priority,
        isFavorite: values.isFavorite,
        color: values.color,
        status: values.status,
        reminder: values.reminder,
        visibility: values.visibility,
        metadata: values.metadata,
      })
    } else if (editingNote) {
      updateNote(editingNote.id, {
        title: values.title,
        content: sanitizeNoteHtml(values.content ?? ""),
        noteType: values.noteType as NoteType,
        category: values.category,
        tags,
        priority: values.priority,
        isFavorite: values.isFavorite,
        color: values.color,
        status: values.status,
        reminder: values.reminder,
        visibility: values.visibility,
        metadata: values.metadata,
      })
    }
    setFormOpen(false)
  }

  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null

  return (
    <>
      <div className="space-y-4">
        <NotesToolbar onNewNote={openCreate} onOpenFilters={() => setFiltersOpen(true)} />

        {activeTab === "quick-notes" && <QuickNoteCapture />}

        <div className="lg:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 mb-2">
                <PanelLeft className="h-4 w-4 mr-2" />
                Sidebar
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-slate-900 border-slate-700 w-72">
              <NotesSidebar onNewNote={() => { openCreate(); setSidebarOpen(false) }} />
            </SheetContent>
          </Sheet>
        </div>

        <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg">
          <ResizablePanel defaultSize={18} minSize={15} maxSize={25} className="hidden lg:block">
            <div className="h-full pr-3">
              <NotesSidebar onNewNote={openCreate} />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="hidden lg:flex bg-slate-600/50" />

          <ResizablePanel defaultSize={layout.previewPanelOpen ? 52 : 82} minSize={40}>
            <div className="h-full px-1 lg:px-3 overflow-auto">
              <NotesViews onEditNote={openEdit} />
            </div>
          </ResizablePanel>

          {layout.previewPanelOpen && (
            <>
              <ResizableHandle withHandle className="hidden md:flex bg-slate-600/50" />
              <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="hidden md:block">
                <div className="h-full pl-3">
                  <NotePreviewPanel
                    onEdit={() => selectedNote && openEdit(selectedNote.id)}
                    onFullscreen={() => setFullscreenOpen(true)}
                  />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      <NoteFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        note={editingNote}
        defaultType={defaultType}
        onSubmit={handleFormSubmit}
      />

      <NotesFiltersDialog open={filtersOpen} onOpenChange={setFiltersOpen} />

      <NoteEditorFullscreen
        note={selectedNote}
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
      />
    </>
  )
}
