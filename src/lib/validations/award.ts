import { z } from 'zod';

/** Zod schema for the awards section form */
export const awardSchema = z.object({
  title: z.string().min(1, 'Award title is required'),

  issuer: z.string().optional().or(z.literal('')),

  date: z.string().optional().or(z.literal('')),

  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),

  url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
});

export type AwardFormValues = z.infer<typeof awardSchema>;
