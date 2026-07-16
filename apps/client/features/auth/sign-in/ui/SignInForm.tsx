'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useErrorMessage, useFieldError } from '@/entities/app/locale';
import { FormField, Input, PasswordInput, Stack, SubmitButton } from '@/shared/ui';
import { type SignInValues, signInSchema, useSignIn } from '../model/use-sign-in';

import s from './SignInForm.module.scss';

import type { SignInFormProps } from './SignInForm.types';

const DEFAULT_VALUES: SignInValues = { email: '', password: '' };

export const SignInForm = ({ onForgotPassword }: SignInFormProps) => {
  const t = useTranslations('auth');
  const fieldError = useFieldError('auth');
  const errorMessage = useErrorMessage();
  const { isPending, mutate } = useSignIn();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => toast.success(t('signedIn')),
      onError: (err: Error) => toast.error(errorMessage(err)),
    });
  });

  return (
    <Stack as="form" gap="4" onSubmit={onSubmit}>
      <FormField
        htmlFor="signin-email"
        label={t('fields.email')}
        error={errors.email && fieldError(errors.email)}
      >
        <Input autoComplete="email" id="signin-email" type="email" {...register('email')} />
      </FormField>

      <FormField
        htmlFor="signin-password"
        label={t('fields.password')}
        error={errors.password && fieldError(errors.password)}
      >
        <PasswordInput
          autoComplete="current-password"
          id="signin-password"
          {...register('password')}
        />
      </FormField>

      <button className={s.forgotLink} type="button" onClick={onForgotPassword}>
        {t('forgotPassword')}
      </button>

      <SubmitButton className={s.submit} isPending={isPending}>
        {t('signIn')}
      </SubmitButton>
    </Stack>
  );
};
