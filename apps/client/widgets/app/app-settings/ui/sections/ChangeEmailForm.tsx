'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFieldError } from '@/entities/app/locale';
import {
  type ChangeEmailValues,
  changeEmailSchema,
  useChangeEmail,
  useCurrentUser,
} from '@/entities/auth/user';
import { Button, Input, Label } from '@/shared/ui';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

export const ChangeEmailForm = () => {
  const t = useTranslations('settings.security');
  const fieldError = useFieldError('auth');

  const { user } = useCurrentUser();
  const currentEmail = user?.email ?? '';

  const { isPending, mutate } = useChangeEmail();

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: '' },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(t('emailChangeRequested'));
        reset();
      },
      onError: (err: Error) => toast.error(err.message),
    });
  });

  return (
    <form className={s.profileForm} onSubmit={onSubmit}>
      <div className={s.profileField}>
        <Label className={s.profileLabel} htmlFor="current-email">
          {t('currentEmailLabel')}
        </Label>

        <Input disabled id="current-email" type="email" value={currentEmail} />
      </div>

      <div className={s.profileField}>
        <Label className={s.profileLabel} htmlFor="new-email">
          {t('newEmailLabel')}
        </Label>

        <Input
          autoComplete="email"
          id="new-email"
          placeholder={t('newEmailPlaceholder')}
          type="email"
          {...register('newEmail')}
        />

        {errors.newEmail ? (
          <p className={s.profileError}>{fieldError(errors.newEmail)}</p>
        ) : (
          <p className={s.profileHint}>{t('emailChangeHint')}</p>
        )}
      </div>

      <Button className={s.profileSubmit} disabled={!isDirty || isPending} type="submit">
        {isPending && <Loader2 className={s.profileSpinner} />}
        {t('changeEmail')}
      </Button>
    </form>
  );
};
