'use client';
import { useGetProfile } from '@/entities/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/shared/ui/card';
import { format } from 'date-fns';
import { LogoutButton } from '@/features/auth';
import InformationBlock from '@/shared/ui/information-block';

export default function PersonalInfo() {
  const { data, isLoading } = useGetProfile();
  return (
    <section className="flex flex-col gap-4 w-full">
      <h3 className="font-bold text-2xl">Персональная информация</h3>
      <Card>
        <CardHeader>
          <CardDescription>
            Информация, которая не видна другим пользователям
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          <InformationBlock
            label="ID:"
            content={isLoading ? '...' : data?.id}
          />
          <InformationBlock
            label="Email:"
            content={isLoading ? '...' : data?.email}
          />
          <InformationBlock
            label="Зарегистрирован:"
            content={
              isLoading ? '...' : format(data?.createdAt || 0, 'dd.MM.yyyy')
            }
          />
        </CardContent>
        <CardFooter>
          <LogoutButton>Выйти</LogoutButton>
        </CardFooter>
      </Card>
    </section>
  );
}
