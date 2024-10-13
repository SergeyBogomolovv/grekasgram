'use client';
import { useGetProfile, useUpdateProfile } from '@/entities/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { useForm } from 'react-hook-form';
import {
  ProfileFormFields,
  profileFormSchema,
} from '../model/profile-form.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import AvatarInput from './avatar-input';
import { useEffect } from 'react';

export default function ProfileForm() {
  const { data: user } = useGetProfile();

  const form = useForm<ProfileFormFields>({
    resolver: zodResolver(profileFormSchema),
  });

  const { mutate, isPending } = useUpdateProfile();

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        about: user.about || '',
      });
    }
  }, [user, form]);

  return (
    <Form {...form}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Публичная информация</CardTitle>
          <CardDescription>
            Информация, которая доступна другим пользователям
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit((data) => mutate(data))}>
          <CardContent className="flex gap-4 sm:flex-row flex-col items-start">
            <AvatarInput form={form} avatarUrl={user?.avatarUrl} />

            <div className="flex flex-col gap-y-2 w-full">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Имя пользователя" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="h-fit"
                        placeholder="Обо мне"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              Сохранить
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}
