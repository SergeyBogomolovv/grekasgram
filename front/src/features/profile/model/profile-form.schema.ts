import { z } from 'zod';

export const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Имя должно содержать не менее 3 символов' }),
  about: z.optional(z.string()),
  avatar: z.optional(
    typeof window === 'undefined' ? z.any() : z.instanceof(File),
  ),
});

export type ProfileFormFields = z.infer<typeof profileFormSchema>;
