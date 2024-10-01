'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { LogoutButton } from './auth';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { socket } from '@/shared/config/socket';

export default function TestComponents() {
  useEffect(() => {
    socket.connect();

    socket.on('response', () => {
      toast.success('message recieved');
    });

    socket.on('exception', () => {
      console.log('error');
    });

    return () => {
      socket.off('exception');
      socket.off('response');
      socket.disconnect();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Socket test</CardTitle>
      </CardHeader>
      <CardContent>Some content</CardContent>
      <CardFooter>
        <Button
          onClick={() => {
            socket.emit('test', { data: 'hello' });
          }}
        >
          Send message to server
        </Button>
        <LogoutButton variant="destructive">Logout</LogoutButton>
      </CardFooter>
    </Card>
  );
}
