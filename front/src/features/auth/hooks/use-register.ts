import { useMutation } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';

import {
  MessageResponse,
  messageResponseSchema,
  RegisterFields,
} from '../model/response.schema';

import $api from '@/shared/config/api';
import { isAxiosError } from 'axios';

export const useRegister = (
  form: UseFormReturn<RegisterFields>,
  setSuccessMessage: Dispatch<SetStateAction<string | undefined>>,
) => {
  return useMutation({
    mutationFn: async (fields: RegisterFields) => {
      const { data } = await $api.post<MessageResponse>(
        '/auth/register',
        fields,
      );
      const { message } = messageResponseSchema.parse(data);
      return message;
    },
    onSuccess: () => {
      form.reset();
      setSuccessMessage(
        'Письмо с кодом подтверждения было отправлено на вашу почту',
      );
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        form.setError('root', {
          message: 'Такой пользователь уже существует',
          type: 'custom',
        });
      } else {
        form.setError('root', {
          message: 'Что то пошло не так, попробуйте еще раз',
          type: 'custom',
        });
      }
    },
  });
};
