import { $api } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useConfirmEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (confirmToken: string) =>
      $api.post('/auth/confirm-email', { token: confirmToken }),
    onSuccess: () => {
      router.refresh();
    },
    onError() {
      toast.error('Произошла ошибка подтверждения почты');
    },
  });
};
