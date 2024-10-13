import { z } from 'zod';

export const accessTokenReponseSchema = z.object({
  accessToken: z.string(),
});

export type AccessTokenResponse = z.infer<typeof accessTokenReponseSchema>;

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
