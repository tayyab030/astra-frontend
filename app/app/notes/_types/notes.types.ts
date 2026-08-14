export type NoteTabId =
  | "all"
  | "quick-notes"
  | "knowledge"
  | "research"
  | "ideas"
  | "decision-journal"
  | "lessons-learned"
  | "meetings"
  | "daily-journal"
  | "vision"
  | "book-notes"
  | "archive"

export type NoteType = Exclude<NoteTabId, "all" | "archive">

export type NotePriority = "low" | "medium" | "high" | "urgent"
export type NoteStatus = "draft" | "active" | "completed" | "archived" | "deleted"
export type NoteVisibility = "private" | "shared" | "public"
export type ViewMode = "grid" | "list" | "table" | "compact" | "timeline" | "kanban"
export type SortField = "updatedAt" | "createdAt" | "title" | "priority"
export type SortOrder = "asc" | "desc"

export type IdeaStatus = "new" | "researching" | "planning" | "building" | "completed" | "rejected"
export type LinkedItemType =
  | "goal"
  | "task"
  | "habit"
  | "project"
  | "finance"
  | "expense"
  | "income"
  | "investment"
  | "business"
  | "document"
  | "calendar"
  | "contact"

export interface NoteVersion {
  id: string
  title: string
  content: string
  createdAt: string
}

export interface NoteActivity {
  id: string
  action: string
  timestamp: string
}

export interface NoteAttachment {
  id: string
  name: string
  type: string
  size: number
  url?: string
}

export interface LinkedItem {
  id: string
  type: LinkedItemType
  label: string
}

export interface NoteFilters {
  search: string
  category: string
  tag: string
  priority: NotePriority | "all"
  status: NoteStatus | "all"
  favorite: boolean | null
  archived: boolean | null
  hasReminder: boolean | null
  hasAttachment: boolean | null
  aiGenerated: boolean | null
  dateFrom?: string
  dateTo?: string
}

export interface Note {
  id: string
  title: string
  content: string
  noteType: NoteType
  category: string
  tags: string[]
  priority: NotePriority
  isFavorite: boolean
  isPinned: boolean
  color?: string
  status: NoteStatus
  attachments: NoteAttachment[]
  createdAt: string
  updatedAt: string
  reminder?: string
  linkedItems: LinkedItem[]
  visibility: NoteVisibility
  isLocked?: boolean
  isAiGenerated?: boolean
  metadata: Record<string, unknown>
  versions: NoteVersion[]
  activity: NoteActivity[]
}

export interface NotesStats {
  totalNotes: number
  notesThisWeek: number
  ideasCreated: number
  researchCompleted: number
  booksRead: number
  journalStreak: number
  decisionAccuracy: number
  topTags: { tag: string; count: number }[]
  categoryDistribution: { category: string; count: number }[]
}

export interface CreateNotePayload {
  title: string
  content: string
  noteType: NoteType
  category?: string
  tags?: string[]
  priority?: NotePriority
  isFavorite?: boolean
  color?: string
  status?: NoteStatus
  reminder?: string
  linkedItems?: LinkedItem[]
  visibility?: NoteVisibility
  metadata?: Record<string, unknown>
}

export interface UpdateNotePayload extends Partial<CreateNotePayload> {
  isPinned?: boolean
  attachments?: NoteAttachment[]
}

export interface NotesLayoutPreferences {
  sidebarCollapsed: boolean
  previewPanelOpen: boolean
  viewMode: ViewMode
  sortField: SortField
  sortOrder: SortOrder
}
