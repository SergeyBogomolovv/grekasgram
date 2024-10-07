'use client';
import { useCurrentTab } from '@/entities/tabs';
import { ChatsList } from '@/features/chats-list';
import { GroupsList } from '@/features/groups-list';
import { UsersList } from '@/features/users-list';

export default function CurrentTab() {
  const currentTab = useCurrentTab();
  if (currentTab === 'chats') return <ChatsList />;
  if (currentTab === 'users') return <UsersList />;
  if (currentTab === 'groups') return <GroupsList />;
}
