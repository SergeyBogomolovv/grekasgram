import { FaUserCircle } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface Props {
  className?: string;
  imageClassName?: string;
  src: string;
}

export default function UserAvatar({ className, src, imageClassName }: Props) {
  return (
    <Avatar className={className}>
      <AvatarImage
        className={imageClassName}
        src={src}
        alt="Аватар пользователя"
      />
      <AvatarFallback>
        <FaUserCircle className="size-full" />
      </AvatarFallback>
    </Avatar>
  );
}
