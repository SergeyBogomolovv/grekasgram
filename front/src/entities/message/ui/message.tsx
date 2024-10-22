'use client';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/ui/context-menu';
import { MessageEntity } from '../model/message.schema';
import { cn, formatDate } from '@/shared/lib/utils';
import { useDeleteMessage } from '../api/use-delete-message';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  EditMessageFields,
  editMessageSchema,
} from '../model/edit-message.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEditMessage } from '../api/use-edit-message';
import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import ModalImage from '@/shared/ui/modal-image';

interface Props {
  message: MessageEntity;
  userId?: string;
}

export default function MessageCard({ message, userId }: Props) {
  const isMe = message.fromId === userId;
  const { mutate: deleteMessage } = useDeleteMessage(message.id);
  const { mutate: editMessage } = useEditMessage(message.id);

  const [editMode, setEditMode] = useState(false);

  const form = useForm<EditMessageFields>({
    resolver: zodResolver(editMessageSchema),
    defaultValues: { content: message.content },
  });

  const onSubmit = (values: EditMessageFields) => {
    editMessage(values);
    setEditMode(false);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger
        data-testid="message-trigger"
        className={cn('flex flex-col gap-1 md:max-w-[90%]', {
          'self-start': !isMe,
          'self-end': isMe,
        })}
        disabled={message.fromId !== userId}
      >
        {message.imageUrl && (
          <ModalImage
            src={message.imageUrl}
            alt="image"
            width={350}
            height={350}
            className="rounded-lg aspect-auto object-cover"
          />
        )}
        {editMode ? (
          <Form {...form}>
            <form
              className="p-3 rounded-2xl bg-primary text-primary-foreground break-words"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <textarea
                        className="text-foreground bg-transparent focus:outline-none border-none focus:ring-0 resize-none
                        leading-normal w-full"
                        placeholder="Введите сообщение"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2 self-end">
                <Button size="sm" type="submit" variant="secondary">
                  Сохранить
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setEditMode(false);
                    form.reset();
                  }}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div
            className={cn(
              'p-3 rounded-2xl bg-primary text-primary-foreground break-words whitespace-pre-wrap',
              {
                'bg-muted text-foreground': !isMe,
                'bg-primary text-primary-foreground': isMe,
              },
            )}
          >
            {message.content}
          </div>
        )}
        <span
          className={cn('text-xs text-muted-foreground ml-1', {
            'self-end': isMe,
          })}
        >
          {formatDate(message.createdAt)}
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => setEditMode(true)}>
          Редактировать
        </ContextMenuItem>
        <ContextMenuItem onClick={() => deleteMessage()}>
          Удалить
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
