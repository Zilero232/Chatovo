'use client';

import { useChat, useLocalParticipant } from '@livekit/components-react';
import { Box, ScrollArea, Stack } from '@mantine/core';
import { useEffect, useMemo, useRef, useState } from 'react';

import { groupMessages } from '../lib/grouping';
import type { RawMessage } from '../model/types';
import { useChatUpload } from '../model/use-chat-upload';
import { ChatComposer } from './components/ChatComposer';
import { ChatEmpty } from './components/ChatEmpty';
import { ChatMessageList } from './components/ChatMessageList';

const SURFACE =
  'linear-gradient(180deg, var(--mantine-color-dark-8) 0%, var(--mantine-color-dark-9) 100%)';

export const ChatPanel = () => {
  const { chatMessages, send, isSending } = useChat();
  const { localParticipant } = useLocalParticipant();
  const [input, setInput] = useState('');
  const viewportRef = useRef<HTMLDivElement>(null);
  const { uploadFile, uploading } = useChatUpload(send);

  const groups = useMemo(() => groupMessages(chatMessages as RawMessage[]), [chatMessages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    viewportRef.current?.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatMessages.length]);

  const sendText = async () => {
    const body = input.trim();
    if (!body || !send) return;
    await send(JSON.stringify({ type: 'text', body }));
    setInput('');
  };

  return (
    <Stack h="100%" gap={0} style={{ background: SURFACE }}>
      <ScrollArea
        flex={1}
        viewportRef={viewportRef}
        type="hover"
        scrollbarSize={6}
        offsetScrollbars
      >
        {groups.length === 0 ? (
          <ChatEmpty />
        ) : (
          <ChatMessageList groups={groups} selfIdentity={localParticipant.identity} />
        )}
      </ScrollArea>
      <Box p="sm" style={{ borderTop: '1px solid var(--mantine-color-dark-6)' }}>
        <ChatComposer
          value={input}
          isSending={isSending}
          uploading={uploading}
          onChange={setInput}
          onSend={sendText}
          onUpload={uploadFile}
        />
      </Box>
    </Stack>
  );
};
