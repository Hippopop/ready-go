import { z } from 'zod';

export const openSourceSchema = z.object({
  repo_name: z.string().min(1, 'Repository name is required'),
  repo_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(300, 'Description must be 300 characters or less')
    .optional()
    .or(z.literal('')),
  language: z.string().optional().or(z.literal('')),
  stars: z.coerce.number().min(0, 'Stars cannot be negative').default(0),
  role: z.enum(['owner', 'maintainer', 'contributor'], {
    required_error: 'Please select a role',
  }),
});

export type OpenSourceFormValues = z.infer<typeof openSourceSchema>;
