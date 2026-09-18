'use client';

import { THREAD_TAG_NAME_MAX_LENGTH } from '@chatovo/schemas';
import { Plus, Tags, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { isEmpty } from 'remeda';

import { useToastError } from '@/entities/app/locale';
import { useCreateThreadTag, useDeleteThreadTag, useThreadTags } from '@/entities/server/thread';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Row,
  Stack,
  Text
} from '@/ui-kit';

import type { ThreadTagsDialogProps } from './ThreadTagsDialog.types';

import s from './ThreadTagsDialog.module.scss';

export const ThreadTagsDialog = ({ channelId, open, onOpenChange }: ThreadTagsDialogProps) => {
  const t = useTranslations('server.threads');
  const toastError = useToastError();

  const { tags } = useThreadTags(open ? channelId : null);
  const createMutation = useCreateThreadTag(channelId);
  const deleteMutation = useDeleteThreadTag(channelId);

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      return;
    }

    createMutation.mutate(
      { name: trimmed, emoji: emoji.trim() || undefined },
      {
        onSuccess: () => {
          setName('');
          setEmoji('');
        },
        onError: toastError(`thread-tag-create-${channelId}`)
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<Tags />} tone='cyan'>
          <DialogTitle>{t('manageTags')}</DialogTitle>
        </DialogHeader>

        <Stack gap='3'>
          <Row align='end' as='form' gap='2' onSubmit={submit}>
            <Input
              aria-label={t('tagEmoji')}
              className={s.emoji}
              maxLength={4}
              placeholder='🏷'
              value={emoji}
              onChange={(event) => setEmoji(event.target.value)}
            />
            <Input
              aria-label={t('tagName')}
              maxLength={THREAD_TAG_NAME_MAX_LENGTH}
              placeholder={t('tagName')}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Button disabled={!name.trim() || createMutation.isPending} type='submit'>
              <Plus />
            </Button>
          </Row>

          {isEmpty(tags) ? (
            <Text size='sm' tone='muted'>
              {t('noTags')}
            </Text>
          ) : (
            <Stack gap='1'>
              {tags.map((tag) => (
                <Row key={tag.id} align='center' className={s.row} gap='2' justify='between'>
                  <span className={s.label}>
                    {tag.emoji && <span aria-hidden>{tag.emoji}</span>}
                    {tag.name}
                  </span>
                  <Button
                    aria-label={t('deleteTag')}
                    disabled={deleteMutation.isPending}
                    size='icon-xs'
                    type='button'
                    variant='ghost'
                    onClick={() =>
                      deleteMutation.mutate(tag.id, {
                        onError: toastError(`thread-tag-delete-${tag.id}`)
                      })
                    }
                  >
                    <Trash2 />
                  </Button>
                </Row>
              ))}
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
