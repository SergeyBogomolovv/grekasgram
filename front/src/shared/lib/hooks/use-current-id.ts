import { useParams } from 'next/navigation';

export const useCurrentId = () => {
  return useParams<{ id: string }>().id;
};
