import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { LoginFields, messageResponseSchema } from '../model/response.schema';
import { $api } from '@/shared/api';

export const useLogin = (form: UseFormReturn<LoginFields>) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (fields: LoginFields) => {
      const { data } = await $api.post('/auth/login', fields);
      return messageResponseSchema.parse(data);
    },
    onSuccess: () => {
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
