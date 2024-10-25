import Image, { ImageProps } from 'next/image';
import { cn } from '../lib/utils';

export default function CustomImage({ src, alt, ...props }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={700}
      height={700}
      {...props}
      className={cn(
        'bg-slate-500 animate-pulse duration-1000',
        props.className,
      )}
      onLoadingComplete={(image) => {
        image.classList.remove(
          'bg-slate-500',
          'animate-pulse',
          'duration-1000',
        );
      }}
    />
  );
}
