import { z } from 'zod';

export const openSourceSchema = z.object({
  repo_name: z.string().min(1, 'Repository name is required'),
  repo_url: z.string().url('Please enter a valid URL').nullish().or(z.literal('')),
  description: z.string().max(300, 'Description must be 300 characters or less').nullish().or(z.literal('')),
  language: z.string().nullish().or(z.literal('')),
  stars: z.number().min(0, 'Stars cannot be negative').nullish(),
  role: z.enum(['owner', 'maintainer', 'contributor'], {
    message: 'Please select a role',
  }),
});

export type OpenSourceFormValues = z.infer<typeof openSourceSchema>;
