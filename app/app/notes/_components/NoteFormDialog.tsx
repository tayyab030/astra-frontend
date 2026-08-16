"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DatePicker } from "@/components/ui/date-picker"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { cn } from "@/lib/utils"
import type { Note, NoteType } from "../_types/notes.types"
import {
  noteDefaultValues,
  noteSchema,
  type NoteFormValues,
} from "../_schemas/notes.schema"
import { FormFieldError } from "../../wealth/_components/FormFieldError"
import {
  inputClassName,
  primaryButtonClassName,
  NOTE_CATEGORIES,
  NOTE_PRIORITIES,
  NOTE_COLORS,
  NOTE_TYPE_OPTIONS,
  TYPE_SPECIFIC_FIELDS,
} from "./constants"
import dynamic from "next/dynamic"
import { Textarea } from "@/components/ui/textarea"

const RichTextEditor = dynamic(
  () => import("./RichTextEditor").then((m) => m.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[12rem] rounded-md border border-border bg-muted/20 animate-pulse" />
    ),
  }
)
function noteToFormValues(note: Note): NoteFormValues {
  return {
    title: note.title,
    content: note.content,
    noteType: note.noteType,
    category: note.category,
    tags: note.tags.join(", "),
    priority: note.priority,
    isFavorite: note.isFavorite,
    color: note.color,
    status: note.status === "deleted" || note.status === "archived" ? "active" : note.status,
    reminder: note.reminder,
    visibility: note.visibility,
    metadata: note.metadata,
  }
}

interface NoteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  note?: Note | null
  defaultType?: NoteType
  onSubmit: (values: NoteFormValues) => void
}

export function NoteFormDialog({
  open,
  onOpenChange,
  mode,
  note,
  defaultType = "quick-notes",
  onSubmit,
}: NoteFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { ...noteDefaultValues, noteType: defaultType },
  })

  const noteType = watch("noteType")
  const metadata = watch("metadata") ?? {}
  const typeFields = TYPE_SPECIFIC_FIELDS[noteType as NoteType] ?? []

  useEffect(() => {
    if (open) {
      reset(mode === "edit" && note ? noteToFormValues(note) : { ...noteDefaultValues, noteType: defaultType })
    }
  }, [open, mode, note, defaultType, reset])

  const handleMetadataChange = (key: string, value: string) => {
    setValue("metadata", { ...metadata, [key]: value })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[75vh] max-w-3xl flex-col gap-3 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 p-5 text-slate-100 sm:max-w-3xl">
        <DialogHeader className="shrink-0 pr-6">
          <DialogTitle className="font-poppins text-xl text-cyan-300">
            {mode === "add" ? "Create New Note" : "Edit Note"}
          </DialogTitle>
          <DialogDescription className="font-inter text-slate-300">
            Capture thoughts, knowledge, and ideas
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <form
            id="note-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 py-1"
          >
            <div className="space-y-2">
              <Label className="text-slate-200">Title</Label>
              <Input {...register("title")} placeholder="Note title..." className={inputClassName} />
              <FormFieldError message={errors.title?.message} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="min-w-0 space-y-2">
                <Label className="text-slate-200">Type</Label>
                <Select value={noteType} onValueChange={(v) => setValue("noteType", v as NoteType)}>
                  <SelectTrigger className={cn(inputClassName, "w-full")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {NOTE_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-0 space-y-2">
                <Label className="text-slate-200">Category</Label>
                <Select value={watch("category")} onValueChange={(v) => setValue("category", v)}>
                  <SelectTrigger className={cn(inputClassName, "w-full")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {NOTE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-0 space-y-2">
                <Label className="text-slate-200">Priority</Label>
                <Select value={watch("priority")} onValueChange={(v) => setValue("priority", v as NoteFormValues["priority"])}>
                  <SelectTrigger className={cn(inputClassName, "w-full")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {NOTE_PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="min-w-0 space-y-2">
                <Label className="text-slate-200">Tags (comma separated)</Label>
                <Input {...register("tags")} placeholder="tag1, tag2" className={inputClassName} />
              </div>
              <div className="min-w-0 space-y-2">
                <Label className="text-slate-200">Color</Label>
                <Select value={watch("color") ?? ""} onValueChange={(v) => setValue("color", v)}>
                  <SelectTrigger className={cn(inputClassName, "w-full")}>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {NOTE_COLORS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {typeFields.length > 0 && (
              <div className="space-y-2 p-4 rounded-lg bg-slate-900/30 border border-slate-600/50">
                <Label className="text-cyan-300 font-mono text-sm">Type-Specific Fields</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {typeFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label className="text-slate-400 text-xs">{field.label}</Label>
                      {field.type === "date" ? (
                        <DatePicker
                          value={(metadata[field.key] as string) ?? ""}
                          onChange={(date) => handleMetadataChange(field.key, date ?? "")}
                          placeholder="Pick a date"
                          buttonClassName={inputClassName}
                        />
                      ) : (
                        <Textarea
                          value={(metadata[field.key] as string) ?? ""}
                          onChange={(e) => handleMetadataChange(field.key, e.target.value)}
                          className={`${inputClassName} min-h-[60px]`}
                          rows={2}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-slate-200">Content</Label>
              <RichTextEditor
                value={watch("content") ?? ""}
                onChange={(v) => setValue("content", v)}
                minHeight="min-h-[15rem]"
                maxHeight="max-h-[15rem]"
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={watch("isFavorite")}
                  onCheckedChange={(v) => setValue("isFavorite", v)}
                />
                <Label className="text-slate-300 flex items-center gap-1">
                  <Star className="h-4 w-4" /> Favorite
                </Label>
              </div>
              <div className="min-w-[240px] flex-1 space-y-2">
                <Label className="text-slate-400 text-xs">Reminder</Label>
                <DateTimePicker
                  value={watch("reminder")}
                  onChange={(value) => setValue("reminder", value)}
                  placeholder="Pick date & time"
                  buttonClassName={inputClassName}
                />
              </div>
              <div className="min-w-[160px] space-y-2">
                <Label className="text-slate-400 text-xs">Visibility</Label>
                <Select value={watch("visibility")} onValueChange={(v) => setValue("visibility", v as NoteFormValues["visibility"])}>
                  <SelectTrigger className={cn(inputClassName, "w-full")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="private"><Lock className="inline h-3 w-3 mr-1" />Private</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-600/50 pt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-600 text-slate-300">
            Cancel
          </Button>
          <Button type="submit" form="note-form" className={primaryButtonClassName}>
            {mode === "add" ? "Create Note" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
