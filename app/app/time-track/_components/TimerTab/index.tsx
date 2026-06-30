"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { UseTimeTrackReturn } from "../../_hooks/useTimeTrack"
import { ActiveTimer } from "./ActiveTimer"
import { TodaySummary } from "./TodaySummary"
import { TodayTaskList } from "./TodayTaskList"
import { AddTaskDialog } from "./AddTaskDialog"

interface TimerTabProps {
  timeTrack: UseTimeTrackReturn
}

export function TimerTab({ timeTrack }: TimerTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { todayTotalSeconds, availableTasksToAdd, addTrackedTask, isSaving } = timeTrack

  return (
    <div className="space-y-4 pb-6">
      <ActiveTimer timeTrack={timeTrack} />
      <TodaySummary totalSeconds={todayTotalSeconds} />

      <div className="flex justify-end">
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 font-mono"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <TodayTaskList timeTrack={timeTrack} />

      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        availableTasks={availableTasksToAdd}
        onAddTask={addTrackedTask}
        isAdding={isSaving}
      />
    </div>
  )
}
