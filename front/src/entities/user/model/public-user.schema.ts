import { z } from 'zod';

export const publicUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
  about: z.string().nullable(),
  online: z.boolean(),
  lastOnlineAt: z.string(),
});

export type PublicUser = z.infer<typeof publicUserSchema>;
