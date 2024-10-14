import { userSchema } from '@/entities/user';
import { z } from 'zod';

export const chatSchema = z.object({
  id: z.string().uuid(),
  companion: userSchema,
  lastMessage: z.optional(z.string()),
  newMessages: z.optional(z.number()),
  lastActivity: z.string(),
});

export type Chat = z.infer<typeof chatSchema>;
