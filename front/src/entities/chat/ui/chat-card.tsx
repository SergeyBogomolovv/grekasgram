'use client';
import { cn } from '@/shared/lib/utils/utils';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import Link from 'next/link';
import { format } from 'date-fns';
import { useParams, useSearchParams } from 'next/navigation';
import UserAvatar from '@/shared/ui/user-avatar';
import ChatOptions from './chat-options';
import { Chat } from '../model/chat.schema';

const ChatCard = ({ chat }: { chat: Chat }) => {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  return (
    <Link
      href={{ pathname: `/${chat.id}`, query: searchParams.toString() }}
      className={cn(
        'flex justify-between px-6 py-3 cursor-pointer group hover:bg-primary/5 transition-all gap-4',
        {
          'bg-primary/10': params.id === chat.id,
        },
      )}
    >
      <div className="flex items-start gap-x-2 overflow-clip">
        <UserAvatar src={chat.companion.avatarUrl} />
        <div>
          <p className="font-semibold truncate">{chat.companion.username}</p>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {chat.lastMessage?.content || 'Сообщений пока нет'}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <ChatOptions>
          <button
            aria-label="Опции чата"
            className="group-hover:block hidden hover:text-primary py-2"
          >
            <HiOutlineDotsHorizontal className="w-6 h-6" />
          </button>
        </ChatOptions>
        <p className="text-xs group-hover:hidden">
          {format(chat.lastMessage?.createdAt || chat.createdAt, 'HH:mm')}
        </p>
        {chat.newMessages && (
          <p
            className={cn(
              'rounded-full group-hover:hidden text-white text-xs bg-primary w-5 h-5 flex justify-center items-center',
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
