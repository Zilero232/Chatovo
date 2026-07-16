'use client';

import { updateRoomInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useErrorMessage } from '@/entities/app/locale';
import { useUpdateRoom } from '@/entities/room/room';
import { FormField, Input, Label, Row, Stack, SubmitButton, Switch } from '@/shared/ui';

import s from './EditRoomForm.module.scss';

import type { UpdateRoomRequest } from '@chatovo/schemas';
import type { EditRoomFormProps } from './EditRoomDialog.types';

export const EditRoomForm = ({ room, onUpdated }: EditRoomFormProps) => {
  const t = useTranslations('manageRoom.edit');
  const errorMessage = useErrorMessage();

  const updateMutation = useUpdateRoom();

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    register,
    watch,
  } = useForm<UpdateRoomRequest>({
    resolver: zodResolver(updateRoomInputSchema),
    mode: 'onChange',
    defaultValues: { name: room.name, isPrivate: room.isPrivate },
  });

  const isPrivate = watch('isPrivate');
  const isPending = updateMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    updateMutation.mutate(
      { id: room.id, input: values },
      {
        onSuccess: (updated) => {
          toast.success(t('saved'), { description: `"${updated.name}"` });
          onUpdated?.();
        },
        onError: (err: Error) => toast.error(errorMessage(err)),
      },
    );
  });

  return (
    <Stack as="form" gap="3" onSubmit={onSubmit}>
      <FormField htmlFor="edit-room-name" label={t('nameLabel')} error={errors.name?.message}>
        <Input autoComplete="off" id="edit-room-name" {...register('name')} />
      </FormField>

      {isPrivate && (
        <FormField
          htmlFor="edit-room-password"
          label={t('passwordLabel')}
          hint={t('passwordHint')}
          error={errors.password?.message}
        >
          <Input
            autoComplete="new-password"
            id="edit-room-password"
            type="password"
            {...register('password')}
          />
        </FormField>
      )}

      <Row align="center" gap="2">
        <Controller
          control={control}
          name="isPrivate"
          render={({ field }) => (
            <Switch checked={field.value} id="edit-room-private" onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="edit-room-private">{t('privateLabel')}</Label>
      </Row>

      <Row justify="end" gap="2" className={s.actions}>
        <SubmitButton disabled={!isDirty} isPending={isPending}>
          {t('submit')}
        </SubmitButton>
      </Row>
    </Stack>
  );
};
