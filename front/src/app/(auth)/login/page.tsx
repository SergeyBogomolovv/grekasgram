import { LoginForm } from '@/features/auth';
import Image from 'next/image';
import ChatImage from '@/assets/chat.svg';

export default function LoginPage() {
  return (
    <>
      <section className="flex items-center justify-center py-12">
        <LoginForm />
      </section>
      <section className="hidden bg-muted lg:flex items-center justify-center p-10">
        <Image src={ChatImage} alt="chat image" />
      </section>
    </>
  );
}
