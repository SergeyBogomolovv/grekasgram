'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import $api from '@/shared/config/api';

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: () => $api.post('/auth/logout'),
    onSuccess: () => {
      router.refresh();
    },
  });
};
