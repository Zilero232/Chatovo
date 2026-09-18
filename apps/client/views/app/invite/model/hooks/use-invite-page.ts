'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { useInvitePreview, useJoinServer } from '@/entities/server/invite';
import { buildServerHref } from '@/shared/lib';

export const useInvitePage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const t = useTranslations('server.join');
  const toastError = useToastError();

  const code = params.get('code');

  const { preview, isLoading, isError } = useInvitePreview(code);
  const joinMutation = useJoinServer();

  const openServer = (serverId: string) => router.replace(buildServerHref(serverId));

  const join = () => {
    if (!code) {
      return;
    }

    joinMutation.mutate(code, {
      onSuccess: (server) => {
        toast.success(t('success'), { id: 'server-join', description: server.name });
        openServer(server.id);
      },
      onError: toastError('server-join')
    });
  };

  return {
    code,
    preview,
    isLoading,
    isError,
    isJoining: joinMutation.isPending,
    join,
    openServer
  };
};
