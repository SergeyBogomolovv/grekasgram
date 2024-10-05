import TestComponents from '@/features/testcomponent';
import ThemeSwitch from '@/shared/ui/theme-switch';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-between">
      hello world
      <TestComponents />
      <ThemeSwitch />
    </main>
  );
}
