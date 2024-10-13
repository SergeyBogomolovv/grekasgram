'use client';
import { useMediaQuery } from '@/shared/lib/hooks';
import Sidebar from './sidebar';
import MobileFooter from './mobile-footer';
import { Chatbar } from '@/features/chat-bar';

export default function CurrentNavigationBar() {
  const isMediumScreen = useMediaQuery('(min-width: 768px)');

  return (
    <>
      {isMediumScreen ? (
        <>
          <Sidebar />
          <Chatbar />
        </>
      ) : (
        <MobileFooter />
      )}
    </>
  );
}
