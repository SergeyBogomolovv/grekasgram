'use client';
import { cn } from '@/shared/lib/utils';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import Link from 'next/link';
import { Chat } from '@/assets/mocks/cards';
import { format } from 'date-fns';
import { useParams, useSearchParams } from 'next/navigation';
import UserAvatar from '@/shared/ui/user-avatar';

interface Props {
  chat: Chat;
}

const ChatCard = ({ chat }: Props) => {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  return (
    <Link
      href={{ pathname: `/${chat.id}`, query: searchParams.toString() }}
      className={cn(
        'flex justify-between px-6 py-3 cursor-pointer group hover:bg-primary/5 transition-all',
        {
          'bg-primary/10': Number(params.id) === chat.id,
        },
      )}
    >
      <div className="flex items-start gap-x-2 overflow-clip">
        <UserAvatar src="https://github.com/shadcn.png" />
        <div>
          <p className="font-semibold truncate">{chat.name}</p>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {chat.lastMessage}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <button
          aria-label="Настройки чата"
          className="group-hover:block hidden hover:text-primary py-2"
        >
          <HiOutlineDotsHorizontal className="w-6 h-6" />
        </button>
        <p className="text-xs group-hover:hidden">
          {format(chat.lastMessageAt, 'HH:mm')}
        </p>
        {chat.isNew && (
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
