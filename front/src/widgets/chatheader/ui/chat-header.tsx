import UserAvatar from '@/shared/ui/user-avatar';
import { ChatOptions } from '@/features/chat-options';

export default function ChatHeader() {
  return (
    <header className="px-4 py-2 border-b-2 flex items-center justify-between gap-x-2">
      <div className="flex items-center gap-x-2">
        <UserAvatar className="size-12" src="https://github.com/shadcn.png" />
        <div className="flex flex-col">
          <p className="font-bold">John Doe</p>
          <p className="text-sm">Last online yesterday</p>
        </div>
      </div>
      <ChatOptions />
    </header>
  );
}
