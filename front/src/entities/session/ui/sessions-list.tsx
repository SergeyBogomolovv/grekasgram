'use client';
import { useGetSessions } from '../api/use-get-sessions';
import UserSessionCard from './user-session-card';

export default function SessionsList() {
  const { data, isLoading } = useGetSessions();

  return (
    <section className="flex flex-col gap-4 w-full">
      <h3 className="font-bold text-2xl">Управление сеансами</h3>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <h3 className="font-bold text-2xl">Загрузка...</h3>
        ) : (
          <>
            {data ? (
              <>
                <UserSessionCard session={data.current} isCurrent />
                {data.other.map((session) => (
                  <UserSessionCard key={session.id} session={session} />
                ))}
              </>
            ) : (
              <h3 className="font-bold text-2xl">Сеансов нет</h3>
            )}
          </>
        )}
      </div>
    </section>
  );
}
