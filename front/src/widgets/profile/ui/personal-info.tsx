import { User } from '@/entities/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import InformationBlock from './information-block';
import { format } from 'date-fns';
import { LogoutButton } from '@/features/auth';

export default function PersonalInfo({ user }: { user: User }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Персональная информация</CardTitle>
        <CardDescription>
          Информация, которая не видна другим пользователям
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        <InformationBlock label="ID:" content={user.id} />
        <InformationBlock label="Email:" content={user.email} />
        <InformationBlock
          label="Зарегистрирован:"
          content={format(user.createdAt || 0, 'dd.MM.yyyy')}
        />
      </CardContent>
      <CardFooter>
        <LogoutButton variant="destructive">Выйти</LogoutButton>
      </CardFooter>
    </Card>
  );
}
