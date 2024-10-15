'use client';
import { useSearchUsers } from '@/entities/user';
import { useSearchParams } from 'next/navigation';
import UserButton from './user-button';

export default function UsersList() {
  const searchParams = useSearchParams();

  const query = searchParams.get('query');

  const { data, isLoading } = useSearchUsers(query);

  return (
    <div className="w-full flex flex-col divide-y-2 overflow-y-auto">
      {isLoading && (
        <p className="text-center text-muted-foreground font-mono p-3">
          Загрузка...
        </p>
      )}
      {data?.length === 0 && (
        <p className="text-center text-muted-foreground font-mono p-3">
          Пользователи не найдены
        </p>
      )}
      {!query && (
        <p className="text-center text-muted-foreground font-mono p-3">
          Ищите пользователей, с которыми хотели бы пообщаться
        </p>
      )}
      {data?.map((user) => <UserButton key={user.id} user={user} />)}
    </div>
  );
}
