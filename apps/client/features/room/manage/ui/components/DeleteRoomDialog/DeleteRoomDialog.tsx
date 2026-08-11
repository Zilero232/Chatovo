'use client';

import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { useErrorMessage } from '@/entities/app/locale';
import { useDeleteRoom } from '@/entities/room/room';
import { ROUTES } from '@/shared/constants';
import { ConfirmDialog, Text } from '@/shared/ui';

import type { DeleteRoomDialogProps } from './DeleteRoomDialog.types';

export const DeleteRoomDialog = ({ room, open, onOpenChange }: DeleteRoomDialogProps) => {
  const t = useTranslations('manageRoom.delete');
  const errorMessage = useErrorMessage();

  const router = useRouter();
  const params = useSearchParams();

  const deleteMutation = useDeleteRoom();

  const onConfirm = () => {
    deleteMutation.mutate(room.id, {
      onSuccess: () => {
        toast.success(t('deleted'), { description: `"${room.name}"` });
        onOpenChange(false);
        if (params.get('id') === room.id) {
          router.replace(ROUTES.lobby);
        }
      },
      onError: (err: Error) => toast.error(errorMessage(err))
    });
  };

  return (
    <ConfirmDialog
      cancelLabel={t('cancel')}
      confirmLabel={t('confirm')}
      description={t('description')}
      hint={t('hint')}
      icon={<Trash2 />}
      isPending={deleteMutation.isPending}
      open={open}
      title={t('title', { name: room.name })}
      onConfirm={onConfirm}
      onOpenChange={onOpenChange}
    >
      <Text size='sm' tone='destructive'>
        {t('consequences')}
      </Text>
    </ConfirmDialog>
  );
};
