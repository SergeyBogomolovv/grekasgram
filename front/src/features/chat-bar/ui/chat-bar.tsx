'use client';

import ChatsList from './chats-list';
import UsersList from './users-list';
import SearchInput from './search-input';
import { useCurrentTab } from '@/shared/lib/hooks/use-current-tab';
import FavoritesList from './favorites-list';

export default function Chatbar() {
  const currentTab = useCurrentTab();

  return (
    <section className="flex flex-col md:border-r-2 md:w-[300px] items-center overflow-y-auto flex-2">
      <SearchInput currentTab={currentTab} />
      {currentTab === 'chats' && <ChatsList />}
      {currentTab === 'favorites' && <FavoritesList />}
      {currentTab === 'users' && <UsersList />}
    </section>
  );
}
