"use client"

import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SelectField from "@/components/common/SelectField"
import type { CreateTaskPayload, TaskItem } from "@/lib/api/tasks"
import { fetchGoalsDashboard } from "@/lib/api/goals"
import { useQuery } from "@tanstack/react-query"
import { useProjects } from "../_hooks/useProjects"
import { useTasks } from "../_hooks/useTasks"
import {
  taskDefaultValues,
  taskSchema,
  type TaskFormValues,
} from "../_schemas/task.schema"
import { TASK_STATUS_OPTIONS } from "./detail/constants"
import { cn } from "@/lib/utils"

const inputClassName = "bg-slate-800/50 border-slate-700 text-white"
const linkTypeOptions = [
  { value: "none", label: "Independent" },
  { value: "project", label: "Link to project" },
  { value: "goal", label: "Link to goal" },
]
const priorityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

function taskToFormValues(task: TaskItem): TaskFormValues {
  const status =
    task.completed || task.status === "done"
      ? "done"
      : (task.status as TaskFormValues["status"]) ?? "todo"

  return {
    title: task.title,
    description: task.description ?? "",
    due_date: task.due_date,
    priority: (task.priority as TaskFormValues["priority"]) ?? "medium",
    status,
    link_type: task.link_type,
    project_id: task.project_id ?? "",
    goal_id: task.goal_id ?? "",
  }
}

function buildTaskPayload(
  data: TaskFormValues,
  fixedGoalId?: string,
  fixedProjectId?: string,
): CreateTaskPayload {
  if (fixedGoalId) {
    return {
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      due_date: data.due_date,
      priority: data.priority,
      project_id: null,
      goal_id: fixedGoalId,
    }
  }

  if (fixedProjectId) {
    return {
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      due_date: data.due_date,
      priority: data.priority,
      project_id: fixedProjectId,
      goal_id: null,
    }
  }

  return {
    title: data.title.trim(),
    description: data.description?.trim() || undefined,
    due_date: data.due_date,
    priority: data.priority,
    project_id: data.link_type === "project" ? data.project_id || null : null,
    goal_id: data.link_type === "goal" ? data.goal_id || null : null,
  }
}

function getInitialFormValues(fixedGoalId?: string, fixedProjectId?: string): TaskFormValues {
  if (fixedGoalId) {
    return {
      ...taskDefaultValues,
      link_type: "goal",
      goal_id: fixedGoalId,
    }
  }

  if (fixedProjectId) {
    return {
      ...taskDefaultValues,
      link_type: "project",
      project_id: fixedProjectId,
    }
  }

  return taskDefaultValues
}

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  task?: TaskItem | null
  fixedGoalId?: string
  fixedProjectId?: string
}

export function TaskFormDialog({
  open,
  onOpenChange,
  mode,
  task,
  fixedGoalId,
  fixedProjectId,
}: TaskFormDialogProps) {
  const { projects } = useProjects()
  const { createTask, updateTask, isCreatingTask, isUpdatingTask } = useTasks("all")

  const now = useMemo(() => new Date(), [])
  const goalsQuery = useQuery({
    queryKey: ["goals", "task-form", now.getFullYear(), now.getMonth() + 1],
    queryFn: () =>
      fetchGoalsDashboard({
        mode: "month",
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      }),
    enabled: open && !fixedGoalId && !fixedProjectId,
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: taskDefaultValues,
  })

  const linkType = watch("link_type")

  useEffect(() => {
    if (!open) return

    if (mode === "edit" && task) {
      reset(
        fixedGoalId
          ? { ...taskToFormValues(task), link_type: "goal", goal_id: fixedGoalId }
          : fixedProjectId
            ? { ...taskToFormValues(task), link_type: "project", project_id: fixedProjectId }
            : taskToFormValues(task),
      )
      return
    }

    reset(getInitialFormValues(fixedGoalId, fixedProjectId))
  }, [open, mode, task, reset, fixedGoalId, fixedProjectId])

  useEffect(() => {
    if (fixedGoalId || fixedProjectId) return

    if (linkType === "none") {
      setValue("project_id", "")
      setValue("goal_id", "")
    } else if (linkType === "project") {
      setValue("goal_id", "")
    } else if (linkType === "goal") {
      setValue("project_id", "")
    }
  }, [linkType, setValue, fixedGoalId, fixedProjectId])

  const handleClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
    if (!nextOpen) reset(getInitialFormValues(fixedGoalId, fixedProjectId))
  }

  const submit = handleSubmit(async (data) => {
    const payload = buildTaskPayload(data, fixedGoalId, fixedProjectId)

    if (mode === "edit" && task) {
      await updateTask({
        id: task.id,
        data: {
          ...payload,
          status: data.status ?? "todo",
          completed: data.status === "done",
        },
      })
    } else {
      await createTask(payload)
    }

    handleClose(false)
  })

  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: project.title,
  }))

  const goalOptions = (goalsQuery.data?.goals ?? []).map((goal) => ({
    value: goal.id,
    label: goal.title,
  }))

  const saving = isCreatingTask || isUpdatingTask

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-white">
            {mode === "edit" ? "Edit Task" : "Create Task"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {fixedGoalId
              ? "This task will be linked to the current goal."
              : fixedProjectId
                ? "This task will be linked to the current project."
                : "Link to a project or goal, or keep it independent — not both."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-slate-200">Title</Label>
            <Input
              placeholder="What needs to be done?"
              className={cn(inputClassName, errors.title && "border-red-500/70")}
              {...register("title")}
            />
            {errors.title ? (
              <p className="text-sm text-red-400">{errors.title.message}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 min-w-0">
              <Label className="text-slate-200">Priority</Label>
              <SelectField
                value={watch("priority")}
                onValueChange={(value: TaskFormValues["priority"]) =>
                  setValue("priority", value, { shouldValidate: true })
                }
                options={priorityOptions}
                placeholder="Select priority"
                triggerClassName="!w-full"
              />
            </div>
            <div className="space-y-2 min-w-0">
              <Label className="text-slate-200">Due Date</Label>
              <DatePicker
                value={watch("due_date") || undefined}
                onChange={(value) =>
                  setValue("due_date", value ?? null, { shouldValidate: true })
                }
                placeholder="Pick due date"
                className="space-y-0"
                buttonClassName={cn(inputClassName, "!w-full")}
              />
            </div>
          </div>

          {mode === "edit" ? (
            <div className="space-y-2">
              <Label className="text-slate-200">Status</Label>
              <SelectField
                value={watch("status") ?? "todo"}
                onValueChange={(value: NonNullable<TaskFormValues["status"]>) =>
                  setValue("status", value, { shouldValidate: true })
                }
                options={[...TASK_STATUS_OPTIONS]}
                placeholder="Select status"
                triggerClassName="!w-full"
              />
            </div>
          ) : null}

          {!fixedGoalId && !fixedProjectId ? (
            <>
              <div className="space-y-2">
                <Label className="text-slate-200">Link</Label>
                <SelectField
                  value={linkType}
                  onValueChange={(value: TaskFormValues["link_type"]) =>
                    setValue("link_type", value, { shouldValidate: true })
                  }
                  options={linkTypeOptions}
                  placeholder="How is this task linked?"
                  triggerClassName="!w-full"
                />
              </div>

              {linkType === "project" ? (
                <div className="space-y-2">
                  <Label className="text-slate-200">Project</Label>
                  <SelectField
                    value={watch("project_id")}
                    onValueChange={(value) =>
                      setValue("project_id", value, { shouldValidate: true })
                    }
                    options={projectOptions}
                    placeholder={projectOptions.length ? "Select project" : "No projects yet"}
                    triggerClassName="!w-full"
                  />
                  {errors.project_id ? (
                    <p className="text-sm text-red-400">{errors.project_id.message}</p>
                  ) : null}
                </div>
              ) : null}

              {linkType === "goal" ? (
                <div className="space-y-2">
                  <Label className="text-slate-200">Goal</Label>
                  <SelectField
                    value={watch("goal_id")}
                    onValueChange={(value) =>
                      setValue("goal_id", value, { shouldValidate: true })
                    }
                    options={goalOptions}
                    placeholder={goalOptions.length ? "Select goal" : "No goals this month"}
                    triggerClassName="!w-full"
                  />
                  {errors.goal_id ? (
                    <p className="text-sm text-red-400">{errors.goal_id.message}</p>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}

          <div className="space-y-2">
            <Label className="text-slate-200">Description</Label>
            <Textarea
              placeholder="Add details (optional)"
              className={inputClassName}
              {...register("description")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {mode === "edit" ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
