import { SearchInput } from '@/features/search-input';
import CurrentTab from './current-tab';

export default function Chatbar() {
  return (
    <aside className="w-[300px] hidden md:flex border-r-2 flex-col items-center max-w-screen">
      <SearchInput />
      <CurrentTab />
    </aside>
  );
}
