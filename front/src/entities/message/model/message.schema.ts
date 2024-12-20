import { z } from 'zod';

export const messageSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  fromId: z.string().uuid(),
  chatId: z.string().uuid(),
  imageUrl: z.nullable(z.string()),
  isRead: z.nullable(z.boolean()),
});

export type MessageEntity = z.infer<typeof messageSchema>;
