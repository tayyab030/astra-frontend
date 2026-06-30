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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TrackedTask } from "../../_types/timeTrack.types"
import type { UseTimeTrackReturn } from "../../_hooks/useTimeTrack"
import { TodayTaskRow } from "./TodayTaskRow"

interface TodayTaskListProps {
  timeTrack: UseTimeTrackReturn
}

export function TodayTaskList({ timeTrack }: TodayTaskListProps) {
  const {
    trackedTasks,
    activeTimer,
    displayClockSeconds,
    startTimer,
    pauseTimer,
    removeTrackedTask,
  } = timeTrack

  const [taskToRemove, setTaskToRemove] = useState<TrackedTask | null>(null)

  const handleRemoveConfirm = () => {
    if (!taskToRemove) return
    removeTrackedTask(taskToRemove.taskId)
    setTaskToRemove(null)
  }

  return (
    <>
      <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-mono text-white">Today&apos;s Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {trackedTasks.length === 0 ? (
            <p className="text-center text-slate-400 text-sm font-mono py-8">
              No tasks added yet. Click &quot;Add Task&quot; to start tracking.
            </p>
          ) : (
            trackedTasks.map((task) => (
              <TodayTaskRow
                key={task.taskId}
                task={task}
                activeTimer={activeTimer}
                elapsedSeconds={displayClockSeconds}
                onStart={startTimer}
                onPause={pauseTimer}
                onRemove={setTaskToRemove}
              />
            ))
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={Boolean(taskToRemove)}
        onOpenChange={(open) => !open && setTaskToRemove(null)}
      >
        <AlertDialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-red-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-slate-200">
              Remove task from today?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-slate-400">
              &quot;{taskToRemove?.title}&quot; will be removed from today&apos;s tracking list.
              Your logged time entries will be kept in Reports.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="font-mono bg-red-600 hover:bg-red-700"
              onClick={handleRemoveConfirm}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
