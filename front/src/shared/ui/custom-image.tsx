'use client';
import Image, { ImageProps } from 'next/image';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function CustomImage({ src, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      width={700}
      height={700}
      {...props}
      className={cn(
        'duration-1000',
        { 'bg-slate-500 animate-pulse': !loaded },
        props.className,
      )}
      onLoad={() => {
        setLoaded(true);
      }}
    />
  );
}
