'use client';
import { UserCard } from '@/entities/user';
import { useSearchUsers } from '../hooks/use-search-users';
import { useSearchParams } from 'next/navigation';

export default function UsersList() {
  const searchParams = useSearchParams();

  const query = searchParams.get('query');

  const { data, isLoading } = useSearchUsers(query);

  return (
    <div className="w-full flex flex-col divide-y-2">
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
      {data?.map((user) => (
        <UserCard
          key={user.id}
          name={user.username}
          about={user.about}
          avatarUrl={user.avatarUrl}
        />
      ))}
    </div>
  );
}
