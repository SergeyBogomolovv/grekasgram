import UserAvatar from '@/shared/ui/user-avatar';

interface Props {
  name: string;
  about?: string | null;
  avatarUrl?: string | null;
}

export default function UserCard({ name, about, avatarUrl }: Props) {
  return (
    <div className="flex gap-x-2 overflow-clip px-6 py-3 cursor-pointer hover:bg-primary/5 transition-all">
      <UserAvatar src={avatarUrl} />
      <div className="flex flex-col items-start">
        <p className="font-semibold truncate">{name}</p>
        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
          {about || 'Был(а) недавно'}
        </p>
      </div>
    </div>
  );
}
