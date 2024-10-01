'use client';
import { useEffect } from 'react';

import { useConfirmEmail } from '../hooks/use-confirm-email';

interface Props {
  token?: string | null;
}

export default function ConfirmEmail({ token }: Props) {
  const { mutate } = useConfirmEmail();

  useEffect(() => {
    if (token) {
      mutate(token);
    }
  }, [mutate, token]);

  return (
    <main className="flex flex-col items-center justify-center gap-y-6 flex-1">
      <h1 className="font-bold text-3xl">Проверяем вашу почту</h1>
      <div className="animate-pulse flex items-center gap-2 duration-250">
        <div className="dark:bg-white bg-black rounded-full size-6" />
        <div className="dark:bg-white bg-black rounded-full size-6" />
        <div className="dark:bg-white bg-black rounded-full size-6" />
      </div>
    </main>
  );
}
