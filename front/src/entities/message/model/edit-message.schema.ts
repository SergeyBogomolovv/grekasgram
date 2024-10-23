import { z } from 'zod';

export const editMessageSchema = z.object({
  content: z.string().min(1),
});

export type EditMessageFields = z.infer<typeof editMessageSchema>;
