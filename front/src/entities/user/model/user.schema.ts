import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullable(),
  about: z.string().nullable(),
  createdAt: z.string(),
  online: z.boolean(),
  lastOnlineAt: z.string(),
});

export type User = z.infer<typeof userSchema>;
