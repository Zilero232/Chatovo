'use client';

import { useTranslations } from 'next-intl';

import { ConfirmDialog } from '@/ui-kit';

import type { DeleteMessageDialogProps } from './DeleteMessageDialog.types';

export const DeleteMessageDialog = ({
  open,
  onOpenChange,
  onConfirm
}: DeleteMessageDialogProps) => {
  const t = useTranslations('chat');

  return (
    <ConfirmDialog
      cancelLabel={t('cancel')}
      confirmLabel={t('delete')}
      description={t('deleteDescription')}
      open={open}
      title={t('deleteTitle')}
      onConfirm={onConfirm}
      onOpenChange={onOpenChange}
    />
  );
};
