import { z } from 'zod';

/** Zod schema for the projects section form */
export const projectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be under 100 characters'),

  description: z
    .string()
    .max(1000, 'Description must be under 1000 characters')
    .optional()
    .or(z.literal('')),

  cover_image_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),

  live_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),

  github_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),

  tech_stack: z.array(z.string()).optional().default([]),

  is_featured: z.boolean().default(false),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
