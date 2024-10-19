'use client';

import { Message, useGetMessages } from '@/entities/message';
import { useGetProfile } from '@/entities/user';

interface Props {
  chatId: string;
}

export default function MessagesContainer({ chatId }: Props) {
  const { data, isLoading } = useGetMessages(chatId);
  const { data: user } = useGetProfile();

  return (
    <section className="flex-grow flex flex-col gap-4 p-4 overflow-y-scroll">
      {isLoading && <p className="text-center">Загрузка...</p>}
      {data?.map((msg) => (
        <Message message={msg} key={msg.id} userId={user?.id} />
      ))}
    </section>
  );
}
