import { z } from 'zod';

export const invitationFormSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  phone: z.string().optional(),
});

export type InvitationFormValues = z.infer<typeof invitationFormSchema>;
