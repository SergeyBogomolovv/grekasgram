import TestComponents from '@/features/testcomponent';
import ThemeSwitch from '@/shared/ui/theme-switch';

export default function Home() {
  return (
    <section className="flex-grow flex flex-col items-center justify-between">
      hello world
      <TestComponents />
      <ThemeSwitch />
    </section>
  );
}
