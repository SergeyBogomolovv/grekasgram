'use client';
import { FaPlus } from 'react-icons/fa6';
import { Input } from '@/shared/ui/input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { BsSearch } from 'react-icons/bs';

import { useSearch } from '../model/use-search';
import NavButton from '@/shared/ui/nav-button';
import { Tabs } from '@/shared/lib/tabs';

export default function SearchInput({ currentTab }: { currentTab: Tabs }) {
  const { form, onSubmit } = useSearch();
  return (
    <Form {...form}>
      <form
        data-testid="search-form"
        onSubmit={onSubmit}
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
