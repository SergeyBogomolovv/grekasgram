import { z } from 'zod';

export const sessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  device: z.string(),
  ip: z.string().ip(),
  loginedAt: z.string(),
});

export type SessionEntity = z.infer<typeof sessionSchema>;
