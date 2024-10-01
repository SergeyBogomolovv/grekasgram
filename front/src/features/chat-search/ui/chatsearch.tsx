'use client';
import { FaPlus } from 'react-icons/fa6';
import { NavButton } from '@/features/nav-button';
import { Input } from '@/shared/ui/input';
import { useForm } from 'react-hook-form';
import { ChatSearchFields, chatSearchSchema } from '../model/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/shared/ui/form';
import { useCurrentTab } from '@/entities/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const query = searchParams.get('query');

  const form = useForm<ChatSearchFields>({
    resolver: zodResolver(chatSearchSchema),
    defaultValues: {
      query: query || '',
    },
  });

  const currentTab = useCurrentTab();

  const onSubmit = (data: ChatSearchFields) => {
    const newParams = new URLSearchParams(searchParams);
    if (!data.query) {
      newParams.delete('query');
    } else {
      newParams.set('query', data.query);
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  useEffect(() => {
    form.setValue('query', query || '');
  }, [query, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-2 p-4 border-b-2"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="w-full">
              <div className="flex items-center justify-between w-full">
                <FormLabel className="text-xl font-bold">
                  Поиск {currentTab === 'chats' && 'чатов'}
                  {currentTab === 'favorites' && 'избранных'}
                  {currentTab === 'users' && 'пользователей'}
                </FormLabel>
                <NavButton
                  className="size-8"
                  tab="users"
                  label="Добавить чат"
                  buttonSize="sm"
                >
                  <FaPlus className="size-4" />
                </NavButton>
              </div>
              <FormControl>
                <Input {...field} placeholder="Поиск..." />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
