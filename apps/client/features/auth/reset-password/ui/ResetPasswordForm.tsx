'use client';

import type { ResetPasswordValues } from '@chatovo/schemas';

import { resetPasswordSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useErrorMessage, useFieldError } from '@/entities/app/locale';
import { FormField, PasswordInput, Stack, SubmitButton } from '@/ui-kit';

import type { ResetPasswordFormProps } from './ResetPasswordForm.types';

import { useResetPassword } from '../model/hooks';

import s from './ResetPasswordForm.module.scss';

const DEFAULT_VALUES: ResetPasswordValues = { newPassword: '', confirmPassword: '' };

export const ResetPasswordForm = ({ token, onSuccess }: ResetPasswordFormProps) => {
  const t = useTranslations('auth');
  const fieldError = useFieldError('auth');
  const errorMessage = useErrorMessage();
  const { isPending, mutate } = useResetPassword(token);

  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: DEFAULT_VALUES
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(t('passwordReset'), { id: 'reset-password' });
        onSuccess();
      },
      onError: (err: Error) => toast.error(errorMessage(err), { id: 'reset-password' })
    });
  });

  return (
    <Stack as='form' gap='4' onSubmit={onSubmit}>
      <FormField
        error={errors.newPassword && fieldError(errors.newPassword)}
        htmlFor='reset-new-password'
        label={t('fields.password')}
      >
        <PasswordInput
          autoComplete='new-password'
          id='reset-new-password'
          {...register('newPassword')}
        />
      </FormField>

      <FormField
        error={errors.confirmPassword && fieldError(errors.confirmPassword)}
        htmlFor='reset-confirm-password'
        label={t('fields.confirmPassword')}
      >
        <PasswordInput
          autoComplete='new-password'
          id='reset-confirm-password'
          {...register('confirmPassword')}
        />
      </FormField>

      <SubmitButton className={s.submit} isPending={isPending}>
        {t('resetPassword')}
      </SubmitButton>
    </Stack>
  );
};
