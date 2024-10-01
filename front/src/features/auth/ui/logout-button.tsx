'use client';
import { useLogout } from '../hooks/use-logout';

import { Button, ButtonProps } from '@/shared/ui/button';

export default function LogoutButton(props: ButtonProps) {
  const { mutate, isPending } = useLogout();
  return (
    <Button {...props} disabled={isPending} onClick={() => mutate()}>
      {props.children}
    </Button>
  );
}
