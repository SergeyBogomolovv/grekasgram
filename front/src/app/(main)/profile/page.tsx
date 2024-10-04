import { PersonalInfo } from '@/widgets/profile';

export default function ProfilePage() {
  return (
    <section className="flex flex-col gap-10 items-center w-full lg:p-10 md:p-8 sm:p-6 p-4">
      <PersonalInfo />
    </section>
  );
}
