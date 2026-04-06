import { z } from 'zod';

export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z
    .string()
    .max(300, 'Excerpt must be under 300 characters')
    .nullish()
    .or(z.literal('')),
  url: z.string().url('Please enter a valid URL').min(1, 'URL is required'),
  cover_image_url: z
    .string()
    .url('Please enter a valid URL')
    .nullish()
    .or(z.literal('')),
  published_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Published date must be in YYYY-MM-DD format')
    .nullish()
    .or(z.literal('')),
  reading_time_minutes: z
    .number()
    .min(0, 'Reading time must be a positive number')
    .nullish(),
  tags: z.array(z.string()),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;
