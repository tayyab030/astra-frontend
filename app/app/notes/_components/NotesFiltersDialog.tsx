"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useNotes } from "../_hooks/useNotes"
import { inputClassName, NOTE_PRIORITIES } from "./constants"

interface NotesFiltersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotesFiltersDialog({ open, onOpenChange }: NotesFiltersDialogProps) {
  const { filters, setFilters } = useNotes()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 text-slate-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cyan-300 font-poppins">Advanced Filters</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-slate-300">Priority</Label>
            <Select
              value={filters.priority}
              onValueChange={(v) => setFilters({ priority: v as typeof filters.priority })}
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All</SelectItem>
                {NOTE_PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(v) => setFilters({ status: v as typeof filters.status })}
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Favorites only</Label>
            <Switch
              checked={filters.favorite === true}
              onCheckedChange={(v) => setFilters({ favorite: v ? true : null })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Has reminder</Label>
            <Switch
              checked={filters.hasReminder === true}
              onCheckedChange={(v) => setFilters({ hasReminder: v ? true : null })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Has attachments</Label>
            <Switch
              checked={filters.hasAttachment === true}
              onCheckedChange={(v) => setFilters({ hasAttachment: v ? true : null })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">AI generated</Label>
            <Switch
              checked={filters.aiGenerated === true}
              onCheckedChange={(v) => setFilters({ aiGenerated: v ? true : null })}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
