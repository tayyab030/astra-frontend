"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Calendar, CheckCircle, Edit, EllipsisVertical, Flame, Trash2 } from "lucide-react"
import type { Goal, UpdateMilestonePayload } from "@/lib/api/goals"
import { CATEGORY_COLORS, CATEGORY_ICONS } from "./constants"

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => Promise<unknown>
  onUpdateMilestone: (payload: {
    goalId: string
    milestoneId: string
    data: UpdateMilestonePayload
  }) => Promise<unknown>
  isDeleting?: boolean
  isUpdatingMilestone?: boolean
}

function formatGoalDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  onUpdateMilestone,
  isDeleting,
  isUpdatingMilestone,
}: GoalCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const CategoryIcon = CATEGORY_ICONS[goal.category]
  const completedMilestones = goal.milestones.filter((milestone) => milestone.completed).length
  const totalMilestones = goal.milestones.length
  const priorityLabel = goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)

  const handleDelete = async () => {
    await onDelete(goal.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`bg-gradient-to-r ${CATEGORY_COLORS[goal.category]} text-white border-0`}>
                  <CategoryIcon className="mr-1 h-3 w-3" />
                  {goal.category_label}
                </Badge>
                <Badge
                  variant={
                    goal.priority === "high"
                      ? "destructive"
                      : goal.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                  className={
                    goal.priority === "high"
                      ? "bg-red-500/20 text-red-300 border-red-500/30"
                      : goal.priority === "medium"
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                        : "bg-slate-500/20 text-slate-300 border-slate-500/30"
                  }
                >
                  {priorityLabel}
                </Badge>
              </div>
              <CardTitle className="font-poppins text-lg text-cyan-300">{goal.title}</CardTitle>
              {goal.motivation ? (
                <CardDescription className="font-inter text-sm text-slate-300">{goal.motivation}</CardDescription>
              ) : null}
            </div>
            <div className="flex items-start gap-2 shrink-0">
              <div className="text-right space-y-1">
                <div className="text-2xl font-bold font-poppins text-cyan-400">{goal.progress}%</div>
                <div className="text-xs text-slate-400">Complete</div>
              </div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                >
                  <EllipsisVertical className="h-4 w-4" />
                  <span className="sr-only">Open goal menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="z-[100] bg-slate-800 border-slate-600/50 text-slate-200"
                >
                  <DropdownMenuItem
                    className="font-mono cursor-pointer focus:bg-slate-700 focus:text-slate-100"
                    onSelect={() => onEdit(goal)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="font-mono cursor-pointer focus:bg-red-500/10 focus:text-red-400"
                    onSelect={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={goal.progress} className="h-3" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center text-slate-400">
                <Calendar className="mr-1 h-3 w-3" />
                Target Date
              </div>
              <div className="font-medium text-slate-200">{formatGoalDate(goal.target_date)}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-slate-400">
                <CheckCircle className="mr-1 h-3 w-3" />
                Milestones
              </div>
              <div className="font-medium text-slate-200">
                {totalMilestones > 0 ? `${completedMilestones}/${totalMilestones}` : "—"}
              </div>
            </div>
          </div>

          {goal.milestones.length > 0 ? (
            <div className="space-y-2 pt-2 border-t border-slate-600/50">
              {goal.milestones.map((milestone) => (
                <label
                  key={milestone.id}
                  className="flex items-start gap-3 rounded-lg border border-slate-600/30 bg-slate-900/20 p-3 cursor-pointer"
                >
                  <Checkbox
                    checked={milestone.completed}
                    disabled={isUpdatingMilestone}
                    onCheckedChange={(checked) =>
                      onUpdateMilestone({
                        goalId: goal.id,
                        milestoneId: milestone.id,
                        data: { completed: checked === true },
                      })
                    }
                    className="mt-0.5"
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium ${milestone.completed ? "text-slate-400 line-through" : "text-slate-200"}`}
                    >
                      {milestone.title}
                    </p>
                    <p className="text-xs text-slate-500">{formatGoalDate(milestone.due_date)}</p>
                  </div>
                </label>
              ))}
            </div>
          ) : null}

          <div className="flex items-center justify-between pt-2 border-t border-slate-600/50">
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center">
                <Flame className="mr-1 h-3 w-3 text-orange-400" />
                {goal.streak} day streak
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-3 w-3 text-cyan-400" />
                {goal.linked_tasks} tasks
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-red-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-slate-200">Delete goal?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-slate-400">
              This will permanently delete &quot;{goal.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="font-mono bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
