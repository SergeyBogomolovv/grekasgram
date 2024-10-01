import { CheckCircledIcon } from '@radix-ui/react-icons';

interface Props {
  message?: string;
}

export default function FormSuccess({ message }: Props) {
  if (!message) return null;

  return (
    <div className="flex w-full items-center p-2 rounded-lg bg-emerald-500/20 text-sm justify-center text-emerald-500">
      <CheckCircledIcon />
      <span className="ml-2">{message}</span>
    </div>
  );
}
