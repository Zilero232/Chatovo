'use client';

import { useAutoScroll } from '@siberiacancode/reactuse';
import { Paperclip } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';
import { isEmpty, sortBy } from 'remeda';
import { match } from 'ts-pattern';

import { useRealtimeSubscribe } from '@/entities/app/realtime';
import { useCurrentUser } from '@/entities/auth/user';
import { useChatFiles, useChatHistory, useChatSend, useChatSync } from '../../model/hooks';
import { groupChatLines } from '../../model/lib';
import {
  ChatComposer,
  ChatEmpty,
  ChatLoadingSkeleton,
  ChatMessageItem,
  DateDivider,
} from '../components';

import s from './ChatConversation.module.scss';

import type { Ref } from 'react';
import type { ChatConversationProps } from './ChatConversation.types';

export const ChatConversation = ({
  roomId,
  currentUserId,
  enabled = true,
}: ChatConversationProps) => {
  const t = useTranslations('chat');

  useRealtimeSubscribe([roomId]);

  const { displayName } = useCurrentUser();

  const { messages: history, isPending: isHistoryPending } = useChatHistory(roomId);
  const { send, retry, discard } = useChatSend({
    roomId,
    sender: { identity: currentUserId, name: displayName },
  });
  const { edit, remove } = useChatSync(roomId);

  const listRef = useAutoScroll<HTMLDivElement>();

  const { dropRef, overed, isUploading, openPicker, onPaste } = useChatFiles({
    roomId,
    disabled: !enabled,
    onSend: (body) => send(body),
  });

  const messages = sortBy(history, (line) => line.timestamp);
  const grouped = groupChatLines(messages, currentUserId);

  return (
    <div ref={dropRef as Ref<HTMLDivElement>} className={s.root}>
      {overed && (
        <div className={s.dropOverlay}>
          <Paperclip className={s.dropIcon} />
          {t('dropToSend')}
        </div>
      )}

      <div ref={listRef} className={s.scroll}>
        {match({ isHistoryPending, isEmpty: isEmpty(messages) })
          .with({ isHistoryPending: true }, () => <ChatLoadingSkeleton />)
          .with({ isEmpty: true }, () => <ChatEmpty />)
          .otherwise(() => (
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
                    onRetry={retry}
                    onDiscard={discard}
                  />
                </Fragment>
              ))}
            </div>
          ))}
      </div>

      <ChatComposer
        isUploading={isUploading}
        onSend={send}
        onAttach={openPicker}
        onPaste={onPaste}
      />
    </div>
  );
};
