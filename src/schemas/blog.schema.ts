import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase with hyphens only (e.g. my-post-title)'
    ),
  excerpt: z
    .string()
    .min(1, 'Excerpt is required')
    .max(500, 'Excerpt must be 500 characters or less'),
  category: z.string().min(1, 'Category is required'),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  readTime: z
    .number({ error: 'Must be a valid number' })
    .min(1, 'Must be at least 1 minute')
    .max(120, 'Maximum is 120 minutes'),
  tags: z.string().min(1, 'Add at least one tag'),
  featured: z.boolean(),
  published: z.boolean(),
});

export type BlogFormData = z.infer<typeof blogSchema>;
