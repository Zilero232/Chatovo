'use client';

import { useTranslations } from 'next-intl';

import { useToastError } from '@/entities/app/locale';
import { useDeleteChannel } from '@/entities/server/channel';
import { ConfirmDialog } from '@/ui-kit';

import type { DeleteChannelDialogProps } from './DeleteChannelDialog.types';

export const DeleteChannelDialog = ({
  serverId,
  channel,
  open,
  onOpenChange,
  onDeleted
}: DeleteChannelDialogProps) => {
  const t = useTranslations('server.channels');
  const tCommon = useTranslations('common');
  const toastError = useToastError();

  const deleteMutation = useDeleteChannel(serverId);

  return (
    <ConfirmDialog
      cancelLabel={tCommon('cancel')}
      confirmLabel={t('deleteChannel')}
      description={t('deleteChannelConfirm', { name: channel.name })}
      isPending={deleteMutation.isPending}
      open={open}
      title={t('deleteChannel')}
      onConfirm={() =>
        deleteMutation.mutate(channel.id, {
          onSuccess: () => {
            onOpenChange(false);
            onDeleted?.();
          },
          onError: toastError(`channel-delete-${channel.id}`)
        })
      }
      onOpenChange={onOpenChange}
    />
  );
};
