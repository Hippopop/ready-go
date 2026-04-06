import { z } from 'zod';

/** Zod schema for the education section form */
export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required'),

  institution_logo_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),

  degree: z.string().optional().or(z.literal('')),

  field_of_study: z.string().optional().or(z.literal('')),

  start_year: z
    .number()
    .min(1900, 'Invalid year')
    .max(2100, 'Invalid year')
    .optional()
    .nullable(),

  end_year: z
    .number()
    .min(1900, 'Invalid year')
    .max(2100, 'Invalid year')
    .optional()
    .nullable(),

  gpa: z.string().optional().or(z.literal('')),

  honors: z.string().optional().or(z.literal('')),

  description: z
    .string()
    .max(500, 'Description must be under 500 characters')
    .optional()
    .or(z.literal('')),
}).refine(
  (data) => {
    // If both years are present, end must be after or equal to start
    if (data.end_year && data.start_year) {
      return data.end_year >= data.start_year;
    }
    return true;
  },
  {
    message: 'End year must be on or after the start year',
    path: ['end_year'],
  }
);

export type EducationFormValues = z.infer<typeof educationSchema>;
