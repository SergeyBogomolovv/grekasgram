import { z } from 'zod';

export const chatCompanionSchema = z.object({
  chatId: z.string().uuid(),
  createdAt: z.string().datetime(),
  companionId: z.string().uuid(),
  companionUsername: z.string(),
  companionAvatarUrl: z.nullable(z.string().url()),
  companionOnline: z.boolean(),
  companionLastOnlineAt: z.string().datetime(),
});

export type ChatCompanion = z.infer<typeof chatCompanionSchema>;

export const chatPreviewSchema = z.object({
  chatId: z.string().uuid(),
  createdAt: z.string().datetime(),
  companionId: z.string().uuid(),
  companionUsername: z.string(),
  companionAvatarUrl: z.nullable(z.string().url()),
  companionOnline: z.boolean(),
  companionLastOnlineAt: z.string().datetime(),
  lastMessage: z.string().nullable(),
  lastMessageAt: z.string().datetime(),
  newMessages: z
    .string()
    .regex(/^\d+$/)
    .transform((val) => parseInt(val, 10)),
});

export type ChatPreview = z.infer<typeof chatPreviewSchema>;
