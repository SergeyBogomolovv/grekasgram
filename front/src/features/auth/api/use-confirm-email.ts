import { $api } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { accessTokenReponseSchema } from '../model/auth.schema';
import { setAccessToken } from '@/shared/lib/utils';

export const useConfirmEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (confirmToken: string) => {
      const { data } = await $api.post('/auth/confirm-email', {
        token: confirmToken,
      });
      return accessTokenReponseSchema.parse(data);
    },

    onSuccess: async (data) => {
      await setAccessToken(data.accessToken);
      router.refresh();
    },
    onError() {
      toast.error('Произошла ошибка подтверждения почты');
    },
  });
};
