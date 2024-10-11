import { CurrentNavigationBar } from '@/features/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen flex-col-reverse md:flex-row">
      <CurrentNavigationBar />
      {children}
    </main>
  );
}
