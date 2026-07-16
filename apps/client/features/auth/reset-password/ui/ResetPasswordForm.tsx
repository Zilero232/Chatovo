'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useErrorMessage, useFieldError } from '@/entities/app/locale';
import { FormField, PasswordInput, Stack, SubmitButton } from '@/shared/ui';
import {
  type ResetPasswordValues,
  resetPasswordSchema,
  useResetPassword,
} from '../model/use-reset-password';

import s from './ResetPasswordForm.module.scss';

import type { ResetPasswordFormProps } from './ResetPasswordForm.types';

const DEFAULT_VALUES: ResetPasswordValues = { newPassword: '', confirmPassword: '' };

export const ResetPasswordForm = ({ token, onSuccess }: ResetPasswordFormProps) => {
  const t = useTranslations('auth');
  const fieldError = useFieldError('auth');
  const errorMessage = useErrorMessage();
  const { isPending, mutate } = useResetPassword(token);

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(t('passwordReset'));
        onSuccess();
      },
      onError: (err: Error) => toast.error(errorMessage(err)),
    });
  });

  return (
    <Stack as="form" gap="4" onSubmit={onSubmit}>
      <FormField
        htmlFor="reset-new-password"
        label={t('fields.password')}
        error={errors.newPassword && fieldError(errors.newPassword)}
      >
        <PasswordInput
          autoComplete="new-password"
          id="reset-new-password"
          {...register('newPassword')}
        />
      </FormField>

      <FormField
        htmlFor="reset-confirm-password"
        label={t('fields.confirmPassword')}
        error={errors.confirmPassword && fieldError(errors.confirmPassword)}
      >
        <PasswordInput
          autoComplete="new-password"
          id="reset-confirm-password"
          {...register('confirmPassword')}
        />
      </FormField>

      <SubmitButton className={s.submit} isPending={isPending}>
        {t('resetPassword')}
      </SubmitButton>
    </Stack>
  );
};
