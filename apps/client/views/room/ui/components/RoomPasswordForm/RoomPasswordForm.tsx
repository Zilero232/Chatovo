'use client';

import { roomPasswordSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useFieldError } from '@/entities/app/locale';
import { FormField, Input, Row, Stack, SubmitButton, Text } from '@/shared/ui';

import type { RoomPasswordFormProps } from './RoomPasswordForm.types';

import s from './RoomPasswordForm.module.scss';

const passwordSchema = z.object({ password: roomPasswordSchema });

type PasswordValues = z.infer<typeof passwordSchema>;

export const RoomPasswordForm = ({
  displayName,
  error,
  isSubmitting,
  onSubmit
}: RoomPasswordFormProps) => {
  const t = useTranslations('room.password');
  const passwordError = useFieldError('room.password');

  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' }
  });

  const submit = handleSubmit(({ password }) => onSubmit(password));

  const fieldError = passwordError(errors.password) ?? error;

  return (
    <Row align='center' className={s.root} justify='center'>
      <Stack
        align='center'
        as='form'
        className={clsx(s.form, 'glass', 'shadow-glow-violet')}
        gap='4'
        onSubmit={submit}
      >
        <Text align='center' className={s.title} size='sm' tone='inherit'>
          {t('title', { name: displayName })}
        </Text>

        <FormField
          className={s.field}
          error={fieldError}
          htmlFor='room-password'
          label={t('label')}
        >
          <Input
            disabled={isSubmitting}
            id='room-password'
            type='password'
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
