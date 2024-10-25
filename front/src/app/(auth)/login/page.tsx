import { LoginForm } from '@/features/auth';
import Image from 'next/image';
import ChatImage from '@public/chat.svg';

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full lg:grid lg:grid-cols-2 flex flex-col justify-center">
      <section className="flex items-center justify-center py-12">
        <LoginForm />
      </section>
      <section className="hidden bg-muted lg:flex items-center justify-center p-10">
        <Image src={ChatImage} alt="chat image" priority />
      </section>
    </main>
  );
}
