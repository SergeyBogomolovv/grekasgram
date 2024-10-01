export interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  lastMessageAt: Date;
  isNew?: boolean;
  newMessages?: number;
}

export const chats: Chat[] = [
  {
    id: 1,
    name: 'Шарипова Амина',
    lastMessage: 'Hello do you know this',
    lastMessageAt: new Date(),
    isNew: true,
    newMessages: 2,
  },
  {
    id: 2,
    name: 'Письмак Виктория',
    lastMessage: 'Hello do you know this',
    lastMessageAt: new Date(),
    isNew: true,
    newMessages: 3,
  },
  {
    id: 3,
    name: 'Гришина Ксения',
    lastMessage: 'Hello do you know this',
    lastMessageAt: new Date(),
  },
  {
    id: 4,
    name: 'Ермолов Егор',
    lastMessage: 'Hello do you know this',
    lastMessageAt: new Date(),
  },
];

export const favorites: Chat[] = [
  {
    id: 1,
    name: 'Jane Doe',
    lastMessage: 'Hi, how are you?',
    lastMessageAt: new Date(),
    isNew: true,
    newMessages: 2,
  },
  {
    id: 2,
    name: 'Jane Doe',
    lastMessage: 'Hello',
    lastMessageAt: new Date(),
  },
];

interface User {
  id: number;
  name: string;
  about: string;
}

export const users: User[] = [
  {
    id: 1,
    name: 'Genry Boris',
    about: 'lorem ipsum',
  },
  {
    id: 2,
    name: 'Jane Doe',
    about: 'lorem ipsum',
  },
];
