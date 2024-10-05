'use server';
import { userSchema } from '@/entities/user';
import $api from '@/shared/config/api';
import queryClient from '@/shared/config/query';
import { cookies } from 'next/headers';

export const getUser = async () => {
  const { data } = await $api.get('/users/me', {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  const parsed = userSchema.parse(data);
  queryClient.setQueryData(['profile'], parsed);
  return parsed;
};
