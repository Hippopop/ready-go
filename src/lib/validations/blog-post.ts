import { z } from 'zod';

export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z
    .string()
    .max(300, 'Excerpt must be under 300 characters')
    .optional()
    .or(z.literal('')),
  url: z.string().url('Please enter a valid URL').min(1, 'URL is required'),
  cover_image_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  published_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Published at must be in YYYY-MM-DD format')
    .optional()
    .or(z.literal('')),
  reading_time_minutes: z.coerce
    .number()
    .min(0, 'Reading time must be a positive number')
    .optional(),
  tags: z.array(z.string()).optional().default([]),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;
