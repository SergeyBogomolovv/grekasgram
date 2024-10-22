import { z } from 'zod';

export const newChatFormSchema = z.object({
  content: z.string().min(1, 'Сообщение не может быть пустым'),
});

export type NewChatForm = z.infer<typeof newChatFormSchema>;
