import { z } from "zod"

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be 1000 characters or less"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "published", "archived"], {
    message: "Status is required",
  }),
  technologies: z.string().min(1, "Add at least one technology"),
  liveUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  featured: z.boolean(),
})

export type ProjectFormData = z.infer<typeof projectSchema>
