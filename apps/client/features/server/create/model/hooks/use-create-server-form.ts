'use client';

import type { CreateServerRequest } from '@chatovo/schemas';

import { createServerInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { useCreateServer } from '@/entities/server/server';
import { buildServerHref } from '@/shared/lib';

const DEFAULT_VALUES: CreateServerRequest = { name: '', description: '' };

export const useCreateServerForm = ({ onCreated }: { onCreated?: () => void }) => {
  const router = useRouter();

  const t = useTranslations('server.create');
  const toastError = useToastError();
  const createMutation = useCreateServer();

  const form = useForm<CreateServerRequest>({
    resolver: zodResolver(createServerInputSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES
  });

  const name = form.watch('name');

  const onSubmit = form.handleSubmit((values) => {
    createMutation.mutate(
      { ...values, description: values.description?.trim() || undefined },
      {
        onSuccess: (server) => {
          toast.success(t('success'), { id: 'server-create', description: server.name });
          form.reset(DEFAULT_VALUES);
          onCreated?.();
          router.push(
            buildServerHref(server.id, { channelId: server.systemChannelId ?? undefined })
          );
        },
        onError: toastError('server-create')
      }
    );
  });

  return {
    form,
    isPending: createMutation.isPending,
    canSubmit: Boolean(name?.trim()),
    onSubmit
  };
};
