import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import Image, { ImageProps } from 'next/image';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default function ModalImage({ src, alt, ...props }: ImageProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Image src={src} alt={alt} {...props} />
      </DialogTrigger>
      <DialogContent className="p-0 m-0 border-0 bg-transparent w-fit">
        <VisuallyHidden>
          <DialogTitle>Картинка</DialogTitle>
        </VisuallyHidden>
        <Image src={src} alt={alt} {...props} width={1000} height={1000} />
      </DialogContent>
    </Dialog>
  );
}
