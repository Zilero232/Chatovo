'use client';

import { UserMinus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useErrorMessage } from '@/entities/app/locale';
import { useRemoveFriendship } from '@/entities/social/friend';
import { ConfirmDialog, Text } from '@/ui-kit';

import type { RemoveFriendConfirmDialogProps } from './RemoveFriendConfirmDialog.types';

export const RemoveFriendConfirmDialog = ({
  open,
  onOpenChange,
  userId,
  friendName
}: RemoveFriendConfirmDialogProps) => {
  const t = useTranslations('friends.removeFriendConfirm');
  const errorMessage = useErrorMessage();

  const removeFriendship = useRemoveFriendship();

  const handleConfirm = () => {
    removeFriendship.mutate(userId, {
      onSuccess: () => onOpenChange(false),
      onError: (err: Error) => toast.error(errorMessage(err), { id: `friend-remove-${userId}` })
    });
  };

  return (
    <ConfirmDialog
      cancelLabel={t('cancel')}
      confirmLabel={t('confirm')}
      description={t('description', { name: friendName })}
      icon={<UserMinus />}
      isPending={removeFriendship.isPending}
      open={open}
      title={t('title')}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    >
      <Text size='sm' tone='muted'>
        {t('consequences')}
      </Text>
    </ConfirmDialog>
  );
};
