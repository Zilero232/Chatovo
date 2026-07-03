'use client';

import { useAutoScroll } from '@siberiacancode/reactuse';
import { Paperclip } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';
import { isEmpty, sortBy } from 'remeda';
import { useRealtimeSubscribe } from '@/entities/app/realtime';
import { useChatFiles, useChatHistory, useChatSend, useChatSync } from '../../model/hooks';
import { groupChatLines } from '../../model/lib';
import {
  ChatComposer,
  ChatEmpty,
  ChatLoadingSkeleton,
  ChatMessageItem,
  DateDivider,
} from '../components';
import { chatConversationStyles as s } from './ChatConversation.styles';
import type { Ref } from 'react';
import type { ChatConversationProps } from './ChatConversation.types';

export const ChatConversation = ({
  roomId,
  currentUserId,
  enabled = true,
}: ChatConversationProps) => {
  const t = useTranslations('chat');

  useRealtimeSubscribe([roomId]);

  const { messages: history, isPending: isHistoryPending } = useChatHistory(roomId);
  const { mutateAsync: sendAndPersist, isPending: isSending } = useChatSend(roomId);
  const { edit, remove } = useChatSync(roomId);

  const listRef = useAutoScroll<HTMLDivElement>();

  const { dropRef, overed, isUploading, openPicker, onPaste } = useChatFiles({
    roomId,
    disabled: isSending || !enabled,
    onSend: (body) => sendAndPersist(body),
  });

  const messages = sortBy(history, (line) => line.timestamp);
  const grouped = groupChatLines(messages, currentUserId);

  return (
    <div ref={dropRef as Ref<HTMLDivElement>} className={s.root}>
      {overed && (
        <div className={s.dropOverlay}>
          <Paperclip className="size-6" />
          {t('dropToSend')}
        </div>
      )}

      <div ref={listRef} className={s.scroll}>
        {isHistoryPending ? (
          <ChatLoadingSkeleton />
        ) : isEmpty(messages) ? (
          <ChatEmpty />
        ) : (
          <div className={s.list}>
            {grouped.map(({ line, isOwn, isGrouped, isTail, showDivider }) => (
              <Fragment key={line.id}>
                {showDivider && <DateDivider timestamp={line.timestamp} />}
                <ChatMessageItem
                  message={line}
                  isOwn={isOwn}
                  isGrouped={isGrouped}
                  isTail={isTail}
                  canManage={isOwn}
                  onEdit={edit}
                  onDelete={remove}
                />
              </Fragment>
            ))}
          </div>
        )}
      </div>

      <ChatComposer
        isSending={isSending}
        isUploading={isUploading}
        onSend={async (body) => {
          await sendAndPersist(body);
        }}
        onAttach={openPicker}
        onPaste={onPaste}
      />
    </div>
  );
};
