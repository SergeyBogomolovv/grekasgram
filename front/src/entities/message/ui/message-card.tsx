import { formatDate } from '@/shared/lib/utils';
import { cn } from '@/shared/lib/utils/utils';

interface Props {
  isMe: boolean;
  content: string;
  createdAt: string;
}

export default function MessageCard({ isMe, content, createdAt }: Props) {
  return (
    <div
      className={cn('flex flex-col gap-1', {
        'self-start': !isMe,
        'self-end': isMe,
      })}
    >
      <div
        className={cn(
          'p-3 rounded-2xl bg-primary text-primary-foreground break-words',
          {
            'bg-muted text-foreground': !isMe,
            'bg-primary text-primary-foreground': isMe,
          },
        )}
      >
        {content}
      </div>
      <span
        className={cn('text-xs text-muted-foreground ml-1', {
          'self-end': isMe,
        })}
      >
        {formatDate(createdAt)}
      </span>
    </div>
  );
}
