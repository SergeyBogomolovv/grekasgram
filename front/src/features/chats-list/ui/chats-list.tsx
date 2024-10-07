import { chats } from '@/assets/mocks/cards';
import { ChatCard } from '@/entities/chatcard';

export default function ChatsList() {
  return (
    <div className="w-full flex flex-col divide-y-2 overflow-y-auto">
      {chats.map((chat) => (
        <ChatCard key={chat.id} chat={chat} />
      ))}
    </div>
  );
}
