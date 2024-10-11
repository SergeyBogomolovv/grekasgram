import { $api } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { messageResponseSchema } from '../model/response.schema';

export const useConfirmEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (confirmToken: string) => {
      const { data } = await $api.post('/auth/confirm-email', {
        token: confirmToken,
      });
      return messageResponseSchema.parse(data);
    },

    onSuccess: () => {
      router.refresh();
    },
    onError() {
      toast.error('Произошла ошибка подтверждения почты');
    },
  });
};
