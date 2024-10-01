'use client';

import { useCurrentTab } from '@/entities/tabs';

interface Props {
  htmlFor: string;
}

export default function Label({ htmlFor }: Props) {
  const currentTab = useCurrentTab();

  return (
    <label htmlFor={htmlFor} className="text-xl font-bold">
      Поиск {currentTab === 'chats' && 'чатов'}
      {currentTab === 'favorites' && 'избранных'}
      {currentTab === 'users' && 'пользователей'}
    </label>
  );
}
