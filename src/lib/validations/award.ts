import { z } from 'zod';

/** Zod schema for the awards section form */
export const awardSchema = z.object({
  title: z.string().min(1, 'Award title is required'),

  issuer: z.string().nullish().or(z.literal('')),

  date: z.string().nullish().or(z.literal('')),

  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .nullish()
    .or(z.literal('')),

  url: z
    .string()
    .url('Please enter a valid URL')
    .nullish()
    .or(z.literal('')),
});

export type AwardFormValues = z.infer<typeof awardSchema>;
