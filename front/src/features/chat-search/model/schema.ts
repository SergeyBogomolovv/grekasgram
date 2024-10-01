import { z } from 'zod';

export const chatSearchSchema = z.object({
  query: z.string(),
});

export type ChatSearchFields = z.infer<typeof chatSearchSchema>;
