'use client';
import { UserCard, useSearchUsers } from '@/entities/user';
import { useSearchParams } from 'next/navigation';
import { UserProfile } from '@/features/user-profile';

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
      {data?.map((user) => (
        <UserProfile key={user.id} userId={user.id}>
          <UserCard
            name={user.username}
            about={user.about}
            avatarUrl={user.avatarUrl}
          />
        </UserProfile>
      ))}
    </div>
  );
}
