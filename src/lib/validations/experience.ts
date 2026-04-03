import { z } from 'zod';

/** Employment type enum values matching the database constraint */
export const EMPLOYMENT_TYPES = [
  'full-time',
  'part-time',
  'contract',
  'freelance',
  'internship',
] as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

/** Zod schema for the experience section form */
export const experienceSchema = z
  .object({
    company_name: z.string().min(1, 'Company name is required'),

    company_url: z
      .string()
      .url('Please enter a valid URL')
      .optional()
      .or(z.literal('')),

    company_logo_url: z
      .string()
      .url('Please enter a valid URL')
      .optional()
      .or(z.literal('')),

    role: z.string().min(1, 'Role / title is required'),

    employment_type: z.enum(EMPLOYMENT_TYPES, {
      required_error: 'Please select an employment type',
    }),

    start_date: z
      .string()
      .min(1, 'Start date is required')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),

    end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
      .optional()
      .or(z.literal('')),

    is_current: z.boolean().default(false),

    description: z
      .string()
      .max(2000, 'Description must be under 2000 characters')
      .optional()
      .or(z.literal('')),

    tech_stack: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // If not current role, end_date is recommended but not strictly required
      // However if both dates are present, end must be after start
      if (data.end_date && data.start_date) {
        return data.end_date >= data.start_date;
      }
      return true;
    },
    {
      message: 'End date must be on or after the start date',
      path: ['end_date'],
    },
  );

export type ExperienceFormValues = z.infer<typeof experienceSchema>;
