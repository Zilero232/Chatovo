'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useErrorMessage } from '@/entities/app/locale';
import { useDeleteRoom } from '@/entities/room/room';
import { ROUTES } from '@/shared/constants';
import { ConfirmDialog } from '@/shared/ui';

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
      onError: (err: Error) => toast.error(errorMessage(err)),
    });
  };

  return (
    <ConfirmDialog
      open={open}
      title={t('title', { name: room.name })}
      description={t('description')}
      cancelLabel={t('cancel')}
      confirmLabel={t('confirm')}
      isPending={deleteMutation.isPending}
      onConfirm={onConfirm}
      onOpenChange={onOpenChange}
    />
  );
};
