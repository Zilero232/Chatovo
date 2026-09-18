'use client';

import type { CreateCategoryRequest } from '@chatovo/schemas';

import { CATEGORY_NAME_MAX_LENGTH, createCategoryInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { useToastError } from '@/entities/app/locale';
import { useCreateCategory, useUpdateCategory } from '@/entities/server/channel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormActions,
  FormField,
  Input,
  Stack
} from '@/ui-kit';

import type { CategoryDialogProps } from './CategoryDialog.types';

export const CategoryDialog = ({ serverId, category, open, onOpenChange }: CategoryDialogProps) => {
  const t = useTranslations('server.channels');
  const toastError = useToastError();

  const createMutation = useCreateCategory(serverId);
  const updateMutation = useUpdateCategory(serverId);

  const form = useForm<CreateCategoryRequest>({
    resolver: zodResolver(createCategoryInputSchema),
    mode: 'onChange',
    values: { name: category?.name ?? '' }
  });

  const {
    formState: { errors },
    register,
    watch,
    reset
  } = form;

  const name = watch('name');
  const isPending = createMutation.isPending || updateMutation.isPending;
  const title = category ? t('editCategory') : t('createCategory');

  const finish = () => {
    reset({ name: '' });
    onOpenChange(false);
  };

  const onSubmit = form.handleSubmit((values) => {
    if (category) {
      updateMutation.mutate(
        { categoryId: category.id, input: values },
        { onSuccess: finish, onError: toastError(`category-update-${category.id}`) }
      );

      return;
    }

    createMutation.mutate(values, { onSuccess: finish, onError: toastError('category-create') });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<FolderPlus />} tone='violet'>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Stack as='form' gap='3' onSubmit={onSubmit}>
          <FormField error={errors.name?.message} htmlFor='category-name' label={t('nameLabel')}>
            <Input
              autoComplete='off'
              id='category-name'
              maxLength={CATEGORY_NAME_MAX_LENGTH}
              {...register('name')}
            />
          </FormField>

          <FormActions
            isDisabled={!name?.trim()}
            isPending={isPending}
            submitLabel={title}
            onCancel={() => onOpenChange(false)}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
