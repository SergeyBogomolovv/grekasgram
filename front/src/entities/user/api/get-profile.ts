'use server';
import { userSchema } from '@/entities/user';
import { queryClient } from '@/shared/api';
import { fetcher } from '@/shared/api/fetcher';

export const getProfile = async () => {
  const profile = await fetcher('/users/me', {
    tags: ['profile'],
    schema: userSchema,
  });

  queryClient.setQueryData(['profile'], profile);
  return profile;
};
