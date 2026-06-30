import { z } from 'zod';

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required').max(200),
  degree: z.string().min(1, 'Degree is required').max(200),
  field: z.string().min(1, 'Field of study is required').max(200),
  startDate: z.date({ error: 'Start date is required' }),
  endDate: z.date({ error: 'Invalid date' }).nullable(),
  gpa: z.string().max(10),
  location: z.string().max(200),
  description: z.string().max(2000),
  activities: z.string(),
});

export type EducationFormData = z.infer<typeof educationSchema>;
