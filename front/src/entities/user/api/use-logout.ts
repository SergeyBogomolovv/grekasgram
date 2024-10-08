'use client';
import { $api } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: () => $api.post('/auth/logout'),
    onSuccess: () => {
      router.refresh();
    },
  });
};
