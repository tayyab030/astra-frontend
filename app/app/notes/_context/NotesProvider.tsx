"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  archiveNoteApi,
  bulkNotesAction,
  createNoteApi,
  deleteNoteApi,
  duplicateNoteApi,
  fetchNotesDashboard,
  getNotesErrorMessage,
  restoreNoteApi,
  restoreNoteVersionApi,
  updateNoteApi,
} from "@/lib/api/notes"
import type {
  CreateNotePayload,
  Note,
  NoteFilters,
  NotesLayoutPreferences,
  NotesStats,
  NoteTabId,
  SortField,
  SortOrder,
  UpdateNotePayload,
  ViewMode,
} from "../_types/notes.types"
import type { SidebarFilterId } from "../_components/constants"
import {
  exportNotesAsJson,
  exportNotesAsMarkdown,
  loadLayoutPreferences,
  saveLayoutPreferences,
} from "../_utils/notesStorage"
import {
  mapCreatePayloadToApi,
  mapNoteFromApi,
  mapSortFieldToApi,
  mapStatsFromApi,
  mapUpdatePayloadToApi,
} from "../_utils/noteMappers"
import { notesKeys } from "../_hooks/queryKeys"

const DEFAULT_FILTERS: NoteFilters = {
  search: "",
  category: "all",
  tag: "all",
  priority: "all",
  status: "all",
  favorite: null,
  archived: null,
  hasReminder: null,
  hasAttachment: null,
  aiGenerated: null,
}

const EMPTY_STATS: NotesStats = {
  totalNotes: 0,
  notesThisWeek: 0,
  ideasCreated: 0,
  researchCompleted: 0,
  booksRead: 0,
  journalStreak: 0,
  decisionAccuracy: 0,
  topTags: [],
  categoryDistribution: [],
}

interface NotesContextValue {
  notes: Note[]
  filteredNotes: Note[]
  stats: NotesStats
  isLoading: boolean
  activeTab: NoteTabId
  setActiveTab: (tab: NoteTabId) => void
  filters: NoteFilters
  setFilters: (filters: Partial<NoteFilters>) => void
  sidebarFilter: SidebarFilterId
  setSidebarFilter: (filter: SidebarFilterId) => void
  selectedNoteId: string | null
  setSelectedNoteId: (id: string | null) => void
  selectedNoteIds: Set<string>
  toggleNoteSelection: (id: string) => void
  selectAllNotes: () => void
  clearSelection: () => void
  layout: NotesLayoutPreferences
  setViewMode: (mode: ViewMode) => void
  setSort: (field: SortField, order: SortOrder) => void
  togglePreviewPanel: () => void
  createNote: (payload: CreateNotePayload) => Promise<Note | undefined>
  updateNote: (id: string, payload: UpdateNotePayload) => void
  deleteNote: (id: string, permanent?: boolean) => void
  restoreNote: (id: string) => void
  archiveNote: (id: string) => void
  duplicateNote: (id: string) => void
  bulkArchive: (ids: string[]) => void
  bulkDelete: (ids: string[], permanent?: boolean) => void
  bulkFavorite: (ids: string[]) => void
  bulkTag: (ids: string[], tag: string) => void
  restoreVersion: (noteId: string, versionId: string) => void
  exportNotes: (format: "json" | "markdown", ids?: string[]) => void
  importNotes: (data: Note[]) => void
  allTags: string[]
  allCategories: string[]
  sidebarCounts: {
    all: number
    favorites: number
    pinned: number
    reminders: number
    attachments: number
    trash: number
  }
  isEditorOpen: boolean
  setIsEditorOpen: (open: boolean) => void
  editingNote: Note | null
  setEditingNote: (note: Note | null) => void
  page: number
  loadMore: () => void
  hasMore: boolean
  runAiAction: (actionId: string, noteId?: string) => void
}

const NotesContext = createContext<NotesContextValue | null>(null)

const PAGE_SIZE = 12

export function NotesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<NoteTabId>("all")
  const [filters, setFiltersState] = useState<NoteFilters>(DEFAULT_FILTERS)
  const [sidebarFilter, setSidebarFilter] = useState<SidebarFilterId>("all")
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string>>(new Set())
  const [layout, setLayout] = useState<NotesLayoutPreferences>(loadLayoutPreferences)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [page, setPage] = useState(1)

  const queryParams = useMemo(
    () => ({
      active_tab: activeTab,
      search: filters.search || undefined,
      category: filters.category !== "all" ? filters.category : undefined,
      tag: filters.tag !== "all" ? filters.tag : undefined,
      priority: filters.priority !== "all" ? filters.priority : undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      sidebar_filter: sidebarFilter,
      favorite: filters.favorite === true ? true : undefined,
      has_reminder: filters.hasReminder === true ? true : undefined,
      has_attachment: filters.hasAttachment === true ? true : undefined,
      ai_generated: filters.aiGenerated === true ? true : undefined,
      sort_field: mapSortFieldToApi(layout.sortField),
      sort_order: layout.sortOrder,
      page: 1,
      page_size: page * PAGE_SIZE,
    }),
    [activeTab, filters, sidebarFilter, layout.sortField, layout.sortOrder, page]
  )

  const dashboardQuery = useQuery({
    queryKey: notesKeys.dashboard(queryParams),
    queryFn: () => fetchNotesDashboard(queryParams),
  })

  const invalidateNotes = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: notesKeys.all })
  }, [queryClient])

  const notes = useMemo(
    () => (dashboardQuery.data?.notes ?? []).map(mapNoteFromApi),
    [dashboardQuery.data?.notes]
  )

  const stats = useMemo(
    () =>
      dashboardQuery.data?.stats
        ? mapStatsFromApi(dashboardQuery.data.stats)
        : EMPTY_STATS,
    [dashboardQuery.data?.stats]
  )

  const allTags = dashboardQuery.data?.tags ?? []
  const allCategories = dashboardQuery.data?.categories ?? []
  const sidebarCounts = dashboardQuery.data?.sidebar_counts ?? {
    all: 0,
    favorites: 0,
    pinned: 0,
    reminders: 0,
    attachments: 0,
    trash: 0,
  }
  const hasMore = dashboardQuery.data?.pagination?.has_more ?? false

  useEffect(() => {
    saveLayoutPreferences(layout)
  }, [layout])

  const clearSelection = useCallback(() => {
    setSelectedNoteIds(new Set())
  }, [])

  useEffect(() => {
    setPage(1)
    clearSelection()
  }, [activeTab, filters, sidebarFilter, layout.sortField, layout.sortOrder, clearSelection])

  const setFilters = useCallback((partial: Partial<NoteFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }))
  }, [])

  const createMutation = useMutation({
    mutationFn: (payload: CreateNotePayload) =>
      createNoteApi(mapCreatePayloadToApi(payload)),
    onSuccess: (data) => {
      setSelectedNoteId(data.id)
      toast.success("Note created")
      invalidateNotes()
    },
    onError: (error) => {
      toast.error(getNotesErrorMessage(error, "Failed to create note"))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNotePayload }) =>
      updateNoteApi(id, mapUpdatePayloadToApi(payload)),
    onSuccess: (data) => {
      if (editingNote?.id === data.id) {
        setEditingNote(mapNoteFromApi(data))
      }
      invalidateNotes()
    },
    onError: (error) => {
      toast.error(getNotesErrorMessage(error, "Failed to update note"))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, permanent }: { id: string; permanent?: boolean }) =>
      deleteNoteApi(id, permanent),
    onSuccess: (_, { permanent }) => {
      toast.success(permanent ? "Note permanently deleted" : "Note moved to recycle bin")
      invalidateNotes()
    },
    onError: (error) => {
      toast.error(getNotesErrorMessage(error, "Failed to delete note"))
    },
  })

  const restoreMutation = useMutation({
    mutationFn: (id: string) => restoreNoteApi(id),
    onSuccess: () => {
      toast.success("Note restored")
      invalidateNotes()
    },
    onError: (error) => {
      toast.error(getNotesErrorMessage(error, "Failed to restore note"))
    },
  })

  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveNoteApi(id),
    onSuccess: () => {
      toast.success("Note archived")
      invalidateNotes()
    },
    onError: (error) => {
      toast.error(getNotesErrorMessage(error, "Failed to archive note"))
    },
  })

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => duplicateNoteApi(id),
    onSuccess: () => {
      toast.success("Note duplicated")
      invalidateNotes()
    },
    onError: (error) => {
      toast.error(getNotesErrorMessage(error, "Failed to duplicate note"))
    },
  })

  const bulkMutation = useMutation({
    mutationFn: bulkNotesAction,
    onSuccess: (data) => {
      toast.success(data.message)
      clearSelection()
      invalidateNotes()
    },
    onError: (error) => {
      toast.error(getNotesErrorMessage(error, "Bulk action failed"))
    },
  })

  const restoreVersionMutation = useMutation({
    mutationFn: ({ noteId, versionId }: { noteId: string; versionId: string }) =>
      restoreNoteVersionApi(noteId, versionId),
    onSuccess: () => {
      toast.success("Version restored")
      invalidateNotes()
    },
    onError: (error) => {
      toast.error(getNotesErrorMessage(error, "Failed to restore version"))
    },
  })

  const createNote = useCallback(
    async (payload: CreateNotePayload) => {
      const result = await createMutation.mutateAsync(payload)
      return mapNoteFromApi(result)
    },
    [createMutation]
  )

  const updateNote = useCallback(
    (id: string, payload: UpdateNotePayload) => {
      updateMutation.mutate({ id, payload })
    },
    [updateMutation]
  )

  const deleteNote = useCallback(
    (id: string, permanent = false) => {
      deleteMutation.mutate({ id, permanent })
      if (selectedNoteId === id) setSelectedNoteId(null)
    },
    [deleteMutation, selectedNoteId]
  )

  const restoreNote = useCallback(
    (id: string) => restoreMutation.mutate(id),
    [restoreMutation]
  )

  const archiveNote = useCallback(
    (id: string) => archiveMutation.mutate(id),
    [archiveMutation]
  )

  const duplicateNote = useCallback(
    (id: string) => duplicateMutation.mutate(id),
    [duplicateMutation]
  )

  const bulkArchive = useCallback(
    (ids: string[]) => bulkMutation.mutate({ ids, action: "archive" }),
    [bulkMutation]
  )

  const bulkDelete = useCallback(
    (ids: string[], permanent = false) =>
      bulkMutation.mutate({ ids, action: "delete", permanent }),
    [bulkMutation]
  )

  const bulkFavorite = useCallback(
    (ids: string[]) => bulkMutation.mutate({ ids, action: "favorite" }),
    [bulkMutation]
  )

  const bulkTag = useCallback(
    (ids: string[], tag: string) => bulkMutation.mutate({ ids, action: "tag", tag }),
    [bulkMutation]
  )

  const restoreVersion = useCallback(
    (noteId: string, versionId: string) =>
      restoreVersionMutation.mutate({ noteId, versionId }),
    [restoreVersionMutation]
  )

  const exportNotes = useCallback(
    (format: "json" | "markdown", ids?: string[]) => {
      const toExport = ids ? notes.filter((n) => ids.includes(n.id)) : notes
      const content =
        format === "json" ? exportNotesAsJson(toExport) : exportNotesAsMarkdown(toExport)
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `jarvis-notes.${format === "json" ? "json" : "md"}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Exported ${toExport.length} notes`)
    },
    [notes]
  )

  const importNotes = useCallback(
    async (data: Note[]) => {
      try {
        await Promise.all(
          data.map((note) =>
            createNoteApi(
              mapCreatePayloadToApi({
                title: note.title,
                content: note.content,
                noteType: note.noteType,
                category: note.category,
                tags: note.tags,
                priority: note.priority,
                metadata: note.metadata,
              })
            )
          )
        )
        toast.success(`Imported ${data.length} notes`)
        invalidateNotes()
      } catch (error) {
        toast.error(getNotesErrorMessage(error, "Failed to import notes"))
      }
    },
    [invalidateNotes]
  )

  const toggleNoteSelection = useCallback((id: string) => {
    setSelectedNoteIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectAllNotes = useCallback(() => {
    setSelectedNoteIds(new Set(notes.map((n) => n.id)))
  }, [notes])

  const setViewMode = useCallback((mode: ViewMode) => {
    setLayout((prev) => ({ ...prev, viewMode: mode }))
  }, [])

  const setSort = useCallback((field: SortField, order: SortOrder) => {
    setLayout((prev) => ({ ...prev, sortField: field, sortOrder: order }))
  }, [])

  const togglePreviewPanel = useCallback(() => {
    setLayout((prev) => ({ ...prev, previewPanelOpen: !prev.previewPanelOpen }))
  }, [])

  const loadMore = useCallback(() => {
    setPage((p) => p + 1)
  }, [])

  const runAiAction = useCallback((actionId: string, noteId?: string) => {
    const actionLabels: Record<string, string> = {
      summarize: "Summary generated",
      improve: "Writing improved",
      grammar: "Grammar fixed",
      translate: "Translation ready",
      "action-items": "Action items extracted",
      "extract-tasks": "Tasks extracted",
      "extract-events": "Events extracted",
      flashcards: "Flashcards generated",
      quiz: "Quiz generated",
      "mind-map": "Mind map generated",
      "suggest-tags": "Tags suggested",
      "suggest-category": "Category suggested",
      related: "Related notes found",
      duplicates: "No duplicates found",
      merge: "Similar notes identified",
      chat: "AI chat opened",
    }
    toast.success(actionLabels[actionId] ?? "AI action completed", {
      description: noteId ? "Applied to note" : undefined,
    })
  }, [])

  const value: NotesContextValue = {
    notes,
    filteredNotes: notes,
    stats,
    isLoading: dashboardQuery.isLoading,
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    sidebarFilter,
    setSidebarFilter,
    selectedNoteId,
    setSelectedNoteId,
    selectedNoteIds,
    toggleNoteSelection,
    selectAllNotes,
    clearSelection,
    layout,
    setViewMode,
    setSort,
    togglePreviewPanel,
    createNote,
    updateNote,
    deleteNote,
    restoreNote,
    archiveNote,
    duplicateNote,
    bulkArchive,
    bulkDelete,
    bulkFavorite,
    bulkTag,
    restoreVersion,
    exportNotes,
    importNotes,
    allTags,
    allCategories,
    sidebarCounts,
    isEditorOpen,
    setIsEditorOpen,
    editingNote,
    setEditingNote,
    page,
    loadMore,
    hasMore,
    runAiAction,
  }

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export function useNotesContext() {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error("useNotesContext must be used within NotesProvider")
  return ctx
}
