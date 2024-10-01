import { z } from 'zod';

export const messageFormSchema = z.object({
  content: z.string().min(1, 'Сообщение не может быть пустым'),
});

export type MessageFormFields = z.infer<typeof messageFormSchema>;
