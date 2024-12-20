import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { UseFormReturn } from 'react-hook-form';
import { MessageFormFields } from '../model/schema';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import Image from 'next/image';
import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { ImAttachment } from 'react-icons/im';
import { IoSend } from 'react-icons/io5';

interface Props {
  form: UseFormReturn<MessageFormFields>;
  imagePreview: string | null;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  sendMessage: (data: MessageFormFields) => void;
  fileInputRef: MutableRefObject<HTMLInputElement | null>;
  setImagePreview: Dispatch<SetStateAction<string | null>>;
  isPending: boolean;
}

export default function ModalForm({
  form,
  imagePreview,
  isModalOpen,
  setIsModalOpen,
  fileInputRef,
  setImagePreview,
  sendMessage,
  isPending,
}: Props) {
  const onSubmit = (data: MessageFormFields) => {
    sendMessage(data);
    form.reset();
    setIsModalOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog
      onOpenChange={() => {
        setIsModalOpen(false);
        form.reset();
        setImagePreview(null);
      }}
      open={isModalOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Прикрепить файл</DialogTitle>
        </DialogHeader>
        <Image
          width={500}
          height={500}
          src={imagePreview || ''}
          alt="Image"
          className="rounded-lg aspect-square object-cover"
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
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
                      autoFocus
                      onKeyDown={handleKeyDown}
                      data-testid="modal-message-input"
                      className="text-foreground bg-transparent focus:outline-none border-2 border-input focus:ring-0 resize-none
                        leading-normal w-full px-3 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
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
              disabled={isPending}
            >
              <IoSend className="size-6" />
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
