import { PersonalInfo, ProfileForm } from '@/features/profile';
import { SessionsList } from '@/entities/session';

export default async function ProfilePage() {
  return (
    <section className="flex-grow flex flex-col overflow-y-scroll gap-10 items-center lg:p-10 md:p-8 sm:p-6 p-4">
      <h1 className="text-3xl font-bold self-start">Ваша учетная запись</h1>
      <ProfileForm />
      <SessionsList />
      <PersonalInfo />
    </section>
  );
}
