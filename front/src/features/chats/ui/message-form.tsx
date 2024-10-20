'use client';
import { useForm } from 'react-hook-form';
import { MessageFormFields, messageFormSchema } from '../model/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form';
import { IoSend } from 'react-icons/io5';
import { Button } from '@/shared/ui/button';
import { useCreateMessage } from '@/entities/message/api/use-create-message';

export default function MessageForm({ chatId }: { chatId: string }) {
  const { mutate } = useCreateMessage(chatId);

  const form = useForm<MessageFormFields>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = (data: MessageFormFields) => {
    mutate(data);
    form.reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 border-t-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="w-full flex items-end gap-2 space-y-0">
              <FormControl>
                <textarea
                  className="text-foreground bg-transparent focus:outline-none border-2 border-input focus:ring-0 resize-none
                        leading-normal w-full px-3 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                  onKeyDown={handleKeyDown}
                  placeholder="Введите сообщение"
                  {...field}
                />
              </FormControl>
              <Button
                aria-label="Отправить сообщение"
                type="submit"
                className="aspect-square size-12 rounded-2xl"
                size="icon"
              >
                <IoSend className="size-6" />
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
