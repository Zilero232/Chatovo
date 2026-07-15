'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useRemoveFriendship } from '@/entities/social/friend';
import { ConfirmDialog } from '@/shared/ui';

import type { RemoveFriendConfirmDialogProps } from './RemoveFriendConfirmDialog.types';

export const RemoveFriendConfirmDialog = ({
  open,
  onOpenChange,
  userId,
  friendName,
}: RemoveFriendConfirmDialogProps) => {
  const t = useTranslations('friends.removeFriendConfirm');

  const removeFriendship = useRemoveFriendship();

  const handleConfirm = () => {
    removeFriendship.mutate(userId, {
      onSuccess: () => onOpenChange(false),
      onError: () => toast.error(t('failed')),
    });
  };

  return (
    <ConfirmDialog
      cancelLabel={t('cancel')}
      confirmLabel={t('confirm')}
      description={t('description', { name: friendName })}
      isPending={removeFriendship.isPending}
      open={open}
      title={t('title')}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    />
  );
};
