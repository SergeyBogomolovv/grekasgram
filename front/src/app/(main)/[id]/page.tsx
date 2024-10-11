import { messages } from '@/assets/mocks/messages';
import { Message } from '@/entities/message';

export default function ChatPage({ params }: { params: { id: string } }) {
  const currentMessages = messages.filter(
    (msg) => msg.chatId === Number(params.id),
  );
  return (
    <section className="flex-grow flex flex-col gap-4 p-4 overflow-y-scroll">
      {currentMessages.map((msg) => (
        <Message message={msg} key={msg.id} />
      ))}
    </section>
  );
}
