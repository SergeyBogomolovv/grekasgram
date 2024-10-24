import { ChatHeader } from '@/features/chat-header';
import { MessageForm } from '@/features/message-form';
import { ChatMessages } from '@/widgets/chat';

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <ChatHeader chatId={params.id} />
      <ChatMessages chatId={params.id} />
      <MessageForm chatId={params.id} />
    </div>
  );
}
