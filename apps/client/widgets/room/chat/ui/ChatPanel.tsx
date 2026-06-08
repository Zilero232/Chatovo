'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useAutoScroll } from '@siberiacancode/reactuse';
import { Paperclip } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';
import { isEmpty, sortBy } from 'remeda';
import { useRoomChat } from '../model/contexts';
import {
  useChatFiles,
  useChatHistory,
  useChatLiveMerge,
  useChatSend,
  useChatSync,
} from '../model/hooks';
import { groupChatLines } from '../model/lib';
import { chatPanelStyles as s } from './ChatPanel.styles';
import { ChatComposer, ChatEmpty, ChatHeader, ChatMessageItem, DateDivider } from './components';
import type { ChatPanelProps } from './ChatPanel.types';

export const ChatPanel = ({ roomId, isOpen, onClose }: ChatPanelProps) => {
  const t = useTranslations('chat');

  const { isSending } = useRoomChat();
  const { localParticipant } = useLocalParticipant();

  useChatLiveMerge(roomId);

  const history = useChatHistory(roomId);
  const { sendAndPersist } = useChatSend(roomId);
  const { edit, remove } = useChatSync(roomId);

  const listRef = useAutoScroll<HTMLDivElement>();

  const { dropRef, overed, isUploading, openPicker, onPaste } = useChatFiles({
    roomId,
    disabled: isSending,
    onSend: sendAndPersist,
  });

  const messages = sortBy(history, (line) => line.timestamp);

  const grouped = groupChatLines(messages, localParticipant.identity);

  return (
    <aside ref={dropRef} className={s.root} data-open={isOpen} inert={!isOpen}>
      <ChatHeader onClose={onClose} />

      {overed && (
        <div className={s.dropOverlay}>
          <Paperclip className="size-6" />
          {t('dropToSend')}
        </div>
      )}

      <div ref={listRef} className={s.scroll}>
        {isEmpty(messages) ? (
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
        onSend={sendAndPersist}
        onAttach={openPicker}
        onPaste={onPaste}
      />
    </aside>
  );
};
