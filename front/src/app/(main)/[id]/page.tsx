import Chat from '@/widgets/chat';

export default function ChatPage({ params }: { params: { id: string } }) {
  return <Chat chatId={params.id} />;
}
