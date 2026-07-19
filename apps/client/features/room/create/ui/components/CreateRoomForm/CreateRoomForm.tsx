'use client';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { FormField, Input, Label, Row, Stack, SubmitButton, Switch } from '@/shared/ui';
import { useCreateRoomForm } from '../../../model/hooks';

import type { CreateRoomFormProps } from './CreateRoomForm.types';

export const CreateRoomForm = ({ onCreated }: CreateRoomFormProps) => {
  const t = useTranslations('createRoom');

  const { form, isPrivate, isPending, canSubmit, onSubmit } = useCreateRoomForm({ onCreated });
  const {
    control,
    formState: { errors },
    register,
  } = form;

  return (
    <Stack as="form" gap="3" onSubmit={onSubmit}>
      <FormField htmlFor="create-room-name" label={t('nameLabel')} error={errors.name?.message}>
        <Input
          autoComplete="off"
          id="create-room-name"
          placeholder={t('namePlaceholder')}
          {...register('name')}
        />
      </FormField>

      {isPrivate && (
        <FormField
          htmlFor="create-room-password"
          label={t('passwordLabel')}
          error={errors.password?.message}
        >
          <Input
            autoComplete="new-password"
            id="create-room-password"
            placeholder={t('passwordPlaceholder')}
            type="password"
            {...register('password')}
          />
        </FormField>
      )}

      <Row gap="2">
        <Controller
          control={control}
          name="isPrivate"
          render={({ field }) => (
            <Switch
              checked={field.value}
              id="create-room-private"
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="create-room-private">{t('privateLabel')}</Label>
      </Row>

      <SubmitButton disabled={!canSubmit} isPending={isPending} variant="secondary">
        {t('submit')}
      </SubmitButton>
    </Stack>
  );
};
