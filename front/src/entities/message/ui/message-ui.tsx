import { cn } from '@/shared/lib/utils';

interface Props {
  isMe: boolean;
  content: string;
}

export default function MessageUI({ isMe, content }: Props) {
  return (
    <div
      className={cn('flex flex-col gap-1', {
        'self-start': !isMe, //MOCK
        'self-end': isMe,
      })}
    >
      <div
        className={cn(
          'p-3 rounded-2xl bg-primary text-primary-foreground break-words',
          {
            'bg-muted text-foreground': !isMe, //MOCK
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
        10:41
      </span>
    </div>
  );
}
