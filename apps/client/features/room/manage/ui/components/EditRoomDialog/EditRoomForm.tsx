'use client';

import type { UpdateRoomRequest } from '@chatovo/schemas';

import { updateRoomInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useErrorMessage } from '@/entities/app/locale';
import { useUpdateRoom } from '@/entities/room/room';
import { useLiteMotion } from '@/shared/hooks';
import {
  FormField,
  Input,
  Label,
  PasswordInput,
  Row,
  Stack,
  SubmitButton,
  Switch,
  Text
} from '@/shared/ui';

import type { EditRoomFormProps } from './EditRoomDialog.types';

import s from './EditRoomForm.module.scss';

const NAME_MAX_LENGTH = 64;

export const EditRoomForm = ({ room, onUpdated }: EditRoomFormProps) => {
  const t = useTranslations('manageRoom.edit');
  const errorMessage = useErrorMessage();
  const { resolveTransition } = useLiteMotion();

  const updateMutation = useUpdateRoom();

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    register,
    watch
  } = useForm<UpdateRoomRequest>({
    resolver: zodResolver(updateRoomInputSchema),
    mode: 'onChange',
    defaultValues: { name: room.name, isPrivate: room.isPrivate }
  });

  const isPrivate = watch('isPrivate');
  const name = watch('name');
  const isPending = updateMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    updateMutation.mutate(
      { id: room.id, input: values },
      {
        onSuccess: (updated) => {
          toast.success(t('saved'), { description: `"${updated.name}"` });
          onUpdated?.();
        },
        onError: (err: Error) => toast.error(errorMessage(err))
      }
    );
  });

  return (
    <Stack as='form' gap='3' onSubmit={onSubmit}>
      <FormField
        label={
          <span className={s.labelRow}>
            {t('nameLabel')}
            <Text size='xs' tone='muted'>
              {t('nameCounter', { count: name?.length ?? 0, max: NAME_MAX_LENGTH })}
            </Text>
          </span>
        }
        error={errors.name?.message}
        htmlFor='edit-room-name'
      >
        <Input
          autoComplete='off'
          id='edit-room-name'
          maxLength={NAME_MAX_LENGTH}
          {...register('name')}
        />
      </FormField>

      <Stack gap='2'>
        <Row align='center' gap='2'>
          <Controller
            render={({ field }) => (
              <Switch
                checked={field.value}
                id='edit-room-private'
                onCheckedChange={field.onChange}
              />
            )}
            control={control}
            name='isPrivate'
          />
          <Label htmlFor='edit-room-private'>{t('privateLabel')}</Label>
        </Row>

        <Text size='xs' tone='muted'>
          {t(isPrivate ? 'privateExplainer' : 'publicExplainer')}
        </Text>
      </Stack>

      <AnimatePresence initial={false}>
        {isPrivate && (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            className={s.passwordReveal}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={resolveTransition({ type: 'spring', bounce: 0, duration: 0.32 })}
          >
            <FormField
              error={errors.password?.message}
              hint={t('passwordHint')}
              htmlFor='edit-room-password'
              label={t('passwordLabel')}
            >
              <PasswordInput
                autoComplete='new-password'
                id='edit-room-password'
                {...register('password')}
              />
            </FormField>
          </motion.div>
        )}
      </AnimatePresence>

      <Row className={s.actions} gap='2' justify='end'>
        <SubmitButton disabled={!isDirty} isPending={isPending}>
          {t('submit')}
        </SubmitButton>
      </Row>
    </Stack>
  );
};
