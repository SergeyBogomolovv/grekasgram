'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRegister } from '../api/use-register';
import { RegisterFields, registerFieldsSchema } from '../model/response.schema';

import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import FormError from '@/shared/ui/form-error';
import FormSuccess from '@/shared/ui/form-success';
import { Input } from '@/shared/ui/input';

export default function RegisterForm() {
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const form = useForm<RegisterFields>({
    resolver: zodResolver(registerFieldsSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const { mutate, isPending } = useRegister(form, setSuccessMessage);

  const onSubmit = form.handleSubmit((data) => mutate(data));

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="mx-auto flex flex-col w-[450px] gap-6 max-w-[90%]"
      >
        <div className="text-center flex flex-col gap-y-4">
          <h1 className="text-4xl font-bold">Добро пожаловать!</h1>
          <p className="text-sm text-muted-foreground">
            Рады видеть вас в online chat, пожалуйста, введите данные для
            регистрации
          </p>
        </div>
        <div className="flex flex-col gap-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="additional-name"
                    placeholder="Ваше имя"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ваше имя будет доступно всем пользователям
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="email@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="******"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Придумайте надежный пароль</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            Зарегистрироваться
          </Button>
          <FormSuccess message={successMessage} />
          <FormError error={form.formState.errors.root?.message} />
        </div>
        <div className="flex items-center justify-center">
          <Button variant={'link'} type="button" asChild className="mx-auto">
            <Link href="/login">У вас уже есть аккаунт? Войдите</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
