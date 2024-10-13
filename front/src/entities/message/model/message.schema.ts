import { z } from 'zod';

export const messageSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  fromId: z.string().uuid(),
  chatId: z.string().uuid(),
  viewed: z.boolean(),
});

export type MessageSchema = z.infer<typeof messageSchema>;
