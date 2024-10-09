'use client';
import { useEffect } from 'react';

import { useConfirmEmail } from '../api/use-confirm-email';
import { useSearchParams } from 'next/navigation';

export default function ConfirmEmail() {
  const params = useSearchParams();
  const token = params.get('token');

  const { mutate, isSuccess, isPending, isError } = useConfirmEmail();

  //TODO: fix double sending token
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
