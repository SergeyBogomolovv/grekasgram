import { z } from 'zod';

export const SearchInputSchema = z.object({
  query: z.string(),
});

export type SearchInputFields = z.infer<typeof SearchInputSchema>;
