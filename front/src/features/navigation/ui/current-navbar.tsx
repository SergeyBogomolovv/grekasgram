'use client';
import { useMediaQuery } from '@/shared/lib/use-media-query';
import Sidebar from './sidebar';
import MobileFooter from './mobile-footer';
import { Chatbar } from '@/features/chat-bar';

export default function CurrentNavigationBar() {
  const isMediumScreen = useMediaQuery('(min-width: 768px)');
  if (isMediumScreen)
    return (
      <>
        <Sidebar />
        <Chatbar />
      </>
    );
  return <MobileFooter />;
}
