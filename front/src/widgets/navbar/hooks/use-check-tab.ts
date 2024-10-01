import { tabs, tabsSchema } from '@/entities/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const useCheckTab = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const currTab = searchParams.get('tab');
    const parsed = tabsSchema.safeParse(currTab);
    const params = new URLSearchParams(searchParams);
    if (!parsed.success) {
      params.set('tab', tabs.chats);
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [pathname, searchParams, router]);
};
