'use client';

import { roomPasswordSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { clsx } from 'clsx';
import { ArrowLeft, KeyRound, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useFieldError } from '@/entities/app/locale';
import { ROUTES } from '@/shared/constants';
import { Button, EmptyStatePattern, FormField, Input, Stack, SubmitButton, Text } from '@/ui-kit';

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
  const tRoom = useTranslations('room');
  const router = useRouter();

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
    <section className={s.root}>
      <EmptyStatePattern className={s.pattern} variant='waves' />

      <Stack
        as='form'
        className={clsx(s.card, 'glass', 'shadow-glow-violet')}
        gap='4'
        onSubmit={submit}
      >
        <span aria-hidden className={clsx(s.badge, 'glass')}>
          <Lock className={s.badgeIcon} />
        </span>

        <Stack align='center' gap='2'>
          <Text as='h1' className={s.heading} weight='semibold'>
            {t('heading')}
          </Text>

          <Text align='center' size='sm' tone='muted'>
            {t('hint', { name: displayName })}
          </Text>
        </Stack>

        <FormField
          className={s.field}
          error={fieldError}
          htmlFor='room-password'
          label={t('label')}
        >
          <Input
            autoComplete='off'
            className={s.input}
            disabled={isSubmitting}
            id='room-password'
            type='password'
            {...register('password')}
          />
        </FormField>

        <Stack className={s.actions} gap='2'>
          <SubmitButton isPending={isSubmitting} size='lg'>
            <KeyRound />
            {t('join')}
          </SubmitButton>

          <Button size='sm' variant='ghost' onClick={() => router.replace(ROUTES.lobby)}>
            <ArrowLeft />
            {tRoom('backToLobby')}
          </Button>
        </Stack>
      </Stack>
    </section>
  );
};
