import { useMutation } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';

import {
  MessageResponse,
  messageResponseSchema,
  RegisterFields,
} from '../model/response.schema';

import $api from '@/shared/config/api';

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
      setSuccessMessage(
        'Письмо с кодом подтверждения было отправлено на вашу почту',
      );
    },
    onError: () => {
      form.setError('root', {
        message: 'Что то пошло не так, попробуйте еще раз',
        type: 'custom',
      });
    },
  });
};
