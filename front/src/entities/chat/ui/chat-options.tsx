'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { useRemoveFromFavorites } from '../api/use-remove-from-favorites';
import { useDeleteChat } from '../api/use-delete-chat';
import { useAddToFavorites } from '../api/use-add-to-favorites';
import { useGetFavorites } from '../api/use-get-favorites';
import { useMemo } from 'react';
import ConfirmDialog from '@/shared/ui/confirm-dialog';

interface Props {
  children: React.ReactNode;
  name: string;
  chatId: string;
}

export default function ChatOptions({ children, chatId, name }: Props) {
  const { data: favoriteChats } = useGetFavorites();

  const { mutate: removeFromFavorites } = useRemoveFromFavorites();
  const { mutate: addToFavorites } = useAddToFavorites();
  const { mutate: deleteChat } = useDeleteChat();

  const isInFavorites = useMemo(
    () => favoriteChats?.some((chat) => chat.chatId === chatId),
    [favoriteChats, chatId],
  );

  const handleFavorite = () => {
    if (isInFavorites) {
      removeFromFavorites(chatId);
    } else {
      addToFavorites(chatId);
    }
  };

  const handleDeleteChat = () => {
    deleteChat(chatId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleFavorite}>
          {isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
        </DropdownMenuItem>
        <ConfirmDialog
          onConfirm={handleDeleteChat}
          title={`Вы действительно хотите удалить чат c ${name}?`}
          description="Это действие отменить нельзя, чат удалиться у всех пользователей и сообщения будут потерянны"
          confirmLabel="Подтвердить"
          closeLabel="Отмена"
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Удалить
          </DropdownMenuItem>
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
