import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
interface Props {
  error?: string;
}
export default function FormError({ error }: Props) {
  if (!error) return null;

  return (
    <div className="flex w-full items-center p-2 rounded-lg bg-destructive/20 text-sm justify-center text-destructive">
      <ExclamationTriangleIcon />
      <span className="ml-2">{error}</span>
    </div>
  );
}
