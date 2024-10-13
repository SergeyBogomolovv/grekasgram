'use client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { SessionEntity } from '../model/session.schema';
import { Button } from '@/shared/ui/button';
import InformationBlock from '@/shared/ui/information-block';
import { format } from 'date-fns';
import { useDeleteSession } from '../api/use-delete-session';
import { useLogoutFromOtherDevices } from '../api/use-logout-from-other-devices';

export default function UserSessionCard({
  session,
  isCurrent,
}: {
  session: SessionEntity;
  isCurrent?: boolean;
}) {
  const { mutate: deleteSession } = useDeleteSession();
  const { mutate: logoutFromOtherDevices } = useLogoutFromOtherDevices();

  function clickHandler() {
    if (isCurrent) {
      logoutFromOtherDevices();
    } else {
      deleteSession(session.id);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isCurrent ? 'Это устройство' : 'Сеанс'}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <InformationBlock label="IP адрес:" content={session.ip} />
        <InformationBlock label="Устройство:" content={session.device} />
        <InformationBlock
          label="Вход в систему:"
          content={format(session.loginedAt, 'dd.MM.yyyy')}
        />
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={clickHandler}>
          {isCurrent ? 'Выйти со всех других устройств' : 'Завершить сеанс'}
        </Button>
      </CardFooter>
    </Card>
  );
}
