'use client';
import { useCurrentTab } from '@/entities/tabs';
import { ChatList } from '@/features/chat-list';
import { SearchInput } from '@/features/chat-search';
import { UsersList } from '@/features/users-list';

export default function Chatbar() {
  const currentTab = useCurrentTab();
  return (
    <aside className="w-[320px] hidden md:flex border-r-2 flex-col items-center max-w-screen">
      <SearchInput />
      {currentTab === 'chats' && <ChatList />}
      {currentTab === 'users' && <UsersList />}
    </aside>
  );
}
