"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import type { TimeEntry } from "../../_types/timeTrack.types"
import { formatDisplayDate, formatDuration, formatTimeOfDay } from "../../_utils/formatTime"

interface TimeEntryTableProps {
  entries: TimeEntry[]
  onDelete: (entryId: string) => Promise<void>
  isDeleting?: boolean
}

export function TimeEntryTable({ entries, onDelete, isDeleting }: TimeEntryTableProps) {
  const [entryToDelete, setEntryToDelete] = useState<TimeEntry | null>(null)

  const handleConfirmDelete = async () => {
    if (!entryToDelete) return

    try {
      await onDelete(entryToDelete.id)
      setEntryToDelete(null)
    } catch {
      // Error toast is handled by the mutation
    }
  }

  if (entries.length === 0) {
    return (
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardContent className="py-12 text-center text-slate-400 font-mono text-sm">
          No time entries found for the selected filters
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400">
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Task</th>
                  <th className="text-left p-3 font-medium">Start</th>
                  <th className="text-left p-3 font-medium">End</th>
                  <th className="text-right p-3 font-medium">Duration</th>
                  <th className="w-12 p-3" />
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-3 text-slate-300">{formatDisplayDate(entry.date)}</td>
                    <td className="p-3 text-white">{entry.taskTitle}</td>
                    <td className="p-3 text-slate-400">{formatTimeOfDay(entry.startTime)}</td>
                    <td className="p-3 text-slate-400">{formatTimeOfDay(entry.endTime)}</td>
                    <td className="p-3 text-right text-cyan-300 tabular-nums">
                      {formatDuration(entry.durationSeconds)}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={isDeleting}
                        onClick={() => setEntryToDelete(entry)}
                        className="h-8 w-8 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={Boolean(entryToDelete)}
        onOpenChange={(open) => !open && setEntryToDelete(null)}
      >
        <AlertDialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-red-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-slate-200">
              Delete time record?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-slate-400">
              This will permanently remove the {entryToDelete && formatDuration(entryToDelete.durationSeconds)}{" "}
              session for &quot;{entryToDelete?.taskTitle}&quot; on{" "}
              {entryToDelete && formatDisplayDate(entryToDelete.date)}. It will be removed from
              Reports, Dashboard, Weekly, and today&apos;s totals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="font-mono bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
              onClick={() => void handleConfirmDelete()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
