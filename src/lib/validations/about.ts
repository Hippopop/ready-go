import { z } from 'zod';

// ---------------------------------------------------------------------------
// Availability status enum values
// ---------------------------------------------------------------------------
export const AVAILABILITY_STATUSES = ['open', 'busy', 'not_available'] as const;
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

// ---------------------------------------------------------------------------
// About section schema
// ---------------------------------------------------------------------------
export const aboutSchema = z.object({
  bio: z
    .string()
    .min(1, 'Bio is required')
    .max(1000, 'Bio must be under 1000 characters'),
  location: z
    .string()
    .max(200, 'Location must be under 200 characters')
    .optional()
    .or(z.literal('')),
  availability_status: z.enum(AVAILABILITY_STATUSES, {
    required_error: 'Availability status is required',
  }),
  years_of_experience: z.coerce
    .number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .max(60, 'Must be 60 or less')
    .optional()
    .or(z.literal('')),
});

export type AboutFormValues = z.infer<typeof aboutSchema>;

// ---------------------------------------------------------------------------
// Social link schema
// ---------------------------------------------------------------------------
export const socialLinkSchema = z.object({
  platform: z
    .string()
    .min(1, 'Platform is required'),
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Please enter a valid URL'),
});

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;
