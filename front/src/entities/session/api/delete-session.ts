'use server';
import { revalidateTag } from 'next/cache';
import { fetcher } from '@/shared/api';

export const deleteSession = async (id: string) => {
  await fetcher(`/auth/logout-from-device/${id}`, { method: 'POST' });

  revalidateTag('sessions');
};
