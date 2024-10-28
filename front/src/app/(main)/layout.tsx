import { SocketProvider } from '@/config/providers';
import { Chatbar } from '@/features/chat-bar';
import { MobileFooter, Sidebar } from '@/features/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <main className="flex min-h-[100svh] flex-col-reverse md:flex-row">
        <Sidebar />
        <Chatbar className="md:flex hidden" />
        <MobileFooter />
        {children}
      </main>
    </SocketProvider>
  );
}
