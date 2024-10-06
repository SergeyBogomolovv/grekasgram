import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import UserAvatar from '@/shared/ui/user-avatar';

interface Props {
  name: string;
  about?: string | null;
  avatarUrl?: string | null;
}

export default function UserCard({ name, about, avatarUrl }: Props) {
  return (
    <div className="flex justify-between px-6 py-3 cursor-pointer group hover:bg-primary/5 transition-all">
      <div className="flex items-start gap-x-2 overflow-clip">
        <UserAvatar src={avatarUrl} />
        <div>
          <p className="font-semibold truncate">{name}</p>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {about || 'Был(а) недавно'}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <button
          aria-label="Взаимодействие с пользователем"
          className="hover:text-primary py-2"
        >
          <HiOutlineDotsHorizontal className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
