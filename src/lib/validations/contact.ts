import { z } from 'zod';

/**
 * Validation schema for the portfolio contact form.
 */
export const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(20, { message: "Message must be at least 20 characters." }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
