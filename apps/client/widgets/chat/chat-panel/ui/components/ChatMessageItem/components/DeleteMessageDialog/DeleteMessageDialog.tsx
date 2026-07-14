'use client';

import { useTranslations } from 'next-intl';

import { ConfirmDialog } from '@/shared/ui';

import type { DeleteMessageDialogProps } from './DeleteMessageDialog.types';

export const DeleteMessageDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: DeleteMessageDialogProps) => {
  const t = useTranslations('chat');

  return (
    <ConfirmDialog
      open={open}
      title={t('deleteTitle')}
      description={t('deleteDescription')}
      cancelLabel={t('cancel')}
      confirmLabel={t('delete')}
      onConfirm={onConfirm}
      onOpenChange={onOpenChange}
    />
  );
};
