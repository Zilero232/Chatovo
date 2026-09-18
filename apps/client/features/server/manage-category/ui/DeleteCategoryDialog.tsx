'use client';

import { useTranslations } from 'next-intl';

import { useToastError } from '@/entities/app/locale';
import { useDeleteCategory } from '@/entities/server/channel';
import { ConfirmDialog } from '@/ui-kit';

import type { DeleteCategoryDialogProps } from './DeleteCategoryDialog.types';

export const DeleteCategoryDialog = ({
  serverId,
  category,
  open,
  onOpenChange
}: DeleteCategoryDialogProps) => {
  const t = useTranslations('server.channels');
  const tCommon = useTranslations('common');
  const toastError = useToastError();

  const deleteMutation = useDeleteCategory(serverId);

  return (
    <ConfirmDialog
      cancelLabel={tCommon('cancel')}
      confirmLabel={t('deleteCategory')}
      description={t('deleteCategoryConfirm', { name: category.name })}
      isPending={deleteMutation.isPending}
      open={open}
      title={t('deleteCategory')}
      onConfirm={() =>
        deleteMutation.mutate(category.id, {
          onSuccess: () => onOpenChange(false),
          onError: toastError(`category-delete-${category.id}`)
        })
      }
      onOpenChange={onOpenChange}
    />
  );
};
