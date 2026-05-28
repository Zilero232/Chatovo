'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useFieldError } from '@/entities/app/locale';
import { FormField, Input, Row, Stack, SubmitButton } from '@/shared/ui';
import { passwordSchema } from './RoomPasswordForm.styles';
import type { z } from 'zod';
import type { RoomPasswordFormProps } from './RoomPasswordForm.types';

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

  // The validation error is an i18n key; the server `error` is already text.
  const fieldError = passwordError(errors.password) ?? error;

  return (
    <Row justify="center" align="center" className="h-full">
      <Stack as="form" align="center" gap="3" className="w-full max-w-xs" onSubmit={submit}>
        <p className="text-muted-foreground text-sm">{t('title', { name: displayName })}</p>

        <FormField htmlFor="room-password" label={t('label')} error={fieldError} className="w-full">
          <Input
            disabled={isSubmitting}
            id="room-password"
            type="password"
            {...register('password')}
          />
        </FormField>

        <SubmitButton isPending={isSubmitting}>{t('join')}</SubmitButton>
      </Stack>
    </Row>
  );
};
