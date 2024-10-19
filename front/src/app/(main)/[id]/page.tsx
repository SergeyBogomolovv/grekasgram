import { MessagesContainer } from '@/features/chats';

export default function ChatPage({ params }: { params: { id: string } }) {
  return <MessagesContainer chatId={params.id} />;
}
