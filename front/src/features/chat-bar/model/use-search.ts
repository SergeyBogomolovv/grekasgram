'use client';

import { SearchInputFields } from './search-input.schema';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const query = searchParams.get('query');

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

  return { onSubmit, query };
};
