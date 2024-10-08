import { chats } from '@/assets/mocks/cards';
import { ChatCard } from '@/entities/chat';

export default function GroupsList() {
  return (
    <div className="w-full flex flex-col divide-y-2 overflow-y-auto">
      {chats.map((chat) => (
        // TODO: group card
        <ChatCard key={chat.id} chat={chat} />
      ))}
    </div>
  );
}
