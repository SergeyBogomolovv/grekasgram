import { FaUserCircle } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { cn } from '../lib/utils';

interface Props {
  className?: string;
  imageClassName?: string;
  src?: string | null;
}

export default function UserAvatar({ className, src, imageClassName }: Props) {
  return (
    <Avatar className={cn(className, 'aspect-square')}>
      <AvatarImage
        className={cn(imageClassName, 'object-cover')}
        src={src || ''}
        alt="Аватар пользователя"
      />
      <AvatarFallback>
        <FaUserCircle aria-label="Аватар пользователя" className="size-full" />
      </AvatarFallback>
    </Avatar>
  );
}
