'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useErrorMessage, useFieldError } from '@/entities/app/locale';
import {
  type ChangePasswordValues,
  changePasswordSchema,
  useChangePassword,
} from '@/entities/auth/user';
import { FormField, Input, SubmitButton } from '@/shared/ui';

import s from './ChangePasswordForm.module.scss';

export const ChangePasswordForm = () => {
  const t = useTranslations('settings.security');
  const fieldError = useFieldError('auth');
  const errorMessage = useErrorMessage();

  const { isPending, mutate } = useChangePassword();

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(t('passwordChanged'));
        reset();
      },
      onError: (err: Error) => toast.error(errorMessage(err)),
    });
  });

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <FormField
        htmlFor="current-password"
        label={t('currentPasswordLabel')}
        error={errors.currentPassword && fieldError(errors.currentPassword)}
      >
        <Input
          autoComplete="current-password"
          id="current-password"
          type="password"
          {...register('currentPassword')}
        />
      </FormField>

      <FormField
        htmlFor="new-password"
        label={t('newPasswordLabel')}
        error={errors.newPassword && fieldError(errors.newPassword)}
      >
        <Input
          autoComplete="new-password"
          id="new-password"
          type="password"
          {...register('newPassword')}
        />
      </FormField>

      <FormField
        htmlFor="confirm-password"
        label={t('confirmPasswordLabel')}
        error={errors.confirmPassword && fieldError(errors.confirmPassword)}
      >
        <Input
          autoComplete="new-password"
          id="confirm-password"
          type="password"
          {...register('confirmPassword')}
        />
      </FormField>

      <SubmitButton className={s.submit} disabled={!isDirty} isPending={isPending}>
        {t('changePassword')}
      </SubmitButton>
    </form>
  );
};
