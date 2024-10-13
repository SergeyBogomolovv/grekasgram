import { WS_URL } from '@/shared/constants';
import { io } from 'socket.io-client';
import { getAccessToken } from '../lib/utils';

export const socket = io(WS_URL, {
  withCredentials: true,
  autoConnect: false,
  async auth(cb) {
    const accessToken = await getAccessToken();
    cb({ accessToken });
  },
});
