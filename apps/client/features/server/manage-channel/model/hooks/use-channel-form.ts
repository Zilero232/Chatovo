'use client';

import type { CreateChannelRequest } from '@chatovo/schemas';

import { createChannelInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useToastError } from '@/entities/app/locale';
import { useCreateChannel, useUpdateChannel } from '@/entities/server/channel';

import type { UseChannelFormInput } from './use-channel-form.types';

const buildDefaults = ({
  channel,
  categoryId
}: Pick<UseChannelFormInput, 'categoryId' | 'channel'>): CreateChannelRequest => ({
  name: channel?.name ?? '',
  type: channel?.type ?? 'text',
  categoryId: channel?.categoryId ?? categoryId ?? null,
  topic: channel?.topic ?? '',
  slowMode: channel?.slowMode ?? 0,
  nsfw: channel?.nsfw ?? false,
  userLimit: channel?.userLimit ?? null,
  isPrivate: channel?.isPrivate ?? false
});

export const useChannelForm = ({ serverId, channel, categoryId, onDone }: UseChannelFormInput) => {
  const toastError = useToastError();

  const createMutation = useCreateChannel(serverId);
  const updateMutation = useUpdateChannel(serverId);

  const form = useForm<CreateChannelRequest>({
    resolver: zodResolver(createChannelInputSchema),
    mode: 'onChange',
    values: buildDefaults({ channel, categoryId })
  });

  const type = form.watch('type');
  const name = form.watch('name');
  const isEdit = Boolean(channel);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const finish = () => {
    form.reset(buildDefaults({ channel: null, categoryId }));
    onDone?.();
  };

  const onSubmit = form.handleSubmit((values) => {
    const payload = { ...values, topic: values.topic?.trim() || null };

    if (channel) {
      const { type: _type, ...rest } = payload;

      updateMutation.mutate(
        { channelId: channel.id, input: rest },
        { onSuccess: finish, onError: toastError(`channel-update-${channel.id}`) }
      );

      return;
    }

    createMutation.mutate(payload, { onSuccess: finish, onError: toastError('channel-create') });
  });

  return {
    form,
    type,
    isEdit,
    isPending,
    canSubmit: Boolean(name?.trim()),
    onSubmit
  };
};
