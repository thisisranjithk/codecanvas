import { z } from 'zod';

const experienceBaseSchema = z.object({
  company: z.string().min(1, 'Company is required').max(200),
  role: z.string().min(1, 'Role is required').max(200),
  type: z.string().min(1, 'Employment type is required'),
  location: z.string().min(1, 'Location is required').max(200),
  startDate: z.date({ error: 'Start date is required' }),
  endDate: z.date({ error: 'Invalid date' }).nullable(),
  current: z.boolean(),
  description: z.string().max(2000, 'Description must be 2000 characters or less'),
  responsibilities: z.string(),
  technologies: z.string(),
});

export const experienceSchema = experienceBaseSchema.refine(
  (data) => data.current || data.endDate !== null,
  {
    message: 'End date is required when not currently working here',
    path: ['endDate'],
  }
);

export type ExperienceFormData = z.infer<typeof experienceBaseSchema>;
