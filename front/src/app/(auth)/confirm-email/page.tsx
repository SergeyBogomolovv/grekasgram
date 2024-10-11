import { ConfirmEmail } from '@/features/auth';
import { Suspense } from 'react';

export default function ConfirmEmailPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-y-6 min-h-screen">
      <Suspense fallback={<h1 className="font-bold text-3xl">Загрузка...</h1>}>
        <ConfirmEmail />
      </Suspense>
      <div className="animate-pulse flex items-center gap-2 duration-250">
        <div className="dark:bg-white bg-black rounded-full size-6" />
        <div className="dark:bg-white bg-black rounded-full size-6" />
        <div className="dark:bg-white bg-black rounded-full size-6" />
      </div>
    </main>
  );
}
