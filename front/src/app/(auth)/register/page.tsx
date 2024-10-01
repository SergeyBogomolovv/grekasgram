import { RegisterForm } from '@/features/auth';
import Image from 'next/image';
import BeginChatImage from '@/assets/begin-chat.svg';

export default function RegisterPage() {
  return (
    <>
      <section className="flex items-center justify-center py-12">
        <RegisterForm />
      </section>
      <section className="hidden bg-muted lg:flex items-center justify-center p-10">
        <Image src={BeginChatImage} alt="chat image" />
      </section>
    </>
  );
}
