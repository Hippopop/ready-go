import { z } from 'zod';

/** Zod schema for the certifications section form */
export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),

  issuer: z.string().nullish().or(z.literal('')),

  issue_date: z.string().nullish().or(z.literal('')),

  expiry_date: z.string().nullish().or(z.literal('')),

  credential_url: z
    .string()
    .url('Please enter a valid URL')
    .nullish()
    .or(z.literal('')),

  badge_image_url: z
    .string()
    .url('Please enter a valid URL')
    .nullish()
    .or(z.literal('')),
});

export type CertificationFormValues = z.infer<typeof certificationSchema>;
