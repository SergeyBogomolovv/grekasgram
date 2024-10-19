import MessageUI from './message-card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/ui/context-menu';
import { MessageEntity } from '../model/message.schema';

interface Props {
  message: MessageEntity;
  userId?: string;
}

export default function Message({ message, userId }: Props) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild disabled={message.fromId !== userId}>
        <MessageUI
          isMe={message.fromId === userId}
          content={message.content}
          createdAt={message.createdAt}
        />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Редактировать</ContextMenuItem>
        <ContextMenuItem>Удалить</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
