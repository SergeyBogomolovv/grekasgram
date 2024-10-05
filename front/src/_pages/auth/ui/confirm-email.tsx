import { ConfirmEmail } from '@/features/auth';

export default function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  return <ConfirmEmail token={searchParams.token} />;
}
