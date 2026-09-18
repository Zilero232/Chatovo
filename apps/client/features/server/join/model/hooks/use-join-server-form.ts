'use client';

import type { JoinServerRequest } from '@chatovo/schemas';

import { joinServerInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { useJoinServer } from '@/entities/server/invite';
import { buildServerHref } from '@/shared/lib';

const DEFAULT_VALUES: JoinServerRequest = { code: '' };

const readInviteCode = (raw: string) => {
  const trimmed = raw.trim();
  const fromUrl = trimmed.match(/[?&]code=([^&#]+)/);

  return decodeURIComponent(fromUrl?.[1] ?? trimmed.split('/').at(-1) ?? trimmed);
};

export const useJoinServerForm = ({ onJoined }: { onJoined?: () => void }) => {
  const router = useRouter();

  const t = useTranslations('server.join');
  const toastError = useToastError();
  const joinMutation = useJoinServer();

  const form = useForm<JoinServerRequest>({
    resolver: zodResolver(joinServerInputSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES
  });

  const code = form.watch('code');

  const onSubmit = form.handleSubmit((values) => {
    joinMutation.mutate(readInviteCode(values.code), {
      onSuccess: (server) => {
        toast.success(t('success'), { id: 'server-join', description: server.name });
        form.reset(DEFAULT_VALUES);
        onJoined?.();
        router.push(buildServerHref(server.id, { channelId: server.systemChannelId ?? undefined }));
      },
      onError: toastError('server-join')
    });
  });

  return {
    form,
    isPending: joinMutation.isPending,
    canSubmit: Boolean(code?.trim()),
    onSubmit
  };
};
