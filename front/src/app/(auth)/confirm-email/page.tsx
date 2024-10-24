import { ConfirmEmail } from '@/features/auth';

export default function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return (
    <main className="flex flex-col items-center justify-center gap-y-6 min-h-screen">
      <ConfirmEmail token={searchParams.token} />
      <div className="animate-pulse flex items-center gap-2 duration-250">
        <div className="dark:bg-white bg-black rounded-full size-6" />
        <div className="dark:bg-white bg-black rounded-full size-6" />
        <div className="dark:bg-white bg-black rounded-full size-6" />
      </div>
    </main>
  );
}
