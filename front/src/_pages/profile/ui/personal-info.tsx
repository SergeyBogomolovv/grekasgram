import { LogoutButton, User } from '@/entities/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { format } from 'date-fns';
import InformationBlock from '@/shared/ui/information-block';

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
        <LogoutButton>Выйти</LogoutButton>
      </CardFooter>
    </Card>
  );
}
