'use client';

import type { Ref } from 'react';

import { useAutoScroll } from '@siberiacancode/reactuse';
import { Paperclip } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment, useState } from 'react';
import { isEmpty, isNonNullish } from 'remeda';
import { match } from 'ts-pattern';

import { useRealtimeSubscribe } from '@/entities/app/realtime';
import { useCurrentUser } from '@/entities/auth/user';
import { Text } from '@/ui-kit';

import type { ChatConversationProps } from './ChatConversation.types';

import {
  useChatFiles,
  useChatHistory,
  useChatPins,
  useChatReactions,
  useChatSend,
  useChatSync,
  useMemberStyling
} from '../../model/hooks';
import { groupChatLines } from '../../model/lib';
import {
  ChatComposer,
  ChatEmpty,
  ChatError,
  ChatLoadingSkeleton,
  ChatMessageItem,
  DateDivider
} from '../components';

import s from './ChatConversation.module.scss';

export const ChatConversation = ({
  roomId,
  channelName = null,
  serverId = null,
  threadId = null,
  currentUserId,
  enabled = true,
  canSend = true,
  canModerate = false,
  onTyping
}: ChatConversationProps) => {
  const t = useTranslations('chat');

  useRealtimeSubscribe([roomId]);

  const { displayName } = useCurrentUser();

  const {
    messages,
    isPending: isHistoryPending,
    isError: isHistoryError,
    refetch: refetchHistory
  } = useChatHistory(roomId, threadId);
  const { byUserId } = useMemberStyling(serverId);

  const [replyToId, setReplyToId] = useState<string | null>(null);

  const replyTo = messages.find((line) => line.id === replyToId) ?? null;

  const { send, sendAttachment, retry, discard } = useChatSend({
    roomId,
    threadId,
    replyToId: replyTo?.id ?? null,
    sender: { identity: currentUserId, name: displayName }
  });
  const { edit, remove } = useChatSync(roomId, threadId);
  const { togglePin } = useChatPins(roomId, threadId);
  const { toggleReaction } = useChatReactions(roomId, threadId);

  const listRef = useAutoScroll<HTMLDivElement>();

  const sendAndClearReply = async (body: string) => {
    await send(body);
    setReplyToId(null);
  };

  const { dropRef, overed, isUploading, openPicker, onPaste } = useChatFiles({
    roomId,
    disabled: !enabled || !canSend,
    onSend: sendAttachment
  });

  const grouped = groupChatLines({ lines: messages, ownIdentity: currentUserId });

  const canDrop = enabled && canSend;

  return (
    <div ref={canDrop ? (dropRef as Ref<HTMLDivElement>) : undefined} className={s.root}>
      {canDrop && overed && (
        <div className={s.dropOverlay}>
          <Paperclip className={s.dropIcon} />
          {t('dropToSend')}
        </div>
      )}

      <div ref={listRef} className={s.scroll}>
        {match({ isHistoryPending, isHistoryError, isEmpty: isEmpty(messages) })
          .with({ isHistoryPending: true }, () => <ChatLoadingSkeleton />)
          .with({ isHistoryError: true }, () => <ChatError onRetry={refetchHistory} />)
          .with({ isEmpty: true }, () => <ChatEmpty channelName={channelName} />)
          .otherwise(() => (
            <div className={s.list}>
              {grouped.map(({ line, isOwn, isGrouped, isTail, showDivider }) => {
                const styling = byUserId.get(line.from?.identity ?? '');

                return (
                  <Fragment key={line.id}>
                    {showDivider && <DateDivider timestamp={line.timestamp} />}
                    <ChatMessageItem
                      repliedTo={
                        isNonNullish(line.replyToId)
                          ? (messages.find((item) => item.id === line.replyToId) ?? null)
                          : null
                      }
                      avatarUrl={styling?.avatarUrl}
                      canManage={isOwn || canModerate}
                      canPin={canModerate}
                      canReact={canSend}
                      currentUserId={currentUserId}
                      isGrouped={isGrouped}
                      isOwn={isOwn}
                      isTail={isTail}
                      message={line}
                      roleColor={styling?.roleColor}
                      onDelete={remove}
                      onDiscard={discard}
                      onEdit={edit}
                      onPin={togglePin}
                      onReply={canSend ? setReplyToId : undefined}
                      onRetry={retry}
                      onToggleReaction={toggleReaction}
                    />
                  </Fragment>
                );
              })}
            </div>
          ))}
      </div>

      {canSend ? (
        <ChatComposer
          isUploading={isUploading}
          replyTo={replyTo}
          serverId={serverId}
          onAttach={openPicker}
          onCancelReply={() => setReplyToId(null)}
          onPaste={onPaste}
          onSend={sendAndClearReply}
          onTyping={onTyping}
        />
      ) : (
        <Text className={s.readOnly} size='xs' tone='muted'>
          {t('readOnly')}
        </Text>
      )}
    </div>
  );
};
