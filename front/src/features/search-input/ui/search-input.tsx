'use client';
import { FaPlus } from 'react-icons/fa6';
import { NavButton } from '@/features/nav-button';
import { Input } from '@/shared/ui/input';
import { useForm } from 'react-hook-form';
import { SearchInputSchema, SearchInputFields } from '../model/schema';
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
import { Button } from '@/shared/ui/button';
import { BsSearch } from 'react-icons/bs';

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const query = searchParams.get('query');

  const form = useForm<SearchInputFields>({
    resolver: zodResolver(SearchInputSchema),
    defaultValues: {
      query: query || '',
    },
  });

  const currentTab = useCurrentTab();

  const onSubmit = (data: SearchInputFields) => {
    const newParams = new URLSearchParams(searchParams);
    if (!data.query) {
      newParams.delete('query');
    } else {
      newParams.set('query', data.query);
    }
    const paramsString = newParams.toString();
    const url = paramsString ? `${pathname}?${paramsString}` : pathname;

    router.push(url);
  };

  useEffect(() => {
    form.setValue('query', query || '');
  }, [query, form]);

  return (
    <Form {...form}>
      <form
        data-testid="search-form"
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
                  {currentTab === 'groups' && 'групп'}
                  {currentTab === 'users' && 'пользователей'}
                </FormLabel>
                <NavButton
                  toolipSide="bottom"
                  className="size-8"
                  tab="users"
                  label="Добавить чат"
                  buttonSize="sm"
                >
                  <FaPlus className="size-4" />
                </NavButton>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  aria-label="Поиск"
                  size="icon"
                  variant="outline"
                  className="aspect-square"
                >
                  <BsSearch className="size-4" />
                </Button>
                <FormControl>
                  <Input
                    data-testid="search-input"
                    {...field}
                    placeholder="Поиск..."
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
