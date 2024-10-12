import { API_URL } from '@/shared/constants';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get(`${API_URL}/users/me`, () => {
    return HttpResponse.json(
      {
        id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
        username: 'griffit',
        email: 'email@email.com',
        avatarUrl: 'http://',
        about: '123',
        createdAt: 'timestamp',
        online: false,
        lastOnlineAt: 'timestamp',
      },
      { status: 200 },
    );
  }),
];
