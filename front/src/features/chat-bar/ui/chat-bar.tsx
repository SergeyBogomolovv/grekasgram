'use client';

import ChatsList from './chats-list';
import UsersList from './users-list';
import GroupsList from './groups-list';
import SearchInput from './search-input';
import { useCurrentTab } from '@/shared/lib/hooks/use-current-tab';

export default function Chatbar() {
  const currentTab = useCurrentTab();

  return (
    <section className="flex flex-col md:border-r-2 md:w-[300px] items-center overflow-y-auto">
      <SearchInput currentTab={currentTab} />
      {currentTab === 'chats' && <ChatsList />}
      {currentTab === 'users' && <UsersList />}
      {currentTab === 'groups' && <GroupsList />}
    </section>
  );
}
