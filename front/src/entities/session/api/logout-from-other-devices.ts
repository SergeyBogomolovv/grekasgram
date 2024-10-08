'use server';

import { fetcher } from '@/shared/api/fetcher';
import { revalidateTag } from 'next/cache';

export const logoutFromOtherDevices = async () => {
  await fetcher('/auth/logout-from-other-devices', { method: 'POST' });

  revalidateTag('sessions');
};
