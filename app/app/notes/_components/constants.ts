import {
  Archive,
  BookMarked,
  BookOpen,
  Brain,
  Calendar,
  FileText,
  Gavel,
  GraduationCap,
  Lightbulb,
  Microscope,
  PenLine,
  Sparkles,
  Target,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react"
import type { NotePriority, NoteTabId, NoteType } from "../_types/notes.types"

export const NOTES_LAYOUT_KEY = "jarvis_notes_layout_v1"

export const primaryButtonClassName =
  "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border border-cyan-400/20 font-mono shadow-lg shadow-cyan-500/25"

export const inputClassName =
  "font-mono bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"

export const cardClassName =
  "bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm shadow-lg"

export interface NotesTabConfig {
  id: NoteTabId
  label: string
  icon: LucideIcon
  description?: string
}

export const NOTES_TABS: NotesTabConfig[] = [
  { id: "all", label: "All Notes", icon: FileText },
  { id: "quick-notes", label: "Quick Notes", icon: Zap },
  { id: "knowledge", label: "Knowledge", icon: Brain },
  { id: "research", label: "Research", icon: Microscope },
  { id: "ideas", label: "Ideas", icon: Lightbulb },
  { id: "decision-journal", label: "Decision Journal", icon: Gavel },
  { id: "lessons-learned", label: "Lessons Learned", icon: GraduationCap },
  { id: "meetings", label: "Meetings", icon: Users },
  { id: "daily-journal", label: "Daily Journal", icon: PenLine },
  { id: "vision", label: "Vision", icon: Target },
  { id: "book-notes", label: "Book Notes", icon: BookOpen },
  { id: "archive", label: "Archive", icon: Archive },
]

export const NOTE_TYPE_OPTIONS: { value: NoteType; label: string }[] = [
  { value: "quick-notes", label: "Quick Note" },
  { value: "knowledge", label: "Knowledge" },
  { value: "research", label: "Research" },
  { value: "ideas", label: "Idea" },
  { value: "decision-journal", label: "Decision Journal" },
  { value: "lessons-learned", label: "Lessons Learned" },
  { value: "meetings", label: "Meeting" },
  { value: "daily-journal", label: "Daily Journal" },
  { value: "vision", label: "Vision" },
  { value: "book-notes", label: "Book Notes" },
]

export const NOTE_CATEGORIES = [
  "Personal",
  "Work",
  "Learning",
  "Health",
  "Finance",
  "Projects",
  "Relationships",
  "Creative",
  "Travel",
  "Other",
]

export const NOTE_PRIORITIES: { value: NotePriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-slate-400" },
  { value: "medium", label: "Medium", color: "text-blue-400" },
  { value: "high", label: "High", color: "text-orange-400" },
  { value: "urgent", label: "Urgent", color: "text-red-400" },
]

export const NOTE_COLORS = [
  { value: "cyan", label: "Cyan", class: "border-cyan-500/50" },
  { value: "blue", label: "Blue", class: "border-blue-500/50" },
  { value: "purple", label: "Purple", class: "border-purple-500/50" },
  { value: "green", label: "Green", class: "border-green-500/50" },
  { value: "yellow", label: "Yellow", class: "border-yellow-500/50" },
  { value: "red", label: "Red", class: "border-red-500/50" },
  { value: "pink", label: "Pink", class: "border-pink-500/50" },
  { value: "slate", label: "Slate", class: "border-slate-500/50" },
]

export const IDEA_STATUSES = [
  "new",
  "researching",
  "planning",
  "building",
  "completed",
  "rejected",
] as const

export const VISION_TYPES = [
  "Life Vision",
  "Career Vision",
  "Financial Vision",
  "Business Vision",
  "Family Vision",
  "Travel Vision",
  "Bucket List",
]

export const AI_ACTIONS = [
  { id: "summarize", label: "Summarize", icon: Sparkles },
  { id: "improve", label: "Improve Writing", icon: PenLine },
  { id: "grammar", label: "Fix Grammar", icon: FileText },
  { id: "translate", label: "Translate", icon: BookMarked },
  { id: "action-items", label: "Generate Action Items", icon: Target },
  { id: "extract-tasks", label: "Extract Tasks", icon: Zap },
  { id: "extract-events", label: "Extract Events", icon: Calendar },
  { id: "flashcards", label: "Generate Flashcards", icon: Brain },
  { id: "quiz", label: "Generate Quiz", icon: GraduationCap },
  { id: "mind-map", label: "Generate Mind Map", icon: Lightbulb },
  { id: "suggest-tags", label: "Suggest Tags", icon: FileText },
  { id: "suggest-category", label: "Suggest Category", icon: FileText },
  { id: "related", label: "Suggest Related Notes", icon: BookOpen },
  { id: "duplicates", label: "Find Duplicates", icon: FileText },
  { id: "merge", label: "Merge Similar", icon: FileText },
  { id: "chat", label: "Chat With Note", icon: Sparkles },
] as const

export const SIDEBAR_FILTERS = [
  { id: "all", label: "All Notes" },
  { id: "favorites", label: "Favorites" },
  { id: "pinned", label: "Pinned" },
  { id: "reminders", label: "Has Reminder" },
  { id: "attachments", label: "Has Attachments" },
  { id: "trash", label: "Recycle Bin" },
] as const

export type SidebarFilterId = (typeof SIDEBAR_FILTERS)[number]["id"]

export const TAB_TO_NOTE_TYPE: Partial<Record<NoteTabId, NoteType>> = {
  "quick-notes": "quick-notes",
  knowledge: "knowledge",
  research: "research",
  ideas: "ideas",
  "decision-journal": "decision-journal",
  "lessons-learned": "lessons-learned",
  meetings: "meetings",
  "daily-journal": "daily-journal",
  vision: "vision",
  "book-notes": "book-notes",
}

export const TYPE_SPECIFIC_FIELDS: Record<NoteType, { key: string; label: string; type?: string }[]> = {
  "quick-notes": [],
  knowledge: [
    { key: "summary", label: "Summary" },
    { key: "keyPoints", label: "Key Points" },
    { key: "resources", label: "Resources" },
    { key: "difficulty", label: "Difficulty" },
  ],
  research: [
    { key: "researchTopic", label: "Research Topic" },
    { key: "sources", label: "Sources" },
    { key: "summary", label: "Summary" },
    { key: "findings", label: "Findings" },
    { key: "personalOpinion", label: "Personal Opinion" },
    { key: "conclusion", label: "Conclusion" },
    { key: "nextActions", label: "Next Actions" },
  ],
  ideas: [
    { key: "ideaStatus", label: "Status" },
    { key: "estimatedValue", label: "Estimated Value" },
  ],
  "decision-journal": [
    { key: "decision", label: "Decision" },
    { key: "decisionDate", label: "Date", type: "date" },
    { key: "reason", label: "Reason" },
    { key: "alternatives", label: "Alternatives" },
    { key: "pros", label: "Pros" },
    { key: "cons", label: "Cons" },
    { key: "risks", label: "Risks" },
    { key: "expectedOutcome", label: "Expected Outcome" },
    { key: "confidenceLevel", label: "Confidence Level" },
    { key: "reviewDate", label: "Review Date", type: "date" },
    { key: "actualResult", label: "Actual Result" },
    { key: "lessonsLearned", label: "Lessons Learned" },
  ],
  "lessons-learned": [
    { key: "project", label: "Project" },
    { key: "situation", label: "Situation" },
    { key: "whatWentWell", label: "What Went Well" },
    { key: "whatWentWrong", label: "What Went Wrong" },
    { key: "rootCause", label: "Root Cause" },
    { key: "lesson", label: "Lesson" },
    { key: "futureImprovement", label: "Future Improvement" },
  ],
  meetings: [
    { key: "meetingTitle", label: "Meeting Title" },
    { key: "participants", label: "Participants" },
    { key: "agenda", label: "Agenda" },
    { key: "discussion", label: "Discussion" },
    { key: "decisions", label: "Decisions" },
    { key: "actionItems", label: "Action Items" },
    { key: "deadlines", label: "Deadlines" },
  ],
  "daily-journal": [
    { key: "mood", label: "Mood" },
    { key: "energy", label: "Energy" },
    { key: "wins", label: "Wins" },
    { key: "challenges", label: "Challenges" },
    { key: "lessons", label: "Lessons" },
    { key: "gratitude", label: "Gratitude" },
    { key: "tomorrowPriorities", label: "Tomorrow Priorities" },
    { key: "reflection", label: "Reflection" },
  ],
  vision: [
    { key: "visionType", label: "Vision Type" },
    { key: "timeHorizon", label: "Time Horizon" },
    { key: "aspirations", label: "Aspirations" },
  ],
  "book-notes": [
    { key: "book", label: "Book" },
    { key: "author", label: "Author" },
    { key: "summary", label: "Summary" },
    { key: "importantQuotes", label: "Important Quotes" },
    { key: "keyLessons", label: "Key Lessons" },
    { key: "actionItems", label: "Action Items" },
    { key: "rating", label: "Rating" },
  ],
}
