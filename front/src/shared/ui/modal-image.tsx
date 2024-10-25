'use client';
import { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '../lib/utils';
import CustomImage from './custom-image';

export default function ModalImage({ src, alt, ...props }: ImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <CustomImage
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
          <CustomImage
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="object-contain max-w-[90%] max-h-[90%] relative rounded-lg cursor-default"
          />
        </div>
      )}
    </>
  );
}
