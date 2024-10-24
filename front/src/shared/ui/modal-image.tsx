'use client';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function ModalImage({ src, alt, ...props }: ImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        onClick={handleOpen}
        {...props}
        className={cn('cursor-pointer', props.className)}
      />
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 cursor-pointer"
          onClick={handleClose}
        >
          <Image
            onClick={(e) => e.stopPropagation()}
            src={src}
            alt={alt}
            width={800}
            height={600}
            className="object-contain max-w-[90%] max-h-[90%] relative rounded-lg cursor-default"
          />
        </div>
      )}
    </>
  );
}
