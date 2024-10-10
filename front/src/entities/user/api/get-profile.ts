'use server';
import { queryClient } from '@/app/config';
import { userSchema } from '@/entities/user';
import { fetcher } from '@/shared/api/fetcher';

export const getProfile = async () => {
  try {
    const data = await fetcher('/users/me', { tags: ['profile'] });
    const parsed = userSchema.parse(data);
    queryClient.setQueryData(['profile'], parsed);
    return parsed;
  } catch (error) {
    return null;
  }
};
