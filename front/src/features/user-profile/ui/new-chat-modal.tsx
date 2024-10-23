'use client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { useForm } from 'react-hook-form';
import { NewChatForm, newChatFormSchema } from '../model/form.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form';
import { useCreateChat } from '@/entities/chat';
import { Button } from '@/shared/ui/button';
import { PublicUser } from '@/entities/user';
import { useRouter } from 'next/navigation';

interface Props {
  children: React.ReactNode;
  user: PublicUser;
}

export default function NewChatModal({ children, user }: Props) {
  const form = useForm<NewChatForm>({
    resolver: zodResolver(newChatFormSchema),
    defaultValues: { content: '' },
  });

  const router = useRouter();

  const { mutateAsync, isPending } = useCreateChat();

  const onSubmit = (data: NewChatForm) => {
    mutateAsync({ content: data.content, companionId: user.id })
      .then((data) => {
        router.push(`/${data.chatId}`);
      })
      .catch(() => {
        form.setError('content', {
          message: 'Что-то пошло не так',
          type: 'custom',
        });
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый чат с {user.username}</DialogTitle>
          <DialogDescription>
            Напишите первое сообщение пользователю {user.username}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <textarea
                      className="text-foreground bg-transparent focus:outline-none border-2 border-input focus:ring-0 resize-none
                        leading-normal w-full px-3 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                      onKeyDown={handleKeyDown}
                      placeholder="Введите сообщение"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isPending} type="button" variant="secondary">
                  Отмена
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                Отправить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
