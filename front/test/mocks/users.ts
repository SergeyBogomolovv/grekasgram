import { User } from '@/entities/user';
import { API_URL } from '@/shared/constants';
import { http, HttpResponse } from 'msw';

const mockUsers: User[] = [
  {
    id: '1',
    username: 'sergey',
    email: 'email@email.com',
    avatarUrl: 'http://',
    about: '123',
    createdAt: 'timestamp',
    online: false,
    lastOnlineAt: 'timestamp',
  },
  {
    id: '2',
    username: 'gerax',
    email: 'email@email.com',
    avatarUrl: 'http://',
    about: '123',
    createdAt: 'timestamp',
    online: false,
    lastOnlineAt: 'timestamp',
  },
  {
    id: '3',
    username: 'grekos',
    email: 'email@email.com',
    avatarUrl: 'http://',
    about: '123',
    createdAt: 'timestamp',
    online: false,
    lastOnlineAt: 'timestamp',
  },
];

export const userHandlers = [
  http.get(`${API_URL}/users/me`, () => {
    return HttpResponse.json(mockUsers[0]);
  }),
  http.post(`${API_URL}/users/update-profile`, async ({ request }) => {
    const body = (await request.json()) as any;
    mockUsers[0] = { ...mockUsers[0], ...body };
    return HttpResponse.json(mockUsers[0], { status: 201 });
  }),
  http.get(`${API_URL}/users/search`, ({ request }) => {
    const query = new URL(request.url).searchParams.get('query');
    return HttpResponse.json(
      mockUsers.filter((user) => user.username.includes(query || '')),
    );
  }),
];
