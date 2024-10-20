import { ChatHeader, MessageForm, MessagesContainer } from '@/features/chats';

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <ChatHeader chatId={params.id} />
      <MessagesContainer chatId={params.id} />
      <MessageForm chatId={params.id} />
    </div>
  );
}
