"use client"

import { useEffect, useMemo, useState } from "react"
import { Moon, Pencil, Plus, Sun, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { TimePicker } from "@/components/ui/time-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { useHealthContext } from "../../_context/HealthProvider"
import type { SleepSession } from "../../_types/health.types"

function formatLocalClock(iso: string) {
  const date = new Date(iso)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
}

function formatElapsed(ms: number) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours <= 0) return `${minutes}m`
  return `${hours}h ${minutes}m`
}

export function SleepScheduleCard() {
  const {
    today,
    sleepSessions,
    toggleSleep,
    createSleepSession,
    updateSleepSession,
    deleteSleepSession,
    isSaving,
    pendingSleepSyncCount,
  } = useHealthContext()

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<SleepSession | null>(null)
  const [startTime, setStartTime] = useState("23:00")
  const [endTime, setEndTime] = useState("07:00")

  const activeSession = useMemo(
    () => sleepSessions.find((session) => session.isActive) ?? null,
    [sleepSessions]
  )
  const completedSessions = useMemo(
    () => sleepSessions.filter((session) => !session.isActive),
    [sleepSessions]
  )

  useEffect(() => {
    if (!activeSession) return
    const id = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(id)
  }, [activeSession])

  const elapsedLabel = activeSession
    ? formatElapsed(now - new Date(activeSession.startedAt).getTime())
    : null

  const openCreate = () => {
    setEditingSession(null)
    setStartTime("23:00")
    setEndTime("07:00")
    setDialogOpen(true)
  }

  const openEdit = (session: SleepSession) => {
    setEditingSession(session)
    setStartTime(formatLocalClock(session.startedAt))
    setEndTime(session.endedAt ? formatLocalClock(session.endedAt) : "07:00")
    setDialogOpen(true)
  }

  const handleSaveManual = async () => {
    if (!startTime || !endTime || startTime === endTime) return
    if (editingSession) {
      await updateSleepSession(editingSession.id, { startTime, endTime })
    } else {
      await createSleepSession(startTime, endTime)
    }
    setDialogOpen(false)
    setEditingSession(null)
  }

  const handleToggle = async () => {
    await toggleSleep()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteSleepSession(deleteId)
    setDeleteId(null)
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-sm font-mono text-cyan-300 flex items-center">
              <Moon className="mr-2 h-4 w-4" />
              Sleep
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-600 text-slate-200 font-mono hover:bg-slate-700/50"
              onClick={openCreate}
              disabled={isSaving}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add sleep
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className={
              activeSession
                ? "w-full h-14 text-base font-mono bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                : "w-full h-14 text-base font-mono bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white border-0"
            }
            onClick={handleToggle}
            disabled={isSaving}
          >
            {activeSession ? (
              <>
                <Sun className="mr-2 h-5 w-5" />
                I&apos;m awake
              </>
            ) : (
              <>
                <Moon className="mr-2 h-5 w-5" />
                Goodnight
              </>
            )}
          </Button>

          {pendingSleepSyncCount > 0 ? (
            <p className="text-xs text-amber-400/90 font-mono text-center">
              {pendingSleepSyncCount} tap{pendingSleepSyncCount === 1 ? "" : "s"} waiting to sync
            </p>
          ) : null}

          {activeSession ? (
            <div className="space-y-2">
              <p className="text-sm text-amber-300/90 font-mono text-center">
                Sleeping since {formatLocalClock(activeSession.startedAt)} · {elapsedLabel} so far
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="w-full font-mono text-slate-400 hover:text-red-300"
                onClick={() => setDeleteId(activeSession.id)}
                disabled={isSaving}
              >
                Cancel sleep
              </Button>
            </div>
          ) : (
            <p className="text-sm text-slate-400 font-mono text-center">
              Tap Goodnight when you go to bed, or add a sleep section manually.
            </p>
          )}

          {completedSessions.length > 0 ? (
            <div className="space-y-2 pt-1">
              {completedSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-slate-200">
                      {formatLocalClock(session.startedAt)} →{" "}
                      {session.endedAt ? formatLocalClock(session.endedAt) : "—"}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-1">{session.hours ?? 0}h</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!session.id.startsWith("local-") ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-400 hover:text-cyan-300 hover:bg-slate-700/50"
                        onClick={() => openEdit(session)}
                        aria-label="Edit sleep session"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    ) : null}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-slate-700/50"
                      onClick={() => setDeleteId(session.id)}
                      aria-label="Delete sleep session"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <p className="text-xs text-slate-400 font-mono">
            Total today: {today.sleepHours}h
            {completedSessions.length > 0
              ? ` from ${completedSessions.length} session${completedSessions.length === 1 ? "" : "s"}`
              : ""}
          </p>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingSession(null)
        }}
      >
        <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-cyan-300 font-mono">
              {editingSession ? "Edit sleep section" : "Add sleep section"}
            </DialogTitle>
            <DialogDescription className="text-slate-300 font-mono">
              Overnight sleep is fine — end time can be after midnight.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-400 font-mono">Fell asleep</Label>
              <TimePicker
                value={startTime}
                onChange={(value) => value && setStartTime(value)}
                buttonClassName="bg-slate-900/50 border-slate-600/50 text-white font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-400 font-mono">Woke up</Label>
              <TimePicker
                value={endTime}
                onChange={(value) => value && setEndTime(value)}
                buttonClassName="bg-slate-900/50 border-slate-600/50 text-white font-mono"
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 font-mono"
              onClick={handleSaveManual}
              disabled={!startTime || !endTime || startTime === endTime || isSaving}
            >
              {editingSession ? "Save changes" : "Add section"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-red-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-slate-200">Delete sleep session?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-slate-400">
              This session will be removed and total sleep hours will recalculate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 font-mono"
              onClick={handleDelete}
              disabled={isSaving}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
