import { z } from "zod"

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(100, "Name must be 100 characters or less"),
  category: z.string().min(1, "Category is required"),
  proficiency: z.number().min(0, "Minimum is 0").max(100, "Maximum is 100"),
  yearsOfExperience: z
    .number({ error: "Must be a valid number" })
    .min(0, "Must be 0 or more")
    .max(30, "Maximum is 30 years"),
})

export type SkillFormData = z.infer<typeof skillSchema>
