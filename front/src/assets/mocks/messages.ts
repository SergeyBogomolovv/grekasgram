export interface IMessage {
  id: number;
  chatId: number;
  content: string;
  from: string;
  at: string;
}

export const messages: IMessage[] = [
  {
    id: 1,
    chatId: 1,
    content: 'Hello',
    from: 'me',
    at: new Date().toISOString(),
  },
  {
    id: 2,
    chatId: 1,
    content: 'Hi, how are you?',
    from: 'user',
    at: new Date().toISOString(),
  },
  {
    id: 3,
    chatId: 2,
    content: 'Hello my bro',
    from: 'user',
    at: new Date().toISOString(),
  },
  {
    id: 4,
    chatId: 2,
    content: "Whats'up? How are you?",
    from: 'me',
    at: new Date().toISOString(),
  },
  {
    id: 5,
    chatId: 2,
    content: "Thx, I'm fine!",
    at: new Date().toISOString(),
    from: 'user',
  },
  {
    id: 6,
    chatId: 2,
    content: "Don't you wanna go for a walk?",
    from: 'user',
    at: new Date().toISOString(),
  },
];
