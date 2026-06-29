import * as z from "zod"

const datePattern = /^\d{4}-\d{2}-\d{2}$/

const taskSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().optional(),
    due_date: z
      .union([z.string().regex(datePattern), z.literal(""), z.null()])
      .optional()
      .transform((value) => (value ? value : null)),
    priority: z.enum(["high", "medium", "low"]),
    link_type: z.enum(["none", "project", "goal"]),
    project_id: z.string().optional(),
    goal_id: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.link_type === "project" && !data.project_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a project",
        path: ["project_id"],
      })
    }

    if (data.link_type === "goal" && !data.goal_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a goal",
        path: ["goal_id"],
      })
    }

    if (data.link_type === "none" && (data.project_id || data.goal_id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Independent tasks cannot be linked",
        path: ["link_type"],
      })
    }
  })

const taskDefaultValues = {
  title: "",
  description: "",
  due_date: null as string | null,
  priority: "medium" as const,
  link_type: "none" as const,
  project_id: "",
  goal_id: "",
}

type TaskFormValues = z.infer<typeof taskSchema>

export { taskSchema, taskDefaultValues }
export type { TaskFormValues }
