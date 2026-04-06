import { z } from 'zod';

/** Zod schema for the testimonial section form */
export const testimonialSchema = z.object({
  author_name: z.string().min(1, 'Author name is required'),

  author_title: z.string().nullish().or(z.literal('')),

  author_company: z.string().nullish().or(z.literal('')),

  author_avatar_url: z
    .string()
    .url('Please enter a valid URL')
    .nullish()
    .or(z.literal('')),

  content: z
    .string()
    .min(1, 'Content is required')
    .max(1000, 'Content must be under 1000 characters'),

  linkedin_url: z
    .string()
    .url('Please enter a valid URL')
    .nullish()
    .or(z.literal('')),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
