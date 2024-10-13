import { SessionEntity } from '@/entities/session';
import { API_URL } from '@/shared/constants';
import { http, HttpResponse } from 'msw';

const mockMessage = { message: 'ok' };
const mockAccessToken = { accessToken: 'test-token' };
const mockSessions: SessionEntity[] = [
  {
    id: '1',
    userId: '1',
    device: 'test-device',
    ip: 'test-ip',
    loginedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '1',
    device: 'test-device',
    ip: 'test-ip',
    loginedAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: '1',
    device: 'test-device',
    ip: 'test-ip',
    loginedAt: new Date().toISOString(),
  },
];

export const authHandlers = [
  http.post(`${API_URL}/auth/login`, () => {
    return HttpResponse.json(mockAccessToken);
  }),
  http.post(`${API_URL}/auth/register`, () => {
    return HttpResponse.json(mockMessage);
  }),
  http.post(`${API_URL}/auth/confirm-email`, () => {
    return HttpResponse.json(mockAccessToken);
  }),
  http.get(`${API_URL}/auth/all-sessions`, () => {
    return HttpResponse.json(mockSessions);
  }),
  http.post(`${API_URL}/auth/logout-from-device/:id`, () => {
    return HttpResponse.json(mockMessage);
  }),
  http.post(`${API_URL}/auth/logout-from-other-device`, () => {
    return HttpResponse.json(mockMessage);
  }),
];
