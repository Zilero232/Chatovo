'use client';

import { decodeChatAttachment, isImageMime } from '@chatovo/schemas';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import prettyBytes from 'pretty-bytes';

import { Row, Text } from '@/ui-kit';

import type { MessageItemProps } from './MessageItem.types';

import { formatAdminDate } from '../../../../../../../../../lib';

import s from './MessageItem.module.scss';

export const MessageItem = ({ message }: MessageItemProps) => {
  const t = useTranslations('admin');

  const attachment = message.deletedAt ? null : decodeChatAttachment(message.body);

  return (
    <article className={s.root}>
      {message.deletedAt && (
        <Text size='sm' tone='muted'>
          {t('users.deletedMessage')}
        </Text>
      )}

      {!message.deletedAt && attachment && (
        <Row align='center' className={s.attachment} gap='2'>
          {isImageMime(attachment.mime) ? (
            <ImageIcon className={s.icon} />
          ) : (
            <FileText className={s.icon} />
          )}

          <a className={s.link} href={attachment.url} rel='noopener noreferrer' target='_blank'>
            {attachment.name}
          </a>

          <Text size='xs' tone='muted'>
            {prettyBytes(attachment.size)}
          </Text>
        </Row>
      )}

      {!message.deletedAt && !attachment && (
        <Text className={s.body} size='sm'>
          {message.body}
        </Text>
      )}

      <Text size='xs' tone='muted'>
        {message.roomName ?? message.roomId} · {formatAdminDate(message.createdAt)}
        {message.editedAt && ` · ${t('users.edited')}`}
      </Text>
    </article>
  );
};
