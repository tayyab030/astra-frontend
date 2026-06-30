export const TASK_SECTIONS = [
  { id: "todo", name: "To Do", status: "todo" },
  { id: "in-progress", name: "In Progress", status: "in_progress" },
  { id: "review", name: "Review", status: "review" },
  { id: "done", name: "Done", status: "done" },
] as const

export const TASK_STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
] as const

export type TaskStatusValue = (typeof TASK_STATUS_OPTIONS)[number]["value"]
