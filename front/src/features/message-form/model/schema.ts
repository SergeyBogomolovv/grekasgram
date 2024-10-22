import { z } from 'zod';

export const messageFormSchema = z.object({
  content: z.string().min(1, 'Сообщение не может быть пустым'),
  image: z.optional(
    typeof window === 'undefined' ? z.any() : z.instanceof(File),
  ),
});

export type MessageFormFields = z.infer<typeof messageFormSchema>;
