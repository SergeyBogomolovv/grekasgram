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
import { deleteSession } from '../api/delete-session';
import { logoutFromOtherDevices } from '../api/logout-from-other-devices';
import { toast } from 'sonner';

export default function UserSessionCard({
  session,
  isCurrent,
}: {
  session: SessionEntity;
  isCurrent?: boolean;
}) {
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
        <Button
          variant="destructive"
          onClick={() => {
            if (isCurrent) {
              logoutFromOtherDevices().then(() =>
                toast.success('Вы успешно вышли из других сеансов'),
              );
            } else {
              deleteSession(session.id).then(() =>
                toast.success('Вы успешно завершили сеанс'),
              );
            }
          }}
        >
          {isCurrent ? 'Выйти со всех других устройств' : 'Завершить сеанс'}
        </Button>
      </CardFooter>
    </Card>
  );
}
