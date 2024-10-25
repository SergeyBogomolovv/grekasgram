import { ImageProps } from 'next/image';
import { cn } from '../lib/utils';
import CustomImage from './custom-image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default function ModalImage({ src, alt, ...props }: ImageProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <CustomImage
          src={src}
          alt={alt}
          {...props}
          className={cn('cursor-pointer', props.className)}
        />
      </DialogTrigger>
      <DialogContent className="p-0 m-0 border-none bg-transparent flex items-center justify-center shadow-none">
        <VisuallyHidden>
          <DialogTitle>{alt}</DialogTitle>
        </VisuallyHidden>
        <DialogHeader className="max-h-[90vh] overflow-auto flex justify-center">
          <CustomImage
            src={src}
            alt={alt}
            className="object-cover relative rounded-lg max-h-[90vh]"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
