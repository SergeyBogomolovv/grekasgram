'use client';
import { useSearchParams } from 'next/navigation';
import { tabs, tabsSchema } from '../model/tabs';

export const useCurrentTab = () => {
  const searchParams = useSearchParams();
  const params = tabsSchema.safeParse(searchParams.get('tab'));
  return params.data || tabs.chats;
};
