import * as z from "zod";

// Validation schema
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  starred: z.boolean(),
  status: z.string(),
  color: z.string(),
  description: z.string(),
  due_date: z.string().datetime().optional().nullable(),
  icon: z.string(),
});

const formDefaultValues = {
  title: "",
  starred: false,
  status: "on_track",
  color: "#5EC5DC",
  description: "",
  due_date: null,
  icon: "Globe",
};

type ProjectType = z.infer<typeof schema>;

export { schema, formDefaultValues };
export type { ProjectType };
