'use server';
import { userSchema } from '@/entities/user';
import $ssrApi from '@/shared/config/ssr-api';

export const getUser = async () => {
  const { data } = await $ssrApi.get('/users/me');
  return userSchema.parse(data);
};
