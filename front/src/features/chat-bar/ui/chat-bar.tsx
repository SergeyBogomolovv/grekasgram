'use client';

import ChatsList from './chats-list';
import UsersList from './users-list';
import SearchInput from './search-input';
import { useCurrentTab } from '@/shared/lib/hooks/use-current-tab';
import FavoritesList from './favorites-list';
import { cn } from '@/shared/lib/utils';

export default function Chatbar({
  className,
  closeChatbar,
}: {
  className?: string;
  closeChatbar?: () => void;
}) {
  const currentTab = useCurrentTab();

  return (
    <section
      className={cn(
        'flex flex-col md:border-r-2 md:w-[300px] items-center overflow-y-auto flex-2',
        className,
      )}
    >
      <SearchInput currentTab={currentTab} />
      {currentTab === 'chats' && <ChatsList closeChatbar={closeChatbar} />}
      {currentTab === 'favorites' && (
        <FavoritesList closeChatbar={closeChatbar} />
      )}
      {currentTab === 'users' && <UsersList />}
    </section>
  );
}
