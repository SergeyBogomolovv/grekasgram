import { ChatSearch } from '@/features/chat-search';
import { ChatList } from '@/features/chat-list';

export default function Chatbar() {
  return (
    <aside className="min-w-[300px] hidden md:flex border-r-2 flex-col items-center max-w-screen">
      <ChatSearch />
      <ChatList />
    </aside>
  );
}
