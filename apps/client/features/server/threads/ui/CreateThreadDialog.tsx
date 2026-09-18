'use client';

import type { CreateThreadRequest } from '@chatovo/schemas';

import { createThreadInputSchema, THREAD_NAME_MAX_LENGTH } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessagesSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { isEmpty } from 'remeda';

import { useToastError } from '@/entities/app/locale';
import { ThreadTagChip, useCreateThread, useThreadTags } from '@/entities/server/thread';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormActions,
  FormField,
  Input,
  Row,
  Stack,
  Textarea
} from '@/ui-kit';

import type { CreateThreadDialogProps } from './CreateThreadDialog.types';

const DEFAULT_VALUES: CreateThreadRequest = { name: '', firstMessage: '', tagIds: [] };

export const CreateThreadDialog = ({
  channelId,
  open,
  onOpenChange,
  onCreated
}: CreateThreadDialogProps) => {
  const t = useTranslations('server.threads');
  const toastError = useToastError();

  const { tags } = useThreadTags(open ? channelId : null);
  const createMutation = useCreateThread(channelId);

  const form = useForm<CreateThreadRequest>({
    resolver: zodResolver(createThreadInputSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES
  });

  const {
    control,
    formState: { errors },
    register,
    watch,
    reset
  } = form;

  const name = watch('name');

  const onSubmit = form.handleSubmit((values) => {
    createMutation.mutate(
      { ...values, firstMessage: values.firstMessage?.trim() || undefined },
      {
        onSuccess: (thread) => {
          reset(DEFAULT_VALUES);
          onOpenChange(false);
          onCreated?.(thread.id);
        },
        onError: toastError(`thread-create-${channelId}`)
      }
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<MessagesSquare />} tone='cyan'>
          <DialogTitle>{t('create')}</DialogTitle>
        </DialogHeader>

        <Stack as='form' gap='3' onSubmit={onSubmit}>
          <FormField error={errors.name?.message} htmlFor='thread-name' label={t('nameLabel')}>
            <Input
              autoComplete='off'
              id='thread-name'
              maxLength={THREAD_NAME_MAX_LENGTH}
              placeholder={t('namePlaceholder')}
              {...register('name')}
            />
          </FormField>

          {!isEmpty(tags) && (
            <Stack gap='1'>
              <span className='sr-only' id='thread-tags-label'>
                {t('tags')}
              </span>
              <Controller
                render={({ field }) => (
                  <Row wrap aria-labelledby='thread-tags-label' gap='1'>
                    {tags.map((tag) => {
                      const selected = field.value ?? [];

                      return (
                        <ThreadTagChip
                          key={tag.id}
                          isActive={selected.includes(tag.id)}
                          tag={tag}
                          onToggle={(tagId) =>
                            field.onChange(
                              selected.includes(tagId)
                                ? selected.filter((id) => id !== tagId)
                                : [...selected, tagId]
                            )
                          }
                        />
                      );
                    })}
                  </Row>
                )}
                control={control}
                name='tagIds'
              />
            </Stack>
          )}

          <FormField
            error={errors.firstMessage?.message}
            htmlFor='thread-first-message'
            label={t('firstMessageLabel')}
          >
            <Textarea id='thread-first-message' rows={3} {...register('firstMessage')} />
          </FormField>

          <FormActions
            isDisabled={!name?.trim()}
            isPending={createMutation.isPending}
            submitLabel={t('create')}
            onCancel={() => onOpenChange(false)}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
