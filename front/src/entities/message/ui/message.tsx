import { IMessage } from '@/assets/mocks/messages';
import MessageUI from './message-card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/ui/context-menu';

interface Props {
  message: IMessage;
}

export default function Message({ message }: Props) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild disabled={message.from !== 'me'}>
        <MessageUI isMe={message.from === 'me'} content={message.content} />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Редактировать</ContextMenuItem>
        <ContextMenuItem>Удалить</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
