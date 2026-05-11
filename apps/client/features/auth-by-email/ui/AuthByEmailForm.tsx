'use client';

import { Anchor, Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

import { type AuthMode, useAuthByEmail } from '../model/use-auth-by-email';

export const AuthByEmailForm = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const { form, mutation } = useAuthByEmail();
  const { register, handleSubmit, formState } = form;

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(
      { mode, values },
      {
        onSuccess: () => {
          if (mode === 'signup')
            notifications.show({
              color: 'green',
              title: 'Account created',
              message: 'Check email if confirmation is on.',
            });
        },
        onError: (err: Error) =>
          notifications.show({ color: 'red', title: 'Error', message: err.message }),
      },
    );
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="md">
        <TextInput
          label="Email"
          type="email"
          autoComplete="email"
          error={formState.errors.email?.message}
          {...register('email')}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          error={formState.errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" loading={mutation.isPending} fullWidth>
          {mode === 'signin' ? 'Sign in' : 'Sign up'}
        </Button>
        <Anchor
          component="button"
          type="button"
          ta="center"
          size="sm"
          c="dimmed"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        >
          {mode === 'signin' ? 'No account? Sign up' : 'Have account? Sign in'}
        </Anchor>
      </Stack>
    </form>
  );
};
