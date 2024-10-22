import MainImage from '@/assets/main.svg';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';

export default function Home() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center gap-4 w-[90%] mx-auto text-center">
      <h1 className="lg:text-5xl text-4xl font-bold">
        Начинайте общаться прямо сейчас
      </h1>
      <p className="text-muted-foreground text-lg font-mono">
        Выберите чат, или найдите собеседника через поиск пользователей.
      </p>
      <Image src={MainImage} alt="begin chatting image" className="my-4" />
      <p className="text-muted-foreground font-mono">
        Вы можете изменить свой профиль, чтобы выделяться среди других
        пользователей.
      </p>
      <Button asChild size="lg" className="text-lg py-6 px-10 rounded-2xl">
        <Link href="/profile">
          <FaUserCircle className="size-6 mr-2" />
          Мой профиль
        </Link>
      </Button>
    </section>
  );
}
