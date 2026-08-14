import type { Note, NotesLayoutPreferences } from "../_types/notes.types"
import { NOTES_LAYOUT_KEY } from "../_components/constants"

export function loadLayoutPreferences(): NotesLayoutPreferences {
  const defaults: NotesLayoutPreferences = {
    sidebarCollapsed: false,
    previewPanelOpen: true,
    viewMode: "grid",
    sortField: "updatedAt",
    sortOrder: "desc",
  }
  if (typeof window === "undefined") return defaults
  try {
    const stored = localStorage.getItem(NOTES_LAYOUT_KEY)
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults
  } catch {
    return defaults
  }
}

export function saveLayoutPreferences(prefs: NotesLayoutPreferences) {
  if (typeof window === "undefined") return
  localStorage.setItem(NOTES_LAYOUT_KEY, JSON.stringify(prefs))
}

export function getWordCount(content: string): number {
  const plain = content
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*`>_\[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return plain ? plain.split(/\s+/).length : 0
}

export function exportNotesAsJson(notes: Note[]): string {
  return JSON.stringify(notes, null, 2)
}

export function exportNotesAsMarkdown(notes: Note[]): string {
  return notes
    .map(
      (n) =>
        `# ${n.title}\n\n**Category:** ${n.category} | **Type:** ${n.noteType} | **Tags:** ${n.tags.join(", ")}\n\n${n.content}\n\n---\n`
    )
    .join("\n")
}
