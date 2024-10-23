import ThemeSwitch from '@/shared/ui/theme-switch';
import ProfileButton from './profile-button';
import Navbar from './navbar';

export default function Sidebar() {
  return (
    <aside className="md:flex flex-col p-2 gap-2 items-center justify-between border-r-2 hidden">
      <Navbar />
      <div className="flex flex-col gap-2">
        <ThemeSwitch />
        <ProfileButton />
      </div>
    </aside>
  );
}
