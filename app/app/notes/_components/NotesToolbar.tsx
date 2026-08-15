"use client"

import { useRef } from "react"
import {
  Search,
  Grid,
  List,
  Table2,
  Plus,
  Download,
  Upload,
  Archive,
  Trash2,
  Filter,
  SortAsc,
  PanelRight,
  LayoutGrid,
  Rows3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotes } from "../_hooks/useNotes"
import { inputClassName, primaryButtonClassName } from "./constants"
import type { SortField, ViewMode } from "../_types/notes.types"

interface NotesToolbarProps {
  onNewNote: () => void
  onOpenFilters: () => void
}

export function NotesToolbar({ onNewNote, onOpenFilters }: NotesToolbarProps) {
  const {
    filters,
    setFilters,
    layout,
    setViewMode,
    setSort,
    togglePreviewPanel,
    exportNotes,
    importNotes,
    selectedNoteIds,
    bulkArchive,
    bulkDelete,
    clearSelection,
  } = useNotes()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const selectedIds = Array.from(selectedNoteIds)
  const hasSelection = selectedIds.length > 0

  const viewModes: { mode: ViewMode; icon: typeof Grid; label: string }[] = [
    { mode: "grid", icon: Grid, label: "Grid" },
    { mode: "list", icon: List, label: "List" },
    { mode: "table", icon: Table2, label: "Table" },
    { mode: "compact", icon: Rows3, label: "Compact" },
  ]

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (Array.isArray(data)) importNotes(data)
      } catch {
        /* invalid file */
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search notes..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className={`pl-9 ${inputClassName}`}
          />
        </div>
        <Button variant="outline" size="icon" className="border-slate-600 text-slate-300" onClick={onOpenFilters}>
          <Filter className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="border-slate-600 text-slate-300">
              <SortAsc className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-800 border-slate-600">
            {(
              [
                ["updatedAt", "Updated"],
                ["createdAt", "Created"],
                ["title", "Title"],
                ["priority", "Priority"],
              ] as [SortField, string][]
            ).map(([field, label]) => (
              <DropdownMenuItem
                key={field}
                className="text-slate-200 font-mono"
                onClick={() =>
                  setSort(
                    field,
                    layout.sortField === field && layout.sortOrder === "desc" ? "asc" : "desc"
                  )
                }
              >
                {label} {layout.sortField === field ? (layout.sortOrder === "desc" ? "↓" : "↑") : ""}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {hasSelection && (
          <>
            <span className="text-sm text-cyan-300 font-mono">{selectedIds.length} selected</span>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300"
              onClick={() => bulkArchive(selectedIds)}
            >
              <Archive className="h-3 w-3 mr-1" />
              Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-600/50 text-red-400"
              onClick={() => bulkDelete(selectedIds)}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={clearSelection}>
              Clear
            </Button>
          </>
        )}

        <div className="flex border border-slate-600/50 rounded-md overflow-hidden">
          {viewModes.map(({ mode, icon: Icon }) => (
            <Button
              key={mode}
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-none ${
                layout.viewMode === mode ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400"
              }`}
              onClick={() => setViewMode(mode)}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <Button variant="outline" size="icon" className="border-slate-600 text-slate-300" onClick={togglePreviewPanel}>
          <PanelRight className="h-4 w-4" />
        </Button>

        <Button onClick={onNewNote} size="sm" className={primaryButtonClassName}>
          <Plus className="h-4 w-4 mr-1" />
          Create
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="border-slate-600 text-slate-300">
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-800 border-slate-600">
            <DropdownMenuItem className="text-slate-200" onClick={() => exportNotes("markdown", selectedIds.length ? selectedIds : undefined)}>
              <Download className="h-4 w-4 mr-2" />
              Export Markdown
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-200" onClick={() => exportNotes("json", selectedIds.length ? selectedIds : undefined)}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-600" />
            <DropdownMenuItem className="text-slate-200" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Import JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </div>
    </div>
  )
}
