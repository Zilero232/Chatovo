'use client';

import { createRoomInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCreateRoom, useEnterRoom } from '@/entities/room/room';

import type { CreateRoomRequest } from '@chatovo/schemas';
import type { UseCreateRoomFormInput } from './use-create-room-form.types';

const DEFAULT_VALUES: CreateRoomRequest = { name: '', isPrivate: false };

export const useCreateRoomForm = ({ onCreated }: UseCreateRoomFormInput) => {
  const t = useTranslations('createRoom');
  const createMutation = useCreateRoom();
  const enterMutation = useEnterRoom();

  const form = useForm<CreateRoomRequest>({
    resolver: zodResolver(createRoomInputSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  const isPrivate = form.watch('isPrivate');
  const name = form.watch('name');
  const isPending = createMutation.isPending || enterMutation.isPending;

  const onSubmit = form.handleSubmit((values) => {
    createMutation.mutate(values, {
      onSuccess: (room) => {
        toast.success(t('created'), { description: `"${room.name}"` });
        form.reset(DEFAULT_VALUES);
        onCreated?.();
        enterMutation.mutate(
          { roomId: room.id, password: values.isPrivate ? values.password : undefined },
          { onError: (err: Error) => toast.error(err.message) },
        );
      },
      onError: (err: Error) => toast.error(err.message),
    });
  });

  return { form, isPrivate, isPending, canSubmit: Boolean(name?.trim()), onSubmit };
};
