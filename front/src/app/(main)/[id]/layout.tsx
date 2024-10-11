import { ChatHeader, MessageForm } from '@/features/chats';

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <ChatHeader />
      {children}
      <MessageForm />
    </div>
  );
}
