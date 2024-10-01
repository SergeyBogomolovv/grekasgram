'use client';
import { useForm } from 'react-hook-form';
import { MessageFormFields, messageFormSchema } from '../model/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form';
import { IoSend } from 'react-icons/io5';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export default function MessageForm() {
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
                <Input placeholder="Введите сообщение" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          aria-label="Отправить сообщение"
          type="submit"
          className="aspect-square"
          size="icon"
        >
          <IoSend className="size-5" />
        </Button>
      </form>
    </Form>
  );
}
