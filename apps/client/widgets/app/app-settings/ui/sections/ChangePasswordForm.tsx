'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFieldError } from '@/entities/app/locale';
import {
  type ChangePasswordValues,
  changePasswordSchema,
  useChangePassword,
} from '@/entities/auth/user';
import { Button, Input, Label } from '@/shared/ui';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

export const ChangePasswordForm = () => {
  const t = useTranslations('settings.security');
  const fieldError = useFieldError('auth');

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
      onError: (err: Error) => toast.error(err.message),
    });
  });

  return (
    <form className={s.profileForm} onSubmit={onSubmit}>
      <div className={s.profileField}>
        <Label className={s.profileLabel} htmlFor="current-password">
          {t('currentPasswordLabel')}
        </Label>

        <Input
          autoComplete="current-password"
          id="current-password"
          type="password"
          {...register('currentPassword')}
        />

        {errors.currentPassword && (
          <p className={s.profileError}>{fieldError(errors.currentPassword)}</p>
        )}
      </div>

      <div className={s.profileField}>
        <Label className={s.profileLabel} htmlFor="new-password">
          {t('newPasswordLabel')}
        </Label>

        <Input
          autoComplete="new-password"
          id="new-password"
          type="password"
          {...register('newPassword')}
        />

        {errors.newPassword && <p className={s.profileError}>{fieldError(errors.newPassword)}</p>}
      </div>

      <div className={s.profileField}>
        <Label className={s.profileLabel} htmlFor="confirm-password">
          {t('confirmPasswordLabel')}
        </Label>

        <Input
          autoComplete="new-password"
          id="confirm-password"
          type="password"
          {...register('confirmPassword')}
        />

        {errors.confirmPassword && (
          <p className={s.profileError}>{fieldError(errors.confirmPassword)}</p>
        )}
      </div>

      <Button className={s.profileSubmit} disabled={!isDirty || isPending} type="submit">
        {isPending && <Loader2 className={s.profileSpinner} />}
        {t('changePassword')}
      </Button>
    </form>
  );
};
