import { z } from 'zod';

export const invitationFormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  groupId: z.string().min(1, 'Group is required'),
});

export type InvitationFormValues = z.infer<typeof invitationFormSchema>;
