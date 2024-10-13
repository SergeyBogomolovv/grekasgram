import { messageSchema } from '@/entities/message';
import { userSchema } from '@/entities/user';
import { z } from 'zod';

export const chatSchema = z.object({
  id: z.string().uuid(),
  lastMessage: z.optional(messageSchema),
  newMessages: z.optional(z.number()),
  companion: userSchema,
  createdAt: z.string(),
});

export type Chat = z.infer<typeof chatSchema>;
