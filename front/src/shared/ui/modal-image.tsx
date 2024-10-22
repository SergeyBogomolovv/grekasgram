import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
import Image, { ImageProps } from 'next/image';

export default function ModalImage({ src, alt, ...props }: ImageProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Image src={src} alt={alt} {...props} />
      </DialogTrigger>
      <DialogContent className="p-0 m-0 border-0 bg-transparent w-fit">
        <Image src={src} alt={alt} {...props} width={1000} height={1000} />
      </DialogContent>
    </Dialog>
  );
}
