import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { SlOptions } from 'react-icons/sl';

export default function ChatOptions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild aria-label="Опции чата">
        <Button variant="outline" size="icon">
          <SlOptions className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>John Doe</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Настройки</DropdownMenuItem>
        <DropdownMenuItem>Удалить</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
