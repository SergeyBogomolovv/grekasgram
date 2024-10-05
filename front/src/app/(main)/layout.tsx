import { Chatbar } from '@/widgets/chatbar';
import { Navbar } from '@/widgets/navbar';
import { Suspense } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Suspense
        fallback={
          <main className="flex-grow flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">Загружаем приложение...</h1>
          </main>
        }
      >
        <Navbar />
        <Chatbar />
        <main className="flex-grow overflow-y-scroll flex flex-col">
          {children}
        </main>
      </Suspense>
    </div>
  );
}
