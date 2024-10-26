import { RegisterForm } from '@/features/auth';
import Image from 'next/image';
import BeginChatImage from '@public/begin-chat.svg';

export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full lg:grid lg:grid-cols-2 flex flex-col justify-center">
      <section className="flex items-center justify-center py-12">
        <RegisterForm />
      </section>
      <section className="hidden bg-muted lg:flex items-center justify-center p-10">
        <Image src={BeginChatImage} alt="chat image" priority />
      </section>
    </main>
  );
}
