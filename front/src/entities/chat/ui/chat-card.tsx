'use client';
import { cn } from '@/shared/lib/utils/utils';
import Link from 'next/link';
import { format } from 'date-fns';
import { useParams, useSearchParams } from 'next/navigation';
import UserAvatar from '@/shared/ui/user-avatar';
import { ChatPreview } from '../model/chat.schema';

const ChatCard = ({ chat }: { chat: ChatPreview }) => {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  return (
    <Link
      href={{ pathname: `/${chat.chatId}`, query: searchParams.toString() }}
      className={cn(
        'flex justify-between px-6 py-3 cursor-pointer hover:bg-primary/5 transition-all gap-4',
        {
          'bg-primary/10': params.id === chat.chatId,
        },
      )}
    >
      <div className="flex items-start gap-x-2 overflow-clip">
        <UserAvatar src={chat.companionAvatarUrl} />
        <div>
          <p className="font-semibold truncate">{chat.companionUsername}</p>
          <p className="text-sm text-muted-foreground truncate max-w-[150px]">
            {chat.lastMessage || 'Сообщений пока нет'}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <p className="text-xs">
          {format(chat.lastMessageAt || chat.createdAt, 'HH:mm')}
        </p>
        {!!chat.newMessages && (
          <p
            className={cn(
              'rounded-full text-white text-xs bg-primary w-5 h-5 flex justify-center items-center',
            )}
          >
            {chat.newMessages}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ChatCard;
