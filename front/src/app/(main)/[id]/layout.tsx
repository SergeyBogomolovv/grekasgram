import { ChatHeader, MessageForm } from '@/features/chats';

export default function ChatsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <ChatHeader chatId={params.id} />
      {children}
      <MessageForm chatId={params.id} />
    </div>
  );
}
