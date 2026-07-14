'use client';

import { roomPasswordSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFieldError } from '@/entities/app/locale';
import { FormField, Input, Row, Stack, SubmitButton } from '@/shared/ui';
import s from './RoomPasswordForm.module.scss';
import type { RoomPasswordFormProps } from './RoomPasswordForm.types';

const passwordSchema = z.object({ password: roomPasswordSchema });

type PasswordValues = z.infer<typeof passwordSchema>;

export const RoomPasswordForm = ({
  displayName,
  error,
  isSubmitting,
  onSubmit,
}: RoomPasswordFormProps) => {
  const t = useTranslations('room.password');
  const passwordError = useFieldError('room.password');

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  const submit = handleSubmit(({ password }) => onSubmit(password));

  const fieldError = passwordError(errors.password) ?? error;

  return (
    <Row justify="center" align="center" className={s.root}>
      <Stack
        as="form"
        align="center"
        gap="4"
        className={clsx(s.form, 'glass', 'shadow-glow-violet')}
        onSubmit={submit}
      >
        <p className={s.title}>{t('title', { name: displayName })}</p>

        <FormField
          htmlFor="room-password"
          label={t('label')}
          error={fieldError}
          className={s.field}
        >
          <Input
            disabled={isSubmitting}
            id="room-password"
            type="password"
            {...register('password')}
          />
        </FormField>

        <SubmitButton className={s.submit} isPending={isSubmitting}>
          {t('join')}
        </SubmitButton>
      </Stack>
    </Row>
  );
};
