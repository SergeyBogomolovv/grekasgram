import { z } from 'zod';

export const messageResponseSchema = z.object({
  message: z.string(),
});

export type MessageResponse = z.infer<typeof messageResponseSchema>;

export const loginFieldsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginFields = z.infer<typeof loginFieldsSchema>;

export const registerFieldsSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterFields = z.infer<typeof registerFieldsSchema>;
