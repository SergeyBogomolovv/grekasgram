'use client';
import { useGetSessions } from '../api/use-get-sessions';
import UserSessionCard from './user-session-card';

export default function SessionsList() {
  const { data } = useGetSessions();

  return (
    <section className="flex flex-col gap-4 w-full">
      <h3 className="font-bold text-2xl">Управление сеансами</h3>
      <div className="flex flex-col gap-4">
        {/* TODO: loading state */}
        {data?.current && <UserSessionCard session={data.current} isCurrent />}
        {data?.other.map((session) => (
          <UserSessionCard key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
}
