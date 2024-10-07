'use client';

import { useCurrentTab } from '@/entities/tabs';
import { ChatList } from '@/features/chat-list';
import { UsersList } from '@/features/users-list';

export default function CurrentTab() {
  const currentTab = useCurrentTab();
  if (currentTab === 'chats') return <ChatList />;
  if (currentTab === 'users') return <UsersList />;
  if (currentTab === 'groups') return <UsersList />;
}
