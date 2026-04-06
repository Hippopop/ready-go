import { z } from 'zod';

/** Zod schema for the hero section form */
export const heroSchema = z.object({
  headline: z
    .string()
    .min(1, 'Headline is required')
    .max(100, 'Headline must be under 100 characters'),
  subheadline: z
    .string()
    .max(150, 'Subheadline must be under 150 characters')
    .nullish()
    .or(z.literal('')),
  tagline: z
    .string()
    .max(200, 'Tagline must be under 200 characters')
    .nullish()
    .or(z.literal('')),
  profile_image_url: z
    .string()
    .url('Please enter a valid URL')
    .nullish()
    .or(z.literal('')),
  cta_primary_text: z.string().nullish().or(z.literal('')),
  cta_primary_url: z
    .string()
    .url('Please enter a valid URL')
    .nullish()
    .or(z.literal('')),
  cta_secondary_text: z.string().nullish().or(z.literal('')),
  is_typing_animation: z.boolean(),
  typing_texts: z.array(z.string()),
});

export type HeroFormValues = z.infer<typeof heroSchema>;
