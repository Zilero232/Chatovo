'use client';

import { updateRoomInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useUpdateRoom } from '@/entities/room/room';
import { Button, Input, Label } from '@/shared/ui';
import { editRoomFormStyles as s } from './EditRoomDialog.styles';
import type { UpdateRoomRequest } from '@chatovo/schemas';
import type { EditRoomFormProps } from './EditRoomDialog.types';

export const EditRoomForm = ({ room, onUpdated }: EditRoomFormProps) => {
  const t = useTranslations('manageRoom.edit');

  const updateMutation = useUpdateRoom();

  const {
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
        onError: (err: Error) => toast.error(err.message),
      },
    );
  });

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <div className={s.field}>
        <Label htmlFor="edit-room-name">{t('nameLabel')}</Label>
        <Input autoComplete="off" id="edit-room-name" {...register('name')} />
        {errors.name && <p className={s.error}>{errors.name.message}</p>}
      </div>

      {isPrivate && (
        <div className={s.field}>
          <Label htmlFor="edit-room-password">{t('passwordLabel')}</Label>
          <Input
            autoComplete="new-password"
            id="edit-room-password"
            type="password"
            {...register('password')}
          />
          <p className={s.hint}>{t('passwordHint')}</p>
          {errors.password && <p className={s.error}>{errors.password.message}</p>}
        </div>
      )}

      <label className={s.checkboxRow}>
        <input className={s.checkbox} type="checkbox" {...register('isPrivate')} />
        <span>{t('privateLabel')}</span>
      </label>

      <div className={s.footer}>
        <Button disabled={isPending || !isDirty} type="submit">
          {isPending && <Loader2 className={s.spinner} />}
          {t('submit')}
        </Button>
      </div>
    </form>
  );
};
