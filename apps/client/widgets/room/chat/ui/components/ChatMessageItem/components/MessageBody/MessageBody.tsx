'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';
import { MessageEditor } from '../MessageEditor';
import { messageBodyStyles as s } from './MessageBody.styles';
import type { MessageBodyProps } from './MessageBody.types';

export const MessageBody = ({
  message,
  bubble,
  isDeleted,
  isEditing,
  onEdit,
  onStopEdit,
}: MessageBodyProps) => {
  const t = useTranslations('chat');

  return match({ isDeleted, isEditing })
    .with({ isDeleted: true }, () => <div className={s.deleted}>{t('deletedPlaceholder')}</div>)
    .with({ isEditing: true }, () => (
      <MessageEditor
        initialValue={message.message}
        onSave={(body) => {
          onEdit(message.id, body);
          onStopEdit();
        }}
        onCancel={onStopEdit}
      />
    ))
    .otherwise(() => bubble);
};
