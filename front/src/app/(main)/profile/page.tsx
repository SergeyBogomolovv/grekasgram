import { getUser } from '@/entities/user';
import { PersonalInfo } from '@/widgets/profile';
import PublicInfo from '@/widgets/profile/ui/public-info';

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <section className="flex flex-col gap-10 items-center w-full lg:p-10 md:p-8 sm:p-6 p-4">
      <h1 className="text-3xl font-bold self-start">Ваша учетная запись</h1>
      <PublicInfo user={user} />
      <PersonalInfo user={user} />
    </section>
  );
}
