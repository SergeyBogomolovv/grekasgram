'use client';
import { useForm } from 'react-hook-form';
import { MessageFormFields, messageFormSchema } from '../model/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form';
import { IoSend } from 'react-icons/io5';
import { Button } from '@/shared/ui/button';
import { useRef, useState } from 'react';
import { ImAttachment } from 'react-icons/im';
import { useSendMessage } from '../api/use-send-message';
import ModalForm from './modal-form';

export default function MessageForm({ chatId }: { chatId: string }) {
  const sendMessage = useSendMessage(chatId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<MessageFormFields>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = (data: MessageFormFields) => {
    sendMessage(data);
    form.reset();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!isModalOpen) setIsModalOpen(true);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      form.setValue('image', file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Form {...form}>
      <ModalForm
        sendMessage={sendMessage}
        setImagePreview={setImagePreview}
        setIsModalOpen={setIsModalOpen}
        imagePreview={imagePreview}
        isModalOpen={isModalOpen}
        form={form}
        fileInputRef={fileInputRef}
      />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-4 border-t-2 flex gap-2"
      >
        <input
          data-testid="image-input"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          hidden
          onChange={handleImageChange}
          aria-hidden="true"
          tabIndex={-1}
        />
        <Button
          aria-label="Прикрепить файл"
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square size-11 rounded-xl"
          size="icon"
        >
          <ImAttachment className="size-6" />
        </Button>

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
            </FormItem>
          )}
        />
        <Button
          aria-label="Отправить сообщение"
          type="submit"
          className="aspect-square size-11 rounded-xl"
          size="icon"
        >
          <IoSend className="size-6" />
        </Button>
      </form>
    </Form>
  );
}
