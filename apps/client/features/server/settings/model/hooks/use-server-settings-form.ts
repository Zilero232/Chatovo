'use client';

import type { UpdateServerRequest } from '@chatovo/schemas';

import { updateServerInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { useUpdateServer } from '@/entities/server/server';

import type { UseServerSettingsFormInput } from './use-server-settings-form.types';

export const useServerSettingsForm = ({ server }: UseServerSettingsFormInput) => {
  const t = useTranslations('server.settings');
  const toastError = useToastError();
  const updateMutation = useUpdateServer();

  const form = useForm<UpdateServerRequest>({
    resolver: zodResolver(updateServerInputSchema),
    mode: 'onChange',
    values: {
      name: server.name,
      description: server.description ?? '',
      systemChannelId: server.systemChannelId
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    updateMutation.mutate(
      {
        serverId: server.id,
        input: { ...values, description: values.description?.trim() || null }
      },
      {
        onSuccess: () => toast.success(t('saved'), { id: `server-settings-${server.id}` }),
        onError: toastError(`server-settings-${server.id}`)
      }
    );
  });

  return {
    form,
    isPending: updateMutation.isPending,
    isDirty: form.formState.isDirty,
    onSubmit
  };
};
