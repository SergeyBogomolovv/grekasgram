import { Chatbar } from '@/widgets/chatbar';
import { Navbar } from '@/widgets/navbar';
import { Suspense } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen">
      <Suspense>
        <Navbar />
        <Chatbar />
        {children}
      </Suspense>
    </main>
  );
}
