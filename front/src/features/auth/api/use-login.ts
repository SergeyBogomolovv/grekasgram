import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { LoginFields, accessTokenReponseSchema } from '../model/auth.schema';
import { $api } from '@/shared/api';
import { setAccessToken } from '@/shared/lib/utils';

export const useLogin = (form: UseFormReturn<LoginFields>) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (fields: LoginFields) => {
      const { data } = await $api.post('/auth/login', fields);
      return accessTokenReponseSchema.parse(data);
    },
    onSuccess: async (data) => {
      await setAccessToken(data.accessToken);
      toast.success('Вы успешно вошли в аккаунт');
      router.refresh();
    },
    onError: () => {
      form.setError('root', {
        message: 'Введенны неверные данные',
        type: 'custom',
      });
    },
  });
};
