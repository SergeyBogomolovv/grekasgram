import { getSessions } from '../api/get-sessions';
import UserSessionCard from './user-session-card';

export default async function SessionsList() {
  const data = await getSessions();
  return (
    <section className="flex flex-col gap-4 w-full">
      <h3 className="font-bold text-2xl">Управление сеансами</h3>
      <div className="flex flex-col gap-4">
        {data.currentSession && (
          <UserSessionCard session={data.currentSession} isCurrent />
        )}
        {data.sessions.map((session) => (
          <UserSessionCard key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
}
