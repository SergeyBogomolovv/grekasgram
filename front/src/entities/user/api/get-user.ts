'use server';
import { userSchema } from '@/entities/user';
import $api from '@/shared/config/api';
import { cookies } from 'next/headers';

export const getUser = async () => {
  const { data } = await $api.get('/users/me', {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return userSchema.parse(data);
};
