'use client';

import { useTranslations } from 'next-intl';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui';
import { EditRoomForm } from './EditRoomForm';

import type { EditRoomDialogProps } from './EditRoomDialog.types';

export const EditRoomDialog = ({ room, open, onOpenChange }: EditRoomDialogProps) => {
  const t = useTranslations('manageRoom.edit');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <EditRoomForm room={room} onUpdated={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
