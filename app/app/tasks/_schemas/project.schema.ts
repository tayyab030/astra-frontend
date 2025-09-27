import * as z from "zod";

// Validation schema
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  starred: z.boolean(),
  status: z.string(),
  color: z.string(),
  description: z.string(),
  due_date: z.date().optional(),
  icon: z.string(),
});

type ProjectType = z.infer<typeof schema>;

export { schema };
export type { ProjectType };
