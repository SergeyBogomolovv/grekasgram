'use client';
import { useForm } from 'react-hook-form';
import { MessageFormFields, messageFormSchema } from '../model/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form';
import { IoSend } from 'react-icons/io5';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

export default function MessageForm({ chatId }: { chatId: string }) {
  console.log(chatId);

  const form = useForm<MessageFormFields>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: { content: '' },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="p-4 border-t-2 flex items-center gap-2"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  className="min-h-12"
                  placeholder="Введите сообщение"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          aria-label="Отправить сообщение"
          type="submit"
          className="aspect-square size-12 rounded-2xl"
          size="icon"
        >
          <IoSend className="size-6" />
        </Button>
      </form>
    </Form>
  );
}
