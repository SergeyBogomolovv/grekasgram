import { tabs, tabsSchema } from '@/entities/tabs';
import { useSearchParams } from 'next/navigation';

export const useCurrentTab = () => {
  const searchParams = useSearchParams();
  const params = tabsSchema.safeParse(searchParams.get('tab'));
  return params.data || tabs.chats;
};
