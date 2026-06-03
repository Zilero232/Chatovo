'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MailCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFieldError } from '@/entities/app/locale';
import { CenteredState, FormField, Input, PasswordInput, Stack, SubmitButton } from '@/shared/ui';
import { type SignUpValues, signUpSchema, useSignUp } from '../model/use-sign-up';

const DEFAULT_VALUES: SignUpValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const SignUpForm = () => {
  const t = useTranslations('auth');
  const fieldError = useFieldError('auth');
  const { isPending, mutate } = useSignUp();

  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => setSentTo(values.email),
      onError: (err: Error) => toast.error(err.message),
    });
  });

  if (sentTo) {
    return (
      <CenteredState
        icon={<MailCheck />}
        title={t('verifyEmailTitle')}
        description={t('verifyEmailDescription', { email: sentTo })}
      />
    );
  }

  return (
    <Stack as="form" gap="4" onSubmit={onSubmit}>
      <FormField
        htmlFor="signup-name"
        label={t('fields.name')}
        error={errors.name && fieldError(errors.name)}
      >
        <Input autoComplete="name" id="signup-name" type="text" {...register('name')} />
      </FormField>

      <FormField
        htmlFor="signup-email"
        label={t('fields.email')}
        error={errors.email && fieldError(errors.email)}
      >
        <Input autoComplete="email" id="signup-email" type="email" {...register('email')} />
      </FormField>

      <FormField
        htmlFor="signup-password"
        label={t('fields.password')}
        error={errors.password && fieldError(errors.password)}
      >
        <PasswordInput autoComplete="new-password" id="signup-password" {...register('password')} />
      </FormField>

      <FormField
        htmlFor="signup-confirm-password"
        label={t('fields.confirmPassword')}
        error={errors.confirmPassword && fieldError(errors.confirmPassword)}
      >
        <PasswordInput
          autoComplete="new-password"
          id="signup-confirm-password"
          {...register('confirmPassword')}
        />
      </FormField>

      <SubmitButton className="w-full" isPending={isPending}>
        {t('signUp')}
      </SubmitButton>
    </Stack>
  );
};
