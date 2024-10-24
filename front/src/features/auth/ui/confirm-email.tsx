'use client';
import { useEffect } from 'react';

import { useConfirmEmail } from '../api/use-confirm-email';

export default function ConfirmEmail({ token }: { token?: string }) {
  const { mutate, isSuccess, isPending, isError } = useConfirmEmail();

  useEffect(() => {
    if (token) {
      mutate(token);
    }
  }, [mutate, token]);

  return (
    <h1 className="font-bold text-3xl">
      {isPending && 'Проверяем вашу почту'}
      {isSuccess && 'Почта подтверждена'}
      {isError && 'Произошла ошибка'}
    </h1>
  );
}
