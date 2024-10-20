import { CurrentNavigationBar } from '@/features/navigation';
// import { headers } from 'next/headers';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const isMobile = /mobile/i.test(headers().get('user-agent') || '');

  return (
    <main className="flex h-screen flex-col-reverse md:flex-row">
      <CurrentNavigationBar />
      {children}
    </main>
  );
}
