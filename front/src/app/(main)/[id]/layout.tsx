import { MessageForm } from '@/features/message-form';
import { ChatHeader } from '@/widgets/chatheader';

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-grow">
      <ChatHeader />
      {children}
      <MessageForm />
    </div>
  );
}
