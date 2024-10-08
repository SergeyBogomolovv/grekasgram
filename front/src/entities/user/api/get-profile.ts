'use server';
import { queryClient } from '@/app/config';
import { userSchema } from '@/entities/user';
import { $api } from '@/shared/api';
import { cookies } from 'next/headers';

export const getProfile = async () => {
  const { data } = await $api.get('/users/me', {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  const parsed = userSchema.parse(data);
  queryClient.setQueryData(['profile'], parsed);
  return parsed;
};
