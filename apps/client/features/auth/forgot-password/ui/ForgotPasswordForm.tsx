'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useFieldError } from '@/entities/app/locale';
import { FormField, Input, Stack, SubmitButton } from '@/shared/ui';
import {
  type ForgotPasswordValues,
  forgotPasswordSchema,
  useForgotPassword,
} from '../model/use-forgot-password';

import s from './ForgotPasswordForm.module.scss';

import type { ForgotPasswordFormProps } from './ForgotPasswordForm.types';

const DEFAULT_VALUES: ForgotPasswordValues = { email: '' };

export const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const t = useTranslations('auth');
  const fieldError = useFieldError('auth');
  const { isPending, mutate } = useForgotPassword();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => toast.success(t('resetEmailSent')),
      onError: (err: Error) => toast.error(err.message),
    });
  });

  return (
    <Stack as="form" gap="4" onSubmit={onSubmit}>
      <FormField
        htmlFor="forgot-email"
        label={t('fields.email')}
        error={errors.email && fieldError(errors.email)}
      >
        <Input autoComplete="email" id="forgot-email" type="email" {...register('email')} />
      </FormField>

      <SubmitButton className={s.submit} isPending={isPending}>
        {t('sendResetLink')}
      </SubmitButton>

      <button className={s.backLink} type="button" onClick={onBack}>
        {t('backToSignIn')}
      </button>
    </Stack>
  );
};
