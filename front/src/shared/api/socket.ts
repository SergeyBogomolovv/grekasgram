import { WS_URL } from '@/shared/constants';
import { io } from 'socket.io-client';

export const socket = io(WS_URL, {
  withCredentials: true,
  autoConnect: false,
});
