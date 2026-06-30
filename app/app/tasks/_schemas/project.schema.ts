import * as z from "zod"

const datePattern = /^\d{4}-\d{2}-\d{2}$/

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  starred: z.boolean(),
  status: z.string(),
  color: z.string(),
  description: z.string(),
  due_date: z
    .union([z.string().regex(datePattern), z.literal(""), z.null()])
    .optional()
    .transform((value) => (value ? value : null)),
  icon: z.string(),
})

const formDefaultValues = {
  title: "",
  starred: false,
  status: "on_track",
  color: "#5EC5DC",
  description: "",
  due_date: null as string | null,
  icon: "Globe",
}

type ProjectType = z.infer<typeof schema>

export { schema, formDefaultValues }
export type { ProjectType }
