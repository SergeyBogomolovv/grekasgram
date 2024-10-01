'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { useLogin } from '../hooks/use-login';
import { LoginFields, loginFieldsSchema } from '../model/response.schema';

import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import FormError from '@/shared/ui/form-error';
import { Input } from '@/shared/ui/input';

export default function LoginForm() {
  const form = useForm<LoginFields>({
    resolver: zodResolver(loginFieldsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending } = useLogin(form);

  const onSubmit = form.handleSubmit((data) => mutate(data));

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="mx-auto flex flex-col w-[450px] gap-6 max-w-[90%]"
      >
        <div className="text-center flex flex-col gap-y-4">
          <h1 className="text-4xl font-bold">Рады видеть вас снова!</h1>
          <p className="text-sm text-muted-foreground">
            Пожалуйста, введите данные для входа в аккаунт, чтобы продолжить
          </p>
        </div>
        <div className="flex flex-col gap-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    data-testid="email-input"
                    type="email"
                    autoComplete="email"
                    placeholder="email@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage data-testid="email-error" />
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
                    data-testid="password-input"
                    type="password"
                    autoComplete="current-password"
                    placeholder="******"
                    {...field}
                  />
                </FormControl>
                <FormMessage data-testid="password-error" />
              </FormItem>
            )}
          />

          <Button
            size="lg"
            data-testid="login-button"
            type="submit"
            disabled={isPending}
          >
            Войти
          </Button>
          <FormError error={form.formState.errors.root?.message} />
        </div>
        <div className="flex items-center justify-center">
          <Button
            aria-label="go to register"
            variant={'link'}
            type="button"
            asChild
            className="mx-auto"
          >
            <Link href="/register">
              У вас еще нету аккаунта? Зарегистрируйтесь
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
