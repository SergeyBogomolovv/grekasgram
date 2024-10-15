import { DialogClose } from '@radix-ui/react-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Button } from './button';

interface Props {
  children: React.ReactNode;
  title: string;
  description?: string;
  onConfirm: () => void;
  closeLabel: string;
  confirmLabel: string;
}

export default function ConfirmDialog({
  children,
  title,
  description,
  onConfirm,
  closeLabel,
  confirmLabel,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-[#ededed] dark:bg-[#0a0a0a]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {!!description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {closeLabel}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="destructive" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
