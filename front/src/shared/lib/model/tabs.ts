import { z } from 'zod';

export const tabsSchema = z.enum(['chats', 'users']);
export const tabs = tabsSchema.Enum;
export type Tabs = z.infer<typeof tabsSchema>;
