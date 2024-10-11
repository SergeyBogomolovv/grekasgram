import { messages } from '@/assets/mocks/messages';
import { Message } from '@/entities/message';

export default function ChatPage({ params }: { params: { id: string } }) {
  const currentMessages = messages.filter(
    (msg) => msg.chatId === Number(params.id),
  );
  return (
    <div className="flex-grow flex flex-col gap-4 p-4">
      {currentMessages.map((msg) => (
        <Message message={msg} key={msg.id} />
      ))}
    </div>
  );
}
