'use client';

import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useDeleteRoom } from '@/entities/room/room';
import { ROUTES } from '@/shared/constants';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';
import { deleteRoomDialogStyles as s } from './DeleteRoomDialog.styles';
import type { DeleteRoomDialogProps } from './DeleteRoomDialog.types';

export const DeleteRoomDialog = ({ room, open, onOpenChange }: DeleteRoomDialogProps) => {
  const t = useTranslations('manageRoom.delete');

  const router = useRouter();
  const params = useSearchParams();

  const deleteMutation = useDeleteRoom();

  const onConfirm = () => {
    deleteMutation.mutate(room.id, {
      onSuccess: () => {
        toast.success(t('deleted'), { description: `"${room.name}"` });

        onOpenChange(false);

        // If the user is currently inside the deleted room, bounce to the lobby.
        if (params.get('id') === room.id) router.replace(ROUTES.lobby);
      },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title', { name: room.name })}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            disabled={deleteMutation.isPending}
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t('cancel')}
          </Button>
          <Button
            disabled={deleteMutation.isPending}
            type="button"
            variant="destructive"
            onClick={onConfirm}
          >
            {deleteMutation.isPending && <Loader2 className={s.spinner} />}
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
