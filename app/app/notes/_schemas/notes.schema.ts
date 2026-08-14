import { z } from "zod"

export const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().default(""),
  noteType: z.enum([
    "quick-notes",
    "knowledge",
    "research",
    "ideas",
    "decision-journal",
    "lessons-learned",
    "meetings",
    "daily-journal",
    "vision",
    "book-notes",
  ]),
  category: z.string().default("Personal"),
  tags: z.string().default(""),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  isFavorite: z.boolean().default(false),
  color: z.string().optional(),
  status: z.enum(["draft", "active", "completed", "archived"]).default("active"),
  reminder: z.string().optional(),
  visibility: z.enum(["private", "shared", "public"]).default("private"),
  metadata: z.record(z.unknown()).default({}),
})

export type NoteFormValues = z.input<typeof noteSchema>

export const noteDefaultValues: NoteFormValues = {
  title: "",
  content: "",
  noteType: "quick-notes",
  category: "Personal",
  tags: "",
  priority: "medium",
  isFavorite: false,
  status: "active",
  visibility: "private",
  metadata: {},
}

export const quickNoteSchema = z.object({
  content: z.string().min(1, "Write something to save"),
})

export type QuickNoteFormValues = z.infer<typeof quickNoteSchema>
