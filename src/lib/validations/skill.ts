import { z } from 'zod';

/** Common skill category suggestions shown in the datalist. */
export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'DevOps',
  'Mobile',
  'Database',
  'Design',
  'Tools',
] as const;

/** Zod schema for the skill form. */
export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.string().optional(),
  icon_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  proficiency: z
    .number({ invalid_type_error: 'Proficiency is required' })
    .int()
    .min(1, 'Minimum proficiency is 1')
    .max(5, 'Maximum proficiency is 5'),
  years_of_experience: z
    .number()
    .min(0, 'Years of experience cannot be negative')
    .optional(),
});

export type SkillFormValues = z.infer<typeof skillSchema>;
