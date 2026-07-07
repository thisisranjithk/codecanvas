import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title must be 255 characters or less'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], {
    message: 'Status is required',
  }),
  technologies: z.string().min(1, 'Add at least one technology'),
  liveUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  githubUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  featured: z.boolean(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
