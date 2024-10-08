'use client';
import { Button, ButtonProps } from '@/shared/ui/button';
import { useLogout } from '../api/use-logout';

export default function LogoutButton(props: ButtonProps) {
  const { mutate, isPending } = useLogout();
  return (
    <Button
      variant="destructive"
      {...props}
      onClick={() => mutate()}
      disabled={isPending}
    >
      {props.children}
    </Button>
  );
}
