import { CurrentNavigationBar } from '@/features/navigation';
import { Suspense } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col-reverse md:flex-row">
      <Suspense
        fallback={
          <main className="flex-grow flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">Загружаем приложение...</h1>
          </main>
        }
      >
        <CurrentNavigationBar />
        <main className="flex-grow overflow-y-scroll flex flex-col">
          {children}
        </main>
      </Suspense>
    </div>
  );
}
