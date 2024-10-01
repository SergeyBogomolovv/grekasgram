import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { LoginFields } from '../model/response.schema';

import $api from '@/shared/config/api';

export const useLogin = (form: UseFormReturn<LoginFields>) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (fields: LoginFields) => $api.post('/auth/login', fields),
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
